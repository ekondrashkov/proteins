import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"

const firebaseConfig = {
  apiKey: process.env.FIREBASE_KEY, 
  authDomain: "q-1-search.firebaseapp.com",
  projectId: "q-1-search",
  storageBucket: "q-1-search.appspot.com",
  messagingSenderId: "318170728022",
  appId: "1:318170728022:web:4bd3e25e1266d89aea1df7"
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)