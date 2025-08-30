// Firebase Setup
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getDatabase, ref, set, get, update, onValue } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyCYmoUq4KyZjb5VAU4IYNOLnd8MDW8TtA4",
  authDomain: "dont-push-b6170.firebaseapp.com",
  databaseURL: "https://dont-push-b6170-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "dont-push-b6170",
  storageBucket: "dont-push-b6170.appspot.com",
  messagingSenderId: "813001059051",
  appId: "1:813001059051:web:5558a33d10fe3c3a263e86",
  measurementId: "G-7F5MDTT4K6"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

let currentUser = null;
let currentIP = "";
let today = new Date().toISOString().split('T')[0];

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("clickButton").disabled = true;
    fetch("https://api.ipify.org?format=json")
        .then(res => res.json())
        .then(data => currentIP = data.ip);
});

window.registerUser = async function() {
    const name = document.getElementById("username").value.trim();
    if (!name) return alert("Bitte Namen eingeben");
    const userRef = ref(db, "users/" + name);
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
        const data = snapshot.val();
        if (data.ip !== currentIP) {
            return alert("Dieser Name ist bereits von einer anderen IP vergeben.");
        }
    } else {
        await set(userRef, { name, clicks: 0, freeClicks: 3, ip: currentIP, lastActive: today });
    }
    currentUser = name;
    document.getElementById("clickButton").disabled = false;
    loadLeaderboard();
    loadGlobalClicks();
};

window.handleClick = async function() {
    if (!currentUser) return;
    const userRef = ref(db, "users/" + currentUser);
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
        const user = snapshot.val();
        if (user.lastActive !== today) {
            user.freeClicks = 3;
            user.lastActive = today;
        }
        if (user.freeClicks <= 0) {
            alert("Keine Freiklicks mehr! Bitte Klicks kaufen.");
            return;
        }
        user.clicks += 1;
        user.freeClicks -= 1;
        await update(userRef, user);
        await incrementGlobalClicks();
        loadLeaderboard();
    }
};

window.buyClicks = async function() {
    if (!currentUser) return alert("Bitte zuerst Namen registrieren.");
    const userRef = ref(db, "users/" + currentUser);
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
        const user = snapshot.val();
        user.freeClicks += 5;
        await update(userRef, user);
        alert("5 Klicks gekauft (Demo-Modus)");
    }
};

function loadLeaderboard() {
    const usersRef = ref(db, "users");
    onValue(usersRef, snapshot => {
        const data = snapshot.val();
        const leaderboard = Object.entries(data || {}).sort((a, b) => b[1].clicks - a[1].clicks).slice(0, 10);
        const tbody = document.getElementById("leaderboard");
        tbody.innerHTML = "";
        leaderboard.forEach(([name, user], index) => {
            tbody.innerHTML += `<tr><td>${index + 1}</td><td>${name}</td><td>${user.clicks}</td></tr>`;
        });
    });
}

function loadGlobalClicks() {
    const refClicks = ref(db, "globalClicks");
    onValue(refClicks, snapshot => {
        document.getElementById("globalClicks").innerText = snapshot.val() || 0;
    });
}

async function incrementGlobalClicks() {
    const clicksRef = ref(db, "globalClicks");
    const snapshot = await get(clicksRef);
    const total = snapshot.val() || 0;
    await set(clicksRef, total + 1);
}

window.switchLanguage = function(lang) {
    document.getElementById("title").innerText = lang === "en" ? "Don't Push It!" : "Drück ihn nicht!";
    document.getElementById("subtitle").innerText = lang === "en"
        ? "The world's most clicked forbidden button" : "Der weltweit meistgeklickte verbotene Knopf";
    document.getElementById("welcome").innerText = lang === "en"
        ? "Welcome! You get 3 free clicks per day…" : "Willkommen! Du hast 3 Freiklicks pro Tag…";
    document.getElementById("price-info").innerText = lang === "en"
        ? "5 Clicks = €1.00" : "5 Klicks = 1,00 €";
    document.querySelector("button[onclick='registerUser()']").innerText = lang === "en" ? "Join" : "Teilnehmen";
    document.getElementById("clickButton").innerText = lang === "en" ? "Don't Push" : "Nicht drücken";
    document.querySelector("button[onclick='buyClicks()']").innerText = lang === "en" ? "Buy Clicks" : "Klicks kaufen";
};
