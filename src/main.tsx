import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './css/style.css';
import './css/satoshi.css';
// import 'jsvectormap/dist/css/jsvectormap.css';
import 'flatpickr/dist/flatpickr.min.css';
import { getMessaging, onMessage } from 'firebase/messaging';

const messaging = getMessaging();
const playNotificationSound = () => {
    const audio = new Audio('/noti-sound.mp3');
    audio.play().catch((error) => {
      console.error('Error playing sound:', error);
    });
};

//get notification when app is in background
navigator.serviceWorker.addEventListener('message', (event) => {
    //console.log('Notification message from service worker: ', event.data);
    if(event.data.messageType != "push-received"){
        playNotificationSound(); // Play sound when a notification is received
    }
});

//get notification when app is active
onMessage(messaging, (payload: any) => {
    //console.log('Notification message from service worker: ', payload);
    if(payload.data.messageType != "push-received"){
        playNotificationSound(); // Play sound when a notification is received
    }
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
  // </React.StrictMode>,
    <App />
);
