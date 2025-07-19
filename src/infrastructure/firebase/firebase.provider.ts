import * as admin from 'firebase-admin';
import * as serviceAccount from '../../../quickreels-service-firebase-adminsdk-yjzwg-9d83784058.json';


export const FirebaseAdminProvider = {
  provide: 'FIREBASE_ADMIN',
  useFactory: async () => {
    return admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    });
  },
}; 