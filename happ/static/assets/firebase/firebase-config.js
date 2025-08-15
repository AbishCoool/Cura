
// happ/static/assets/firebase/firebase-config.js

// ✅ This is your correct Firebase configuration.
const firebaseConfig = {
  apiKey: "AIzaSyA1y2pKLRctvf_CnoHPcEZPPZ74ynBt8vY",
  authDomain: "cura-notification-db-connect.firebaseapp.com",
  projectId: "cura-notification-db-connect",
  storageBucket: "cura-notification-db-connect.appspot.com", // Corrected this line
  messagingSenderId: "921372015026",
  appId: "1:921372015026:web:fb8aa6f30700b3ffa38cab",
  measurementId: "G-PBDGYGHXL1"
};


// ✅ Initialize Firebase services so your other scripts can use them.
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore(); // Initialize the Database