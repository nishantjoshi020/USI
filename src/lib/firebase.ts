import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDocFromServer,
  setDoc,
  collection,
  query,
  where,
  onSnapshot,
  serverTimestamp,
  getDocs,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import {
  AICopilotMessage,
  Athlete,
  Injury,
  TrainingSession,
} from '../types/usi';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Validate connection on boot per Firebase skill directive
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes('the client is offline')
    ) {
      console.error('Please check your Firebase configuration.');
    }
  }
}
testConnection();

// Blueprint-synchronicity sanitization utilities
const SAFE_ID_REGEX = /^[a-zA-Z0-9_\-]+$/;

export function sanitizeShortId(raw: string, fallback = 'id-default'): string {
  const cleaned = String(raw || fallback)
    .replace(/[^a-zA-Z0-9_\-]/g, '-')
    .slice(0, 64);
  return SAFE_ID_REGEX.test(cleaned) && cleaned.length >= 1
    ? cleaned
    : fallback;
}

export function clampString(
  val: string | undefined | null,
  minLen: number,
  maxLen: number,
  fallback = 'N/A'
): string {
  const str = String(val ?? '').trim();
  if (str.length < minLen) return fallback.slice(0, maxLen);
  return str.slice(0, maxLen);
}

export function clampNumber(
  val: number | undefined | null,
  min: number,
  max: number,
  fallback = 0
): number {
  const num = Number(val);
  if (Number.isNaN(num)) return fallback;
  return Math.min(max, Math.max(min, num));
}

export async function signInWithGoogle(): Promise<User | null> {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

export async function signOutUser(): Promise<void> {
  await firebaseSignOut(auth);
}

export { onAuthStateChanged };
export type { User };

// ============================================================================
// Firestore Persistence Operations (matching firebase-blueprint.json)
// ============================================================================

export async function persistAthleteRecord(athlete: Athlete): Promise<void> {
  const user = auth.currentUser;
  if (!user || !user.emailVerified) return;

  const docId = `${sanitizeShortId(user.uid.slice(0, 20))}_${sanitizeShortId(athlete.id, 'ath-1')}`.slice(0, 64);
  const path = `athletes/${docId}`;

  const validMedical = ['Cleared', 'Modified', 'Restricted', 'Injured'].includes(
    athlete.medicalStatus
  )
    ? athlete.medicalStatus
    : 'Cleared';

  const validAvailability =
    athlete.trainingStatus === 'INJURED' || athlete.status === 'Unavailable'
      ? 'Unavailable'
      : athlete.trainingStatus === 'RESTRICTED' ||
          athlete.trainingStatus === 'IN REHAB' ||
          athlete.status === 'Restricted'
        ? 'Modified'
        : 'Available';

  const validRisk = ['Low', 'Moderate', 'Elevated', 'High'].includes(
    athlete.injuryRisk
  )
    ? athlete.injuryRisk
    : 'Low';

  try {
    const existingSnap = await getDocs(
      query(
        collection(db, 'athletes'),
        where('ownerId', '==', user.uid),
        where('athleteId', '==', docId)
      )
    );
    const isExisting = !existingSnap.empty;
    const existingCreatedAt = isExisting
      ? existingSnap.docs[0].data().createdAt
      : serverTimestamp();

    await setDoc(doc(db, 'athletes', docId), {
      ownerId: user.uid,
      athleteId: docId,
      name: clampString(athlete.name, 1, 120, 'Athlete'),
      sport: clampString(athlete.sport, 1, 80, 'Football'),
      squad: clampString(athlete.squad, 1, 80, 'Senior Squad'),
      position: clampString(athlete.position, 1, 80, 'Player'),
      readiness: clampNumber(athlete.readiness, 0, 100, 75),
      recovery: clampNumber(athlete.recovery, 0, 100, 75),
      fatigue: clampNumber(Math.round((10 - (athlete.wellnessScore || 7)) * 10), 0, 100, 30),
      acwr: clampNumber(athlete.acwr, 0, 5, 1.0),
      weeklyLoad: clampNumber(athlete.acuteLoadAu * 3, 0, 20000, 1800),
      medicalStatus: validMedical,
      availability: validAvailability,
      riskLevel: validRisk,
      hydrationLitres: 2.8,
      nutritionCompliancePct: clampNumber(
        athlete.nutritionCompliancePct ?? 85,
        0,
        100,
        85
      ),
      createdAt: existingCreatedAt,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function persistTrainingSessionRecord(
  session: TrainingSession & {
    venueAddress?: string;
    venuePlaceId?: string;
    venueLat?: number;
    venueLng?: number;
    venueMapsUri?: string;
  }
): Promise<void> {
  const user = auth.currentUser;
  if (!user || !user.emailVerified) return;

  const docId = `${sanitizeShortId(user.uid.slice(0, 20))}_${sanitizeShortId(session.id, 'ses-1')}`.slice(0, 64);
  const path = `training_sessions/${docId}`;

  const validLoad =
    session.intensity === 'Low'
      ? 'Low'
      : session.intensity === 'High'
        ? 'High'
        : 'Medium';

  const rawStatus = session.status || 'Scheduled';
  const validStatus = [
    'Draft',
    'Scheduled',
    'In Progress',
    'Completed',
    'Archived',
  ].includes(rawStatus)
    ? rawStatus
    : 'Scheduled';

  try {
    const existingSnap = await getDocs(
      query(
        collection(db, 'training_sessions'),
        where('ownerId', '==', user.uid),
        where('sessionId', '==', docId)
      )
    );
    const isExisting = !existingSnap.empty;
    const existingCreatedAt = isExisting
      ? existingSnap.docs[0].data().createdAt
      : serverTimestamp();

    await setDoc(doc(db, 'training_sessions', docId), {
      ownerId: user.uid,
      sessionId: docId,
      title: clampString(session.title, 1, 160, 'Training Session'),
      type: clampString(session.category, 1, 64, 'Conditioning'),
      squad: clampString(session.squad, 1, 80, 'Senior Squad'),
      date: clampString(session.day || 'Today', 1, 40, 'Today'),
      startTime: clampString(session.time, 1, 20, '09:30'),
      durationMin: clampNumber(session.durationMin, 5, 600, 75),
      plannedLoad: validLoad,
      venue: clampString(session.pitchOrVenue, 1, 200, 'Main Pitch A'),
      venueAddress: clampString(session.venueAddress || '', 0, 300, ''),
      venuePlaceId: clampString(session.venuePlaceId || '', 0, 128, ''),
      venueLat: clampNumber(session.venueLat ?? 19.076, -90, 90, 19.076),
      venueLng: clampNumber(session.venueLng ?? 72.8777, -180, 180, 72.8777),
      venueMapsUri: clampString(session.venueMapsUri || '', 0, 500, ''),
      sessionStatus: validStatus,
      coach: clampString(session.coach, 1, 120, 'Head Coach'),
      createdAt: existingCreatedAt,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function persistInjuryRecord(injury: Injury): Promise<void> {
  const user = auth.currentUser;
  if (!user || !user.emailVerified) return;

  const docId = `${sanitizeShortId(user.uid.slice(0, 20))}_${sanitizeShortId(injury.id, 'inj-1')}`.slice(0, 64);
  const athleteDocId = `${sanitizeShortId(user.uid.slice(0, 20))}_${sanitizeShortId(injury.athleteId, 'ath-1')}`.slice(0, 64);
  const path = `injuries/${docId}`;

  const validSide = ['Left', 'Right', 'Bilateral', 'Central'].includes(
    injury.side
  )
    ? injury.side
    : 'Left';
  const validSeverity = ['Minor', 'Moderate', 'Severe'].includes(
    injury.severity
  )
    ? injury.severity
    : 'Moderate';
  const validStatus =
    injury.medicalStatus === 'Cleared'
      ? 'Cleared'
      : injury.stage === 'Return-to-Play'
        ? 'RTP'
        : injury.stage === 'In Rehabilitation'
          ? 'Rehab'
          : 'Active';

  try {
    const existingSnap = await getDocs(
      query(
        collection(db, 'injuries'),
        where('ownerId', '==', user.uid),
        where('injuryId', '==', docId)
      )
    );
    const isExisting = !existingSnap.empty;
    const existingCreatedAt = isExisting
      ? existingSnap.docs[0].data().createdAt
      : serverTimestamp();

    await setDoc(doc(db, 'injuries', docId), {
      ownerId: user.uid,
      injuryId: docId,
      athleteId: athleteDocId,
      athleteName: clampString(injury.athleteName, 1, 120, 'Athlete'),
      diagnosis: clampString(injury.diagnosis, 1, 200, 'Injury Assessment'),
      bodyArea: clampString(injury.bodyRegionDisplay || injury.bodyPart, 1, 80, 'Hamstring'),
      side: validSide,
      severity: validSeverity,
      injuryStatus: validStatus,
      rtpStage: clampNumber(injury.rtpStage, 1, 5, 1),
      painScore: clampNumber(injury.painScore ?? 2, 0, 10, 2),
      physiotherapist: clampString(
        injury.leadClinician,
        1,
        120,
        'Lead Physiotherapist'
      ),
      createdAt: existingCreatedAt,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function persistAICopilotMessage(
  msg: AICopilotMessage,
  sourceModality: 'text' | 'voice' | 'maps' = 'text'
): Promise<void> {
  const user = auth.currentUser;
  if (!user || !user.emailVerified) return;

  const docId = `${sanitizeShortId(user.uid.slice(0, 20))}_${sanitizeShortId(msg.id, 'msg-1')}`.slice(0, 64);
  const path = `ai_messages/${docId}`;

  const validConfidence = ['High', 'Medium', 'Low'].includes(
    msg.confidence || 'High'
  )
    ? (msg.confidence as string)
    : 'High';

  try {
    await setDoc(doc(db, 'ai_messages', docId), {
      ownerId: user.uid,
      messageId: docId,
      role: msg.sender === 'user' ? 'user' : 'assistant',
      timestamp: clampString(msg.timestamp, 1, 40, 'Just now'),
      content: clampString(
        msg.queryText || msg.answerStatement || msg.answerTitle || 'Copilot message',
        1,
        8000,
        'Copilot message'
      ),
      confidence: validConfidence,
      sourceModality,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function persistAuditEvent(event: {
  id: string;
  module: string;
  action: string;
  actorRole: string;
  timestamp: string;
}): Promise<void> {
  const user = auth.currentUser;
  if (!user || !user.emailVerified) return;

  const docId = `${sanitizeShortId(user.uid.slice(0, 20))}_${sanitizeShortId(event.id, 'aud-1')}`.slice(0, 64);
  const path = `audit_events/${docId}`;

  try {
    await setDoc(doc(db, 'audit_events', docId), {
      ownerId: user.uid,
      eventId: docId,
      module: clampString(event.module, 1, 64, 'System'),
      action: clampString(event.action, 1, 300, 'Operational update'),
      actorRole: clampString(event.actorRole, 1, 80, 'Performance Director'),
      timestampLabel: clampString(event.timestamp, 1, 40, 'Just now'),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export function subscribeToUserWorkspace(
  userId: string,
  callbacks: {
    onAthletesSnapshot: (records: Record<string, any>[]) => void;
    onSessionsSnapshot: (records: Record<string, any>[]) => void;
    onMessagesSnapshot: (records: Record<string, any>[]) => void;
  }
): () => void {
  const athletesQ = query(
    collection(db, 'athletes'),
    where('ownerId', '==', userId)
  );
  const sessionsQ = query(
    collection(db, 'training_sessions'),
    where('ownerId', '==', userId)
  );
  const messagesQ = query(
    collection(db, 'ai_messages'),
    where('ownerId', '==', userId)
  );

  const unsubAthletes = onSnapshot(
    athletesQ,
    (snap) => {
      callbacks.onAthletesSnapshot(snap.docs.map((d) => d.data()));
    },
    (err) => {
      handleFirestoreError(err, OperationType.LIST, 'athletes');
    }
  );

  const unsubSessions = onSnapshot(
    sessionsQ,
    (snap) => {
      callbacks.onSessionsSnapshot(snap.docs.map((d) => d.data()));
    },
    (err) => {
      handleFirestoreError(err, OperationType.LIST, 'training_sessions');
    }
  );

  const unsubMessages = onSnapshot(
    messagesQ,
    (snap) => {
      callbacks.onMessagesSnapshot(snap.docs.map((d) => d.data()));
    },
    (err) => {
      handleFirestoreError(err, OperationType.LIST, 'ai_messages');
    }
  );

  return () => {
    unsubAthletes();
    unsubSessions();
    unsubMessages();
  };
}
