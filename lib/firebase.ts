
import { initializeApp, getApps, getApp, type FirebaseOptions, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

let appInstance: FirebaseApp | null = null;
let authInstance: Auth | null = null;
let dbInstance: Firestore | null = null;
let firebaseInitializationAttempted = false;
let firebaseSuccessfullyInitialized = false;

// This block ensures Firebase initialization logic runs only once on the client-side.
if (typeof window !== 'undefined' && !firebaseInitializationAttempted) {
  console.log("Firebase Config Check: Client-side block entered. Attempting to read environment variables...");

  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
  const messagingSenderId = process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
  const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID;
  const measurementId = process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID;

  // Log the values read from process.env for debugging
  console.log("Firebase Config Check: NEXT_PUBLIC_FIREBASE_API_KEY read as:", apiKey);
  console.log("Firebase Config Check: NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN read as:", authDomain);
  console.log("Firebase Config Check: NEXT_PUBLIC_FIREBASE_PROJECT_ID read as:", projectId);
  console.log("Firebase Config Check: NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET read as:", storageBucket);
  console.log("Firebase Config Check: NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID read as:", messagingSenderId);
  console.log("Firebase Config Check: NEXT_PUBLIC_FIREBASE_APP_ID read as:", appId);
  console.log("Firebase Config Check: NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID read as:", measurementId);

  firebaseInitializationAttempted = true;

  const missingKeys: string[] = [];
  if (!apiKey) missingKeys.push("NEXT_PUBLIC_FIREBASE_API_KEY");
  if (!authDomain) missingKeys.push("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN");
  if (!projectId) missingKeys.push("NEXT_PUBLIC_FIREBASE_PROJECT_ID");

  if (missingKeys.length > 0) {
    console.error( // Emphasize the issue, this is a critical configuration problem.
      `URGENT: Firebase setup is INCOMPLETE. The application is MISSING or has empty values for the following crucial environment variable(s): ${missingKeys.join(', ')}. \n\nCHECK THE CONSOLE LOGS IMMEDIATELY ABOVE THIS MESSAGE. They show what values were actually read for each 'NEXT_PUBLIC_FIREBASE_...' variable. If they show 'undefined' or are incorrect, your '.env.local' file is the problem. \n\nFirebase features will NOT WORK until you: \n1. Ensure a '.env.local' file exists in your project's ROOT directory. \n2. CORRECTLY add ALL required 'NEXT_PUBLIC_FIREBASE_...' variables with their PROPER values to '.env.local'. \n3. RESTART your Next.js development server (e.g., by stopping and re-running 'npm run dev').`
    );
    // firebaseSuccessfullyInitialized remains false
  } else {
    const firebaseConfig: FirebaseOptions = {
      apiKey: apiKey as string,
      authDomain: authDomain as string,
      projectId: projectId as string,
    };
    // Only add these if they are present, to avoid passing 'undefined'
    if (storageBucket) firebaseConfig.storageBucket = storageBucket;
    if (messagingSenderId) firebaseConfig.messagingSenderId = messagingSenderId;
    if (appId) firebaseConfig.appId = appId;
    if (measurementId) firebaseConfig.measurementId = measurementId;

    try {
      if (!getApps().length) {
        appInstance = initializeApp(firebaseConfig);
      } else {
        appInstance = getApp();
      }

      authInstance = getAuth(appInstance);
      dbInstance = getFirestore(appInstance);
      firebaseSuccessfullyInitialized = true;
      console.log("Firebase initialized successfully with Project ID:", projectId);
    } catch (error: any) {
      let message = "Firebase initialization FAILED. Firebase features will be disabled.";
      if (error.code && error.code.includes("invalid-api-key")) {
        message = `Firebase initialization FAILED due to an INVALID API KEY (The API Key provided was: "${String(apiKey)}"). Please verify your NEXT_PUBLIC_FIREBASE_API_KEY in '.env.local'. Error: ${error.code}`;
      } else if (error.message) {
        message += ` Specific error: ${error.message}`;
      }
      console.error(message, error);
      // appInstance, authInstance, dbInstance remain null
      // firebaseSuccessfullyInitialized remains false
    }
  }
} else if (typeof window === 'undefined') {
  // This block runs on the server-side.
  // console.log("Firebase Config Check: Server-side execution of firebase.ts module.");
}

export { appInstance as app, authInstance as auth, dbInstance as db, firebaseSuccessfullyInitialized as isFirebaseInitialized };
