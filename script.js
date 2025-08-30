let currentUser = "";
let totalClicks = 0;

function joinGame() {
  const username = document.getElementById("username").value.trim();
  if (!username) return;
  currentUser = username;
  get(ref(db, 'users/' + username)).then(snapshot => {
    if (snapshot.exists()) {
      totalClicks = snapshot.val().clicks;
    } else {
      totalClicks = 0;
      saveUserClick(username, 0);
    }
    document.getElementById("clickCount").textContent = totalClicks;
  });
}

function handleClick() {
  if (!currentUser) return alert("Bitte zuerst Namen eingeben!");
  totalClicks++;
  document.getElementById("clickCount").textContent = totalClicks;
  saveUserClick(currentUser, totalClicks);
  updateLeaderboard();
}

function saveUserClick(username, clickCount) {
  const userRef = ref(db, 'users/' + username);
  set(userRef, {
    name: username,
    clicks: clickCount
  });
}

function updateLeaderboard() {
  const usersRef = ref(db, 'users');
  onValue(usersRef, (snapshot) => {
    const data = snapshot.val();
    if (!data) return;
    const sorted = Object.values(data).sort((a, b) => b.clicks - a.clicks);
    const leaderboard = document.getElementById("leaderboardBody");
    leaderboard.innerHTML = "";
    sorted.forEach((user, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `<td>${index + 1}</td><td>${user.name}</td><td>${user.clicks}</td>`;
      leaderboard.appendChild(row);
    });
  });
}

function switchLanguage(lang) {
  const texts = {
    de: {
      title: "Drück ihn nicht!",
      subtitle: "Der weltweit meistgeklickte verbotene Knopf",
      description: "Willkommen! Du hast 3 Freiklicks pro Tag. Danach kannst du freiwillig weitere Klicks kaufen: 1 Klick = 0,30 €, 5 Klicks = 1,00 €.",
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
      description: "Welcome! You have 3 free clicks per day. After that, you can voluntarily buy more clicks: 1 click = €0.30, 5 clicks = €1.00.",
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
  document.getElementById("clicksInfo").innerHTML = t.clicksInfo + " <span id='clickCount'>" + totalClicks + "</span>";
  document.getElementById("leaderboardTitle").textContent = t.leaderboardTitle;
  document.getElementById("nameHeader").textContent = t.nameHeader;
  document.getElementById("clicksHeader").textContent = t.clicksHeader;
  document.getElementById("username").placeholder = t.username;
}

window.onload = () => updateLeaderboard();
