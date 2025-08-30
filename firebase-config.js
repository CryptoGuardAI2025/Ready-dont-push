import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, set, get, onValue } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyCYmoUq4KyZjb5VAU4IYNOLnd8M2F-ibeY",
  authDomain: "dont-push-b6170.firebaseapp.com",
  databaseURL: "https://dont-push-b6170-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "dont-push-b6170",
  storageBucket: "dont-push-b6170.appspot.com",
  messagingSenderId: "813001059051",
  appId: "1:813001059051:web:b16a8b1d5cb6a89359acae",
  measurementId: "G-8EPCZRVPH1"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

window.db = db;
window.ref = ref;
window.set = set;
window.get = get;
window.onValue = onValue;
