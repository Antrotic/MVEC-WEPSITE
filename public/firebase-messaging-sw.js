/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */
// This a service worker file for receiving push notifitications.
// See `Access registration token section` @ https://firebase.google.com/docs/cloud-messaging/js/client#retrieve-the-current-registration-token

// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
  apiKey: 'AIzaSyDo4R8pPtJTtyT4F9budtA4BnOm8ZcxDPE',
  authDomain: 'sameh-mall-2c072.firebaseapp.com',
  projectId: 'sameh-mall-2c072',
  storageBucket: 'sameh-mall-2c072.appspot.com',
  messagingSenderId: '470734001235',
  appId: '1:470734001235:web:004d6e76eabd2bc9a9e2a6',
  measurementId: 'G-5N2Z330HV3',
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

// Handle incoming messages while the app is not in focus (i.e in the background, hidden behind other tabs, or completely closed).
messaging.onBackgroundMessage(function (payload) {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
