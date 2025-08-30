
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

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

let currentUser = "";
let totalClicks = 0;

function joinGame() {
    const username = document.getElementById("username").value.trim();
    if (!username) return alert("Bitte Namen eingeben.");
    currentUser = username;
    const userRef = db.ref('users/' + username);
    userRef.once("value", snapshot => {
        if (snapshot.exists()) {
            totalClicks = snapshot.val().clicks || 0;
        } else {
            totalClicks = 0;
            saveUserClick(username, 0);
        }
        document.getElementById("clickCount").textContent = totalClicks;
    });
}

function handleClick() {
    if (!currentUser) return alert("Bitte zuerst Namen eingeben.");
    totalClicks++;
    document.getElementById("clickCount").textContent = totalClicks;
    saveUserClick(currentUser, totalClicks);
    updateLeaderboard();
}

function saveUserClick(username, clickCount) {
    db.ref('users/' + username).set({
        name: username,
        clicks: clickCount
    });
}

function updateLeaderboard() {
    const leaderboard = document.getElementById("leaderboard");
    db.ref('users').once("value", snapshot => {
        const users = snapshot.val();
        const sorted = Object.values(users || {}).sort((a, b) => b.clicks - a.clicks);
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
            description: "Welcome! You have 3 free clicks per day. After that, you can optionally buy more: 1 click = €0.30, 5 clicks = €1.00.",
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
    document.getElementById("clicksInfo").childNodes[0].textContent = t.clicksInfo;
    document.getElementById("leaderboardTitle").textContent = t.leaderboardTitle;
    document.getElementById("nameHeader").textContent = t.nameHeader;
    document.getElementById("clicksHeader").textContent = t.clicksHeader;
    document.getElementById("username").placeholder = t.username;
}
