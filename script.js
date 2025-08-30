import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, set, get, onValue } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyC...Nd8M",
  authDomain: "dont-push-b6170.firebaseapp.com",
  projectId: "dont-push-b6170",
  storageBucket: "dont-push-b6170.appspot.com",
  messagingSenderId: "813001059051",
  appId: "1:813001059051:web:5558a33d10fe3c41",
  measurementId: "G-7F5MDTT4K6"
};
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

let currentUser = "";
let totalClicks = 0;
let freeClicks = 3;

window.joinGame = function () {
  const username = document.getElementById("username").value.trim();
  if (!username) return;
  currentUser = username;

  const userRef = ref(db, 'users/' + username);
  get(userRef).then((snapshot) => {
    if (snapshot.exists()) {
      totalClicks = snapshot.val().clicks || 0;
    } else {
      totalClicks = 0;
      set(userRef, { name: username, clicks: 0 });
    }
    document.getElementById("clickCount").textContent = "Gesamtklicks: " + totalClicks;
    document.getElementById("clickButton").disabled = false;
  });
};

window.handleClick = function () {
  if (!currentUser) return alert("Bitte zuerst teilnehmen.");
  if (freeClicks <= 0) {
    document.getElementById("paymentArea").style.display = "block";
    return;
  }
  totalClicks++;
  freeClicks--;
  const userRef = ref(db, 'users/' + currentUser);
  set(userRef, { name: currentUser, clicks: totalClicks });
  document.getElementById("clickCount").textContent = "Gesamtklicks: " + totalClicks;
  updateLeaderboard();
  updateGlobalCounter();
};

window.buyClicks = function (method) {
  freeClicks += 5;
  document.getElementById("paymentArea").style.display = "none";
  alert("Bezahlung (" + method + ") erfolgreich! Du hast 5 neue Klicks.");
};

function updateLeaderboard() {
  const usersRef = ref(db, 'users');
  onValue(usersRef, (snapshot) => {
    const data = snapshot.val();
    if (!data) return;
    const sorted = Object.values(data).sort((a, b) => b.clicks - a.clicks);
    const leaderboard = document.getElementById("leaderboard");
    leaderboard.innerHTML = "";
    sorted.forEach((user, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `<td>${index + 1}</td><td>${user.name}</td><td>${user.clicks}</td>`;
      leaderboard.appendChild(row);
    });
  });
}

function updateGlobalCounter() {
  const counterRef = ref(db, 'globalClicks');
  get(counterRef).then(snapshot => {
    let count = snapshot.exists() ? snapshot.val() : 0;
    count++;
    set(counterRef, count);
    document.getElementById("globalCount").textContent = count;
  });
}

onValue(ref(db, 'globalClicks'), (snapshot) => {
  if (snapshot.exists()) {
    document.getElementById("globalCount").textContent = snapshot.val();
  }
});

updateLeaderboard();
