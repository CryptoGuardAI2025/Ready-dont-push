import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getDatabase, ref, set, get, onValue } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";

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

let currentUser = "";
let totalClicks = 0;

window.joinGame = function () {
  const username = document.getElementById("username").value.trim();
  if (!username) return;
  currentUser = username;
  const userRef = ref(db, "users/" + username);
  get(userRef).then(snapshot => {
    if (snapshot.exists()) {
      totalClicks = snapshot.val().clicks;
    } else {
      totalClicks = 0;
      saveUserClick(username, 0);
    }
    document.getElementById("clickCount").textContent = totalClicks;
    updateLeaderboard();
  });
};

window.handleClick = function () {
  if (!currentUser) {
    alert("Bitte zuerst teilnehmen.");
    return;
  }
  totalClicks++;
  document.getElementById("clickCount").textContent = totalClicks;
  saveUserClick(currentUser, totalClicks);
  updateLeaderboard();
};

function saveUserClick(username, clickCount) {
  set(ref(db, "users/" + username), {
    name: username,
    clicks: clickCount
  });
}

function updateLeaderboard() {
  const usersRef = ref(db, "users");
  onValue(usersRef, snapshot => {
    const data = snapshot.val();
    const leaderboard = document.getElementById("leaderboard");
    leaderboard.innerHTML = "";
    if (!data) return;
    const sorted = Object.values(data).sort((a, b) => b.clicks - a.clicks);
    sorted.forEach((user, i) => {
      const row = document.createElement("tr");
      row.innerHTML = `<td>${i + 1}</td><td>${user.name}</td><td>${user.clicks}</td>`;
      leaderboard.appendChild(row);
    });
  });
}

window.switchLanguage = function (lang) {
  const texts = {
    de: {
      title: "Drück ihn nicht!",
      subtitle: "Der weltweit meistgeklickte verbotene Knopf",
      description: "Willkommen! Du hast 3 Freiklicks pro Tag...",
      joinBtn: "Teilnehmen",
      priceInfo: "1 Klick = 0,30 € | 5 Klicks = 1,00 €",
      clicksInfo: "Gesamtanzahl Klicks:",
      leaderboardTitle: "Rangliste",
      nameHeader: "Name",
      clicksHeader: "Klicks",
      username: "Dein Name"
    },
    en: {
      title: "Don't push it!",
      subtitle: "The world's most clicked forbidden button",
      description: "Welcome! You have 3 free clicks per day...",
      joinBtn: "Join",
      priceInfo: "1 click = €0.30 | 5 clicks = €1.00",
      clicksInfo: "Total clicks:",
      leaderboardTitle: "Leaderboard",
      nameHeader: "Name",
      clicksHeader: "Clicks",
      username: "Your name"
    }
  };

  const t = texts[lang];
  if (!t) return;

  document.getElementById("title").textContent = t.title;
  document.getElementById("subtitle").textContent = t.subtitle;
  document.getElementById("description").textContent = t.description;
  document.getElementById("joinBtn").textContent = t.joinBtn;
  document.getElementById("priceInfo").textContent = t.priceInfo;
  document.getElementById("clicksInfo").textContent = t.clicksInfo;
  document.getElementById("leaderboardTitle").textContent = t.leaderboardTitle;
  document.getElementById("nameHeader").textContent = t.nameHeader;
  document.getElementById("clicksHeader").textContent = t.clicksHeader;
  document.getElementById("username").placeholder = t.username;
};
