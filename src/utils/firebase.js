// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getMessaging, getToken, onMessage } from 'firebase/messaging'
import { getFirestore } from 'firebase/firestore'
import { getAnalytics } from 'firebase/analytics'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyB8RCDwrW_Z1H_6zDhebqdWz1ahkY6Pr50',
  authDomain: 'kiddy-2a4c4.firebaseapp.com',
  projectId: 'kiddy-2a4c4',
  storageBucket: 'kiddy-2a4c4.appspot.com',
  messagingSenderId: '184402153022',
  appId: '1:184402153022:web:c18a40d5054f3ebac7cb6f',
  measurementId: 'G-W6Z809FBPC',
}

// Initialize Firebase
export const fireApp = initializeApp(firebaseConfig)
const messaging = getMessaging(fireApp)

const analytics = getAnalytics(fireApp)

export const getTokenImp = (setTokenFound) => {
  return getToken(messaging, {
    vapidKey:
      'BNBSpWwJqPmsalYnJLIEwGuAsv2W27-N6E9NINfhMspRa080miWltccG7wk5q3YmUjZtaPV6YVlSSfyTyHcbro4',
  })
    .then((currentToken) => {
      if (currentToken) {
        console.log(currentToken)
        setTokenFound(true)
        // Track the token -> client mapping, by sending to backend server
        // show on the UI that permission is secured
      } else {
        console.log('No registration token available. Request permission to generate one.')
        setTokenFound(false)
        // shows on the UI that permission is required
      }
    })
    .catch((err) => {
      console.log('An error occurred while retrieving token. ', err)
      // catch error while creating client token
    })
}

export const db = getFirestore()

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      console.log('message')
      resolve(payload)
    })
  })
