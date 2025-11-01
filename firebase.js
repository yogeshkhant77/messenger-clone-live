import firebase from 'firebase'

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyB-80Emos-tZTpTZjQZQJfLHFdruGYqhj8",
  authDomain: "mern-messenger-live-a3644.firebaseapp.com",
  projectId: "mern-messenger-live-a3644",
  storageBucket: "mern-messenger-live-a3644.firebasestorage.app",
  messagingSenderId: "364912743749",
  appId: "1:364912743749:web:e93857b81f52fecf291a2c",
  measurementId: "G-8T3WVSP6KT"
})

const db = firebaseApp.firestore()

export default db