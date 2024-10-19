// firebaseConfig.ts
import { initializeApp } from 'firebase/app';
import { getMessaging } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyAEurFIf5vEgN_X6bHl7Ail6f_h33xGnWA",
  authDomain: "ssap-e191d.firebaseapp.com",
  projectId: "ssap-e191d",
  storageBucket: "ssap-e191d.appspot.com",
  messagingSenderId: "678443652152",
  appId: "1:678443652152:web:9379e2345b1fce320f82cd",
  measurementId: "G-F83Q3EF4MV"
};

const firebaseApp = initializeApp(firebaseConfig);
export const messaging = getMessaging(firebaseApp);

