import * as admin from 'firebase-admin';
import * as serviceAccount from './serviceAccount.json';

export const FirebaseAdminProvider = {
  provide: 'FIREBASE_ADMIN',
  useFactory: async () => {
    return admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    });
  },
}; 