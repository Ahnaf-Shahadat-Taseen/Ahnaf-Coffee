import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, getDocFromServer } from "firebase/firestore";

export const firebaseConfig = {
  apiKey: "AIzaSyCvPVFkakFds4T5nSLlTKQyE0vtKbRu20s",
  authDomain: "ahnaf-coffee-shop.firebaseapp.com",
  projectId: "ahnaf-coffee-shop",
  storageBucket: "ahnaf-coffee-shop.firebasestorage.app",
  messagingSenderId: "859950440797",
  appId: "1:859950440797:web:673adbf2feedb959ab48b4"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
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
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
    },
    operationType,
    path
  };
  console.warn('Firestore Operation Notice:', JSON.stringify(errInfo));
  return errInfo;
}

export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'system', 'connection_ping'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn("Client offline, utilizing cached state or local fallback.");
    }
  }
}
testConnection();

export default app;
