import {initializeApp}  from 'firebase/app'
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import {getStorage} from 'firebase/storage'
import {initializeFirestore} from 'firebase/firestore'
const firebaseConfig = {
    apiKey: "AIzaSyAZpx1QLxH_fxeTljC6bnwtF_hIJn0vTf8",
    authDomain: "secret-chat-dev.firebaseapp.com",
    projectId: "secret-chat-dev",
    storageBucket: "secret-chat-dev.appspot.com",
    messagingSenderId: "203726190238",
    appId: "1:203726190238:web:ee38724f85678ffa086d8f"
  };
  

 

export const app = initializeApp(firebaseConfig)
export const auth= getAuth(app)
export const storage = getStorage(app)
export const db = initializeFirestore(app , {experimentalForceLongPolling: true ,})

export function signIn(email,password) {
  console.log("sign in triggered in firebase file ")
  return signInWithEmailAndPassword(auth,email,password)
}
export function signUp(email,password){
  return createUserWithEmailAndPassword(auth,email,password)
}