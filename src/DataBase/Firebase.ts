import * as admin from 'firebase-admin';
import { config } from 'dotenv';
import { initializeApp } from "firebase/app";
config();


  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.quickReels_ID,
      clientEmail: process.env.quickReels_EMAIL,
      privateKey: (process.env.quickReels_PRIVATE_KEY || '').replace(/\\n/g, '\n')
    }),
    storageBucket: 'quickreels-service.appspot.com', 
  });

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
export const firebaseAdmin = admin;



