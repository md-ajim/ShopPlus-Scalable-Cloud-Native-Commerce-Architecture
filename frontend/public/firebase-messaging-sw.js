importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyAVXiiuR-pg_ofkuIwftNfTQ_fdrYNIXv8",
    projectId: "auth-75e4b",
    messagingSenderId: "560618527966",
    appId: "1:560618527966:web:95286bc182d4164a24764f",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
   self.registration.showNotification(
       payload.notification.title,
       {
         body: payload.notification.body
       }
   );
});
