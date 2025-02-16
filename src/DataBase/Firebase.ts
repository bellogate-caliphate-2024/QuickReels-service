import * as admin from 'firebase-admin';
import { config } from 'dotenv';
import { initializeApp } from 'firebase/app';
config();

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.PROJECT_ID,
    clientEmail: process.env.CLIENT_EMAIL,
    privateKey: process.env.PRIVATE_KEY?.replace(/\\n/g, '\n'),
  }),
  storageBucket: 'quickreels-service.appspot.com',
});

const firebaseConfig = {
apiKey: process.env.API_KEY,
authDomain: process.env.AUTH_DOMAIN,
projectId: process.env.PROJECT_ID,
storageBucket: process.env.STORAGE_BUCKET,
messagingSenderId: process.env.MESSAGING_SENDER_ID,
appId: process.env.APP_ID,
measurementId: process.env.MEASUREMENT_ID,
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
export const firebaseAdmin = admin;
