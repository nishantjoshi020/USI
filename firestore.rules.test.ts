/**
 * Firestore Security Rules Specification Tests (Dirty Dozen Verification)
 * Verifies that all 12 adversarial payloads defined in security_spec.md
 * return PERMISSION_DENIED against firestore.rules.
 */

export interface DirtyDozenTestCase {
  id: number;
  name: string;
  collection: string;
  docId: string;
  operation: 'create' | 'update' | 'get' | 'list' | 'delete';
  auth: { uid: string; email_verified: boolean } | null;
  payload?: Record<string, unknown>;
  expectedResult: 'PERMISSION_DENIED';
}

export const DIRTY_DOZEN_TEST_CASES: DirtyDozenTestCase[] = [
  {
    id: 1,
    name: 'Unverified Email Spoof',
    collection: 'athletes',
    docId: 'ath-arjun',
    operation: 'create',
    auth: { uid: 'user_1', email_verified: false },
    payload: { ownerId: 'user_1', athleteId: 'ath-arjun', name: 'Arjun Mehta' },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 2,
    name: 'Cross-Tenant Ownership Spoof on Create',
    collection: 'athletes',
    docId: 'ath-arjun',
    operation: 'create',
    auth: { uid: 'user_1', email_verified: true },
    payload: { ownerId: 'user_2', athleteId: 'ath-arjun', name: 'Arjun Mehta' },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 3,
    name: 'Shadow Field Injection on Create',
    collection: 'athletes',
    docId: 'ath-arjun',
    operation: 'create',
    auth: { uid: 'user_1', email_verified: true },
    payload: { ownerId: 'user_1', athleteId: 'ath-arjun', isSuperAdmin: true },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 4,
    name: 'ID Poisoning Attack',
    collection: 'athletes',
    docId: 'invalid$id!spaces',
    operation: 'create',
    auth: { uid: 'user_1', email_verified: true },
    payload: { ownerId: 'user_1', athleteId: 'invalid$id!spaces' },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 5,
    name: 'Denial-of-Wallet Oversized String',
    collection: 'ai_messages',
    docId: 'msg-1',
    operation: 'create',
    auth: { uid: 'user_1', email_verified: true },
    payload: { ownerId: 'user_1', messageId: 'msg-1', content: 'x'.repeat(9000) },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 6,
    name: 'Orphaned Injury Creation Without Existing Parent Athlete',
    collection: 'injuries',
    docId: 'inj-orphan',
    operation: 'create',
    auth: { uid: 'user_1', email_verified: true },
    payload: { ownerId: 'user_1', injuryId: 'inj-orphan', athleteId: 'nonexistent-athlete' },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 7,
    name: 'Client Timestamp Forgery',
    collection: 'training_sessions',
    docId: 'ses-1',
    operation: 'create',
    auth: { uid: 'user_1', email_verified: true },
    payload: { ownerId: 'user_1', sessionId: 'ses-1', createdAt: '2020-01-01T00:00:00Z' },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 8,
    name: 'Immutable Field Mutation (ownerId)',
    collection: 'athletes',
    docId: 'ath-arjun',
    operation: 'update',
    auth: { uid: 'user_1', email_verified: true },
    payload: { ownerId: 'user_2' },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 9,
    name: 'Terminal State Bypass on Archived Training Session',
    collection: 'training_sessions',
    docId: 'ses-archived',
    operation: 'update',
    auth: { uid: 'user_1', email_verified: true },
    payload: { plannedLoad: 'Low' },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 10,
    name: 'Terminal State Bypass on Closed Injury Record',
    collection: 'injuries',
    docId: 'inj-closed',
    operation: 'update',
    auth: { uid: 'user_1', email_verified: true },
    payload: { rtpStage: 5 },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 11,
    name: 'Value Poisoning on Whitelisted Update Key',
    collection: 'athletes',
    docId: 'ath-arjun',
    operation: 'update',
    auth: { uid: 'user_1', email_verified: true },
    payload: { medicalStatus: 'INVALID_ENUM_VALUE' },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 12,
    name: 'Cross-Tenant Get/List Access',
    collection: 'athletes',
    docId: 'ath-other-tenant',
    operation: 'get',
    auth: { uid: 'user_1', email_verified: true },
    expectedResult: 'PERMISSION_DENIED',
  },
];
