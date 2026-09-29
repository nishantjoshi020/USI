# USI Firestore Security Specification (Phase 0 TDD)

## 1. Data Invariants

1. **Global Default Deny**: Any path not explicitly matched in `firestore.rules` is unconditionally denied (`allow read, write: if false;`).
2. **Authenticated & Verified Identity**: Every read and write operation requires `request.auth != null` and `request.auth.token.email_verified == true`.
3. **Strict Ownership Isolation**: Every document across `/athletes/{athleteId}`, `/training_sessions/{sessionId}`, `/injuries/{injuryId}`, `/ai_messages/{messageId}`, and `/audit_events/{eventId}` is owned by `ownerId == request.auth.uid`. Blanket reads (`allow read: if isSignedIn();`) are strictly forbidden; `get` and `list` must enforce `resource.data.ownerId == request.auth.uid`.
4. **Relational Integrity (Master Gate)**: An `InjuryRecord` (`/injuries/{injuryId}`) cannot be created unless its referenced parent athlete document (`/athletes/$(incoming().athleteId)`) exists and belongs to `request.auth.uid`.
5. **Path Variable & Payload Size Hardening**: All document IDs and reference IDs must match `^[a-zA-Z0-9_\-]+$` with bounded length (`<= 128` or `<= 64`). Every string field has explicit `.size()` bounds matching `firebase-blueprint.json`.
6. **Anti-Update-Gap & Action-Based Updates**: Every `update` rule begins with `isValid[Entity](incoming())`, locks immutable fields (`ownerId`, `createdAt`, primary IDs), enforces `incoming().updatedAt == request.time`, and restricts modified keys via `incoming().diff(existing()).affectedKeys().hasOnly(...)`.
7. **Terminal State Locking**:
   - `TrainingSessionRecord` documents with `sessionStatus == 'Archived'` cannot be updated.
   - `InjuryRecord` documents with `injuryStatus == 'Closed'` cannot be updated.
   - `AuditEventRecord` documents are append-only (no updates or deletes permitted).

## 2. The "Dirty Dozen" Adversarial Payloads

1. **Unverified Email Spoof**: Authenticated user with `email_verified: false` attempting to create an `AthleteRecord` -> `PERMISSION_DENIED`.
2. **Cross-Tenant Ownership Spoof (`create`)**: User `uid_A` attempting to create `/athletes/ath_1` with `ownerId: "uid_B"` -> `PERMISSION_DENIED`.
3. **Shadow/Ghost Field Injection (`create`)**: Creating `/athletes/ath_1` with an extra undeclared property `isSuperAdmin: true` -> `PERMISSION_DENIED` via `keys().hasOnly(...)`.
4. **ID Poisoning Attack**: Creating `/athletes/invalid$id!with spaces` or a 500-char ID -> `PERMISSION_DENIED` via `isValidId()`.
5. **Denial-of-Wallet Oversized String**: Updating `/ai_messages/msg_1` with a 50,000-character `content` string -> `PERMISSION_DENIED` via `data.content.size() <= 8000`.
6. **Orphaned Injury Creation**: Creating `/injuries/inj_99` referencing a non-existent `/athletes/non_existent_athlete` -> `PERMISSION_DENIED` via `exists()` and `get().data.ownerId == request.auth.uid`.
7. **Client Timestamp Forgery**: Creating or updating a document with a hardcoded past/future timestamp instead of `request.time` -> `PERMISSION_DENIED`.
8. **Immutable Field Mutation (`ownerId` / `createdAt`)**: Updating `/athletes/ath_1` to transfer `ownerId` or alter `createdAt` -> `PERMISSION_DENIED`.
9. **Terminal State Bypass (`TrainingSessionRecord`)**: Attempting to update `venue` or `plannedLoad` on a session whose `sessionStatus` is already `'Archived'` -> `PERMISSION_DENIED`.
10. **Terminal State Bypass (`InjuryRecord`)**: Attempting to update `rtpStage` on an injury whose `injuryStatus` is already `'Closed'` -> `PERMISSION_DENIED`.
11. **Value Poisoning on Whitelisted Update Key**: Updating `medicalStatus` on `/athletes/ath_1` to `"SuperCleared"` (not in enum) or a number -> `PERMISSION_DENIED` via `isValidAthleteRecord(incoming())`.
12. **Unfiltered List Query Scraping**: Executing a collection-wide `list` query on `/athletes` without `where('ownerId', '==', request.auth.uid)` -> `PERMISSION_DENIED` via `existing().ownerId == request.auth.uid`.
