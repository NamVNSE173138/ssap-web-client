import { getToken } from "firebase/messaging";
import { messaging } from "./firebase";
import { subscribeToTopic } from "./ApiServices/notification";

export const requestNotify = async (id: string) => {
      try {
        // Register the service worker
        
        const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');

        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          const currentToken = await getToken(messaging, {
            serviceWorkerRegistration: registration,
          });
          await subscribeToTopic({ token: currentToken, topic: id });

          if (currentToken) {
            console.log(currentToken);
            return currentToken;
          } else {
            console.log('No registration token available. Request permission to generate one.');
            //setError('No registration token available');
          }
          return null;
        } else {
          console.log('Permission denied');
          //setError('Notification permission denied');
        }
      } catch (err) {
        console.error('An error occurred while retrieving token:', err);
        //setError('Error retrieving token');
      }
    };

