
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import {
  getDatabase, ref, set, get, update, onValue
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

// Deine Firebase-Konfiguration
const firebaseConfig = {
  apiKey: "AIzaSyCYmoUq4KyZjb5VAU4IYNOLnd8M2F-ibeY",
  authDomain: "dont-push-b6170.firebaseapp.com",
  databaseURL: "https://dont-push-b6170-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "dont-push-b6170",
  storageBucket: "dont-push-b6170.appspot.com",
  messagingSenderId: "813001059051",
  appId: "1:813001059051:web:5558a33d10fe3c0e6b154a",
  measurementId: "G-7F5MDTT4K6"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

let currentUser = "";
let clickCount = 0;
let freeClicks = 3;

function joinGame() {
  const input = document.getElementById('username');
  const name = input.value.trim();
  if (!name) return alert("Bitte Namen eingeben.");
  currentUser = name;

  const userRef = ref(db, 'users/' + name);
  get(userRef).then(snapshot => {
    if (!snapshot.exists()) {
      set(userRef, { clicks: 0 });
    } else {
      clickCount = snapshot.val().clicks || 0;
    }
  });

  document.getElementById('epicButton').style.display = "inline-block";
}

function handleClick() {
  if (freeClicks <= 0) {
    alert("Keine Freiklicks mehr! Bitte Klicks kaufen.");
    return;
  }

  freeClicks--;
  clickCount++;

  const userRef = ref(db, 'users/' + currentUser);
  set(userRef, {
    name: currentUser,
    clicks: clickCount
  });

  const totalRef = ref(db, 'totalClicks');
  get(totalRef).then(snapshot => {
    const total = snapshot.val() || 0;
    set(totalRef, total + 1);
  });
}

function updateLeaderboard() {
  const usersRef = ref(db, 'users');
  onValue(usersRef, (snapshot) => {
    const data = snapshot.val();
    const sorted = Object.entries(data || {}).sort((a, b) => b[1].clicks - a[1].clicks).slice(0, 10);
    const leaderboard = document.getElementById("leaderboard");
    leaderboard.innerHTML = "";
    sorted.forEach(([name, val], idx) => {
      leaderboard.innerHTML += `<tr><td>${idx + 1}</td><td>${name}</td><td>${val.clicks}</td></tr>`;
    });
  });
}

function updateTotalClicks() {
  const totalRef = ref(db, 'totalClicks');
  onValue(totalRef, (snapshot) => {
    document.getElementById("totalClicks").innerText = snapshot.val() || 0;
  });
}

function buyClicks() {
  alert("Zahlungssystem in Vorbereitung – PayPal Integration folgt.");
  freeClicks += 5;
}

function switchLanguage(lang) {
  const texts = {
    de: {
      title: "Drück ihn nicht!",
      subtitle: "Der weltweit meistgeklickte verbotene Knopf",
      description: "Willkommen! Du hast 3 Freiklicks pro Tag...",
      joinBtn: "Teilnehmen",
      buyBtn: "Klicks kaufen"
    },
    en: {
      title: "Don't Press It!",
      subtitle: "The world's most clicked forbidden button",
      description: "Welcome! You get 3 free clicks per day...",
      joinBtn: "Join",
      buyBtn: "Buy Clicks"
    }
  };
  const t = texts[lang];
  document.getElementById("title").innerText = t.title;
  document.getElementById("subtitle").innerText = t.subtitle;
  document.getElementById("description").innerText = t.description;
  document.getElementById("joinBtn").innerText = t.joinBtn;
  document.getElementById("buyClicks").innerText = t.buyBtn;
}

updateLeaderboard();
updateTotalClicks();
