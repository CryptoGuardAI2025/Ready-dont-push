let user = null;
let freeClicks = 3;
let totalClicks = 0;

function registerUser() {
  const username = document.getElementById("username").value.trim();
  if (!username) {
    alert("Bitte gib einen Namen ein.");
    return;
  }

  user = username;
  document.getElementById("gameArea").style.display = "block";

  // Speichere den User mit 0 Klicks
  set(ref(db, 'users/' + user), {
    clicks: 0
  });
}

import { ref, set } from "firebase/database"; // Stelle sicher, dass das importiert ist

function handleClick() {
  if (freeClicks > 0) {
    freeClicks--;
    totalClicks++;
    document.getElementById("clickCount").innerText = totalClicks;

    // ✅ Klicks für den aktuellen Benutzer speichern
    set(ref(db, "users/" + user), {
      name: user,
      clicks: totalClicks
    });

  } else {
    alert("Keine Freiklicks mehr. Bitte Klicks kaufen!");
  }
}
function switchLanguage(lang) {
  if (lang === 'de') {
    document.getElementById('title').textContent = "Drück ihn nicht!";
    document.getElementById('subtitle').textContent = "Der weltweit meistgeklickte verbotene Knopf";
    document.getElementById('description').textContent = "Willkommen! Du hast 3 Freiklicks pro Tag. Danach kannst du freiwillig weitere Klicks kaufen: 1 Klick = 0,30 €, 5 Klicks = 1,00 €.";
    document.getElementById('joinBtn').textContent = "Teilnehmen";
    document.getElementById('priceInfo').textContent = "1 Klick = 0,30 € | 5 Klicks = 1,00 €";
    document.getElementById('leaderboardTitle').textContent = "Rangliste";
    document.getElementById('nameHeader').textContent = "Name";
    document.getElementById('clicksHeader').textContent = "Klicks";
    document.getElementById('username').placeholder = "Name eingeben";
  } else {
    document.getElementById('title').textContent = "Don't Push!";
    document.getElementById('subtitle').textContent = "The world's most clicked forbidden button";
    document.getElementById('description').textContent = "Welcome! You get 3 free clicks per day. After that, you can optionally buy more clicks: 1 click = €0.30, 5 clicks = €1.00.";
    document.getElementById('joinBtn').textContent = "Join";
    document.getElementById('priceInfo').textContent = "1 Click = €0.30 | 5 Clicks = €1.00";
    document.getElementById('leaderboardTitle').textContent = "Leaderboard";
    document.getElementById('nameHeader').textContent = "Name";
    document.getElementById('clicksHeader').textContent = "Clicks";
    document.getElementById('username').placeholder = "Enter name";
  }
}
function loadLeaderboard() {
  const leaderboard = document.getElementById("leaderboard");
  leaderboard.innerHTML = "";

 onValue(ref(db, "users"), (snapshot) => {
  const data = snapshot.val();
  const sorted = Object.values(data).sort((a, b) => b.clicks - a.clicks);

  const leaderboard = document.getElementById("leaderboard");
  leaderboard.innerHTML = ""; // vorher leeren!

  sorted.forEach((entry, index) => {
    const row = `<tr>
                   <td>${index + 1}</td>
                   <td>${entry.name}</td>
                   <td>${entry.clicks}</td>
                 </tr>`;
    leaderboard.innerHTML += row;
  });
});

window.onload = () => {
  loadLeaderboard();
};
