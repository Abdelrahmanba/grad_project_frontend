// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js')

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
  apiKey: 'AIzaSyB8RCDwrW_Z1H_6zDhebqdWz1ahkY6Pr50',
  authDomain: 'kiddy-2a4c4.firebaseapp.com',
  projectId: 'kiddy-2a4c4',
  storageBucket: 'kiddy-2a4c4.appspot.com',
  messagingSenderId: '184402153022',
  appId: '1:184402153022:web:c18a40d5054f3ebac7cb6f',
  measurementId: 'G-W6Z809FBPC',
}

firebase.initializeApp(firebaseConfig)

// Retrieve firebase messaging
const messaging = firebase.messaging()

messaging.onBackgroundMessage(function (payload) {
  console.log('Received background message ', payload)

  const notificationTitle = payload.notification.title
  const notificationOptions = {
    body: payload.notification.body,
  }

  self.registration.showNotification(notificationTitle, notificationOptions)
})
