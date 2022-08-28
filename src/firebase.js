import * as firebase from 'firebase'

const firebaseConfig = {
    apiKey: "AIzaSyAZpx1QLxH_fxeTljC6bnwtF_hIJn0vTf8",
    authDomain: "secret-chat-dev.firebaseapp.com",
    projectId: "secret-chat-dev",
    storageBucket: "secret-chat-dev.appspot.com",
    messagingSenderId: "203726190238",
    appId: "1:203726190238:web:ee38724f85678ffa086d8f"
  };
  
  // Initialize Firebase
  if(!firebase.apps.length){
   
  firebase.initializeApp(firebaseConfig);
 
  }
export {firebase}