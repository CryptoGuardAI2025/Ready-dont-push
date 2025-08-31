
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getDatabase, ref, set, get, update, onValue } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyCymoUq4KyZjb5VAU4IYNOLnd8MEGP9pIU",
  authDomain: "dont-push-b6170.firebaseapp.com",
  databaseURL: "https://dont-push-b6170-default-rtdb.firebaseio.com",
  projectId: "dont-push-b6170",
  storageBucket: "dont-push-b6170.appspot.com",
  messagingSenderId: "813001059051",
  appId: "1:813001059051:web:5558a33d10fe3c7f9c2b39",
  measurementId: "G-7F5MDTT4K6"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
export { db, ref, set, get, update, onValue };
