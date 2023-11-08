// // Give the service worker access to Firebase Messaging.
// // Note that you can only use Firebase Messaging here. Other Firebase libraries
// // are not available in the service worker.
// importScripts("https://www.gstatic.com/firebasejs/8.2.5/firebase-app.js");
// importScripts("https://www.gstatic.com/firebasejs/8.2.5/firebase-messaging.js");

// // Initialize the Firebase app in the service worker by passing in
// // your app's Firebase config object.
// // https://firebase.google.com/docs/web/setup#config-object
// firebase.initializeApp({
//     apiKey: "AIzaSyD-VxF-r_h94QYU5-pJb3LmVSf4UhjVUsI",
//     authDomain: "edenfarm-dashboard.firebaseapp.com",
//     projectId: "edenfarm-dashboard",
//     storageBucket: "edenfarm-dashboard.appspot.com",
//     messagingSenderId: "512185015125",
//     appId: "1:512185015125:web:d7c020977a8056c9dfaddc",
//     measurementId: "G-JJW2CLW3PM"
// });

// // Retrieve an instance of Firebase Messaging so that it can handle background
// // messages.
// const messaging = firebase.messaging.isSupported() ? firebase.messaging() : null

// if (messaging != null) {
//     messaging.onBackgroundMessage((payload) => {
//         // Customize notification here
//         if (payload.collapseKey == "pushprod") {
//             const notificationTitle = payload.data.title;
//             const notificationOptions = {
//                 body: payload.data.body,
//                 icon: "/img/notif/logo.png",
//                 image: "/img/notif/image.png",
//                 data :{
//                     url : payload.data.url
//                 },
//                 actions: [
//                     {
//                         action: 'open', 
//                         title: "Open"
//                     }
//                 ]
//             };
//             self.registration.showNotification(notificationTitle, notificationOptions);
//         }
//     });
//     self.addEventListener('notificationclick', function(event) {
//         event.notification.close();
//         clients.openWindow(event.notification.data.url);
//     }, false);   
// }