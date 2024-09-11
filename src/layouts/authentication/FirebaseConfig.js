import { getApp, initializeApp} from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {getAuth} from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyBJYfJEcMfm_AyRHofWldUMccIkDcdpvig",
  authDomain: "nlp-taskpro.firebaseapp.com",
  projectId: "nlp-taskpro",
  storageBucket: "nlp-taskpro.appspot.com",
  messagingSenderId: "487947965496",
  appId: "1:487947965496:web:f0ddf8f41cf35ca78302cd"
};

const app = initializeApp(firebaseConfig);
export const appAuth = getAuth(app);

export const db = getFirestore(app);