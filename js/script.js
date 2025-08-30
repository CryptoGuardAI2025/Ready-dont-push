
// Firebase Setup (replace with your real config)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getDatabase, ref, set, get, update, onValue } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyCYmoUq4KyZjb5VAU4IYNOLnd8MDW8TtA4",
  authDomain: "dont-push-b6170.firebaseapp.com",
  projectId: "dont-push-b6170",
  storageBucket: "dont-push-b6170.appspot.com",
  messagingSenderId: "813001059051",
  appId: "1:813001059051:web:5558a33d10fe3c3a263e86",
  measurementId: "G-7F5MDTT4K6",
  databaseURL: "https://dont-push-b6170-default-rtdb.firebaseio.com"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

let currentUser = null;
let freeClicks = 3;
let totalClicks = 0;

function registerUser() {
    const name = document.getElementById('username').value;
    if (!name) return alert("Bitte Namen eingeben");
    currentUser = name;
    document.getElementById('clickButton').disabled = false;

    const userRef = ref(db, 'users/' + name);
    get(userRef).then(snapshot => {
        if (!snapshot.exists()) {
            set(userRef, { clicks: 0, freeClicks: 3 });
        }
    });

    loadLeaderboard();
    loadGlobalClicks();
}

function handleClick() {
    if (!currentUser) return;
    const userRef = ref(db, 'users/' + currentUser);
    get(userRef).then(snapshot => {
        let data = snapshot.val();
        if (data.freeClicks > 0) {
            data.clicks++;
            data.freeClicks--;
            update(userRef, data);
            incrementGlobalClicks();
            loadLeaderboard();
        } else {
            alert("Du hast keine Freiklicks mehr. Bitte kaufen.");
        }
    });
}

function buyClicks() {
    if (!currentUser) return alert("Bitte zuerst Namen eingeben");
    const userRef = ref(db, 'users/' + currentUser);
    get(userRef).then(snapshot => {
        let data = snapshot.val();
        data.freeClicks += 5;
        update(userRef, data);
        alert("5 Klicks gutgeschrieben (Demo-Modus)");
    });
}

function loadLeaderboard() {
    const usersRef = ref(db, 'users');
    onValue(usersRef, snapshot => {
        const data = snapshot.val();
        const sorted = Object.entries(data || {}).sort(([, a], [, b]) => b.clicks - a.clicks);
        const table = document.getElementById('leaderboard');
        table.innerHTML = '';
        sorted.slice(0, 10).forEach(([name, user], i) => {
            const row = `<tr><td>${i+1}</td><td>${name}</td><td>${user.clicks}</td></tr>`;
            table.innerHTML += row;
        });
    });
}

function incrementGlobalClicks() {
    const clicksRef = ref(db, 'globalClicks');
    get(clicksRef).then(snapshot => {
        const value = snapshot.val() || 0;
        set(clicksRef, value + 1);
    });
}

function loadGlobalClicks() {
    const clicksRef = ref(db, 'globalClicks');
    onValue(clicksRef, snapshot => {
        document.getElementById('globalClicks').innerText = snapshot.val() || 0;
    });
}

window.registerUser = registerUser;
window.handleClick = handleClick;
window.buyClicks = buyClicks;
