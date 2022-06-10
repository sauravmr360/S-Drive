import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore} from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDbnFA-BXgowiYUoOdJ14vreN9Ap8hxXu4",
  authDomain: "auth-dev-7a2f2.firebaseapp.com",
  databaseURL: "https://auth-dev-7a2f2-default-rtdb.firebaseio.com",
  projectId: "auth-dev-7a2f2",
  storageBucket: "auth-dev-7a2f2.appspot.com",
  messagingSenderId: "573292241682",
  appId: "1:573292241682:web:a21365d27d056b080189cb"
  };
const app=initializeApp(firebaseConfig)
  
const auth=getAuth(app)
export const firestore = getFirestore(app)
export const storage = getStorage(app);
export const database = {
  folders: 'folders',
  files:   'files',
  formatDoc:doc=>{
    return {id:doc.id, ...doc.data()}
  }
}
 export {auth}
 