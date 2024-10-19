// Load Firebase scripts from CDN
importScripts('https://www.gstatic.com/firebasejs/10.5.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.5.0/firebase-messaging-compat.js');

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAEurFIf5vEgN_X6bHl7Ail6f_h33xGnWA",
  authDomain: "ssap-e191d.firebaseapp.com",
  projectId: "ssap-e191d",
  storageBucket: "ssap-e191d.appspot.com",
  messagingSenderId: "678443652152",
  appId: "1:678443652152:web:9379e2345b1fce320f82cd",
  measurementId: "G-F83Q3EF4MV"
};
firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  //console.log('Received background message: ', payload);

  const notificationTitle = payload.notification?.title || 'Notification Title';
  const notificationOptions = {
    body: payload.notification?.body || 'Notification Body',
    icon: payload.notification?.icon || '/src/assets/logo.png',
    sound: '/noti-sound.mp3', 
    tag: payload.messageId || 'default-tag'
  };

  //console.log('Displaying notification with ID:', payload.messageId || 'default-tag');
  //self.registration.showNotification(notificationTitle, notificationOptions);
  clients.matchAll().then((clientList) => {
    clientList.forEach((client) => {
      client.postMessage(payload);
    });
  });
});

