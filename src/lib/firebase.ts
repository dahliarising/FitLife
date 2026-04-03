import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  signInAnonymously,
  onAuthStateChanged,
  Auth,
  User,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  Firestore,
} from 'firebase/firestore';

// Firebase config — .env.local에서 설정
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? '',
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

function isConfigured(): boolean {
  return !!firebaseConfig.apiKey && !!firebaseConfig.projectId;
}

function getApp(): FirebaseApp {
  if (!app) {
    app = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);
  }
  return app;
}

function getAuthInstance(): Auth {
  if (!auth) auth = getAuth(getApp());
  return auth;
}

function getDb(): Firestore {
  if (!db) db = getFirestore(getApp());
  return db;
}

// === Public API ===

/** Firebase가 설정되어 있는지 확인 */
export function isFirebaseEnabled(): boolean {
  return isConfigured();
}

/** 익명 로그인 */
export async function signIn(): Promise<User | null> {
  if (!isConfigured()) return null;
  try {
    const result = await signInAnonymously(getAuthInstance());
    return result.user;
  } catch {
    return null;
  }
}

/** 현재 유저 */
export function onAuth(callback: (user: User | null) => void): () => void {
  if (!isConfigured()) { callback(null); return () => {}; }
  return onAuthStateChanged(getAuthInstance(), callback);
}

/** 전체 앱 데이터를 Firestore에 백업 */
export async function backupToCloud(userId: string): Promise<boolean> {
  if (!isConfigured()) return false;
  try {
    const data: Record<string, string | null> = {};
    const keys = [
      'fitlife_workouts', 'fitlife_meals', 'fitlife_sleep',
      'fitlife_meditation', 'fitlife_routine', 'fitlife_body',
      'fitlife_running', 'fitlife_habits', 'fitlife_habit_logs',
    ];

    for (const key of keys) {
      data[key] = localStorage.getItem(key);
    }

    await setDoc(doc(getDb(), 'users', userId), {
      ...data,
      updatedAt: new Date().toISOString(),
    });

    return true;
  } catch {
    return false;
  }
}

/** Firestore에서 데이터 복원 */
export async function restoreFromCloud(userId: string): Promise<boolean> {
  if (!isConfigured()) return false;
  try {
    const snap = await getDoc(doc(getDb(), 'users', userId));
    if (!snap.exists()) return false;

    const data = snap.data();
    const keys = [
      'fitlife_workouts', 'fitlife_meals', 'fitlife_sleep',
      'fitlife_meditation', 'fitlife_routine', 'fitlife_body',
      'fitlife_running', 'fitlife_habits', 'fitlife_habit_logs',
    ];

    for (const key of keys) {
      if (data[key]) {
        localStorage.setItem(key, data[key] as string);
      }
    }

    return true;
  } catch {
    return false;
  }
}
