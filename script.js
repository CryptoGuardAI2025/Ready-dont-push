
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getDatabase, ref, onValue, set, get, update } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyCYmoUq4KyZjb5VAU4IYNOLnd8MtZfYqT8",
    authDomain: "dont-push-b6170.firebaseapp.com",
    projectId: "dont-push-b6170",
    storageBucket: "dont-push-b6170.appspot.com",
    messagingSenderId: "813001059051",
    appId: "1:813001059051:web:5558a33d10fe3c4c239e88",
    measurementId: "G-7F5MDTT4K6"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

let currentUser = "";
let clickLimit = 3;
let clicksLeft = 3;

function updateTotalClicksDisplay(total) {
    document.getElementById("total-clicks").innerText = total;
}

function loadLeaderboard() {
    const leaderboardRef = ref(db, 'users');
    onValue(leaderboardRef, (snapshot) => {
        const data = snapshot.val();
        const sorted = Object.entries(data || {}).sort((a, b) => b[1].clicks - a[1].clicks);
        const table = document.querySelector("#leaderboard tbody");
        table.innerHTML = "";
        sorted.slice(0, 10).forEach(([name, info], index) => {
            const row = `<tr><td>${index + 1}</td><td>${name}</td><td>${info.clicks}</td></tr>`;
            table.innerHTML += row;
        });
    });
}

function loadTotalClicks() {
    const totalRef = ref(db, 'meta/totalClicks');
    onValue(totalRef, (snapshot) => {
        const total = snapshot.val() || 0;
        updateTotalClicksDisplay(total);
    });
}

window.registerUser = function() {
    const name = document.getElementById("username").value.trim();
    if (!name) return alert("Bitte gib einen Namen ein.");
    currentUser = name;

    const userRef = ref(db, 'users/' + name);
    get(userRef).then(snapshot => {
        if (!snapshot.exists()) {
            set(userRef, { clicks: 0 });
        }
        clicksLeft = 3;
        document.getElementById("button-container").style.display = "block";
    });
};

window.handleClick = function() {
    if (!currentUser) return alert("Bitte registriere dich zuerst.");

    if (clicksLeft <= 0) {
        alert("Keine Freiklicks mehr! Bitte kaufen.");
        return;
    }

    const userRef = ref(db, 'users/' + currentUser);
    get(userRef).then(snapshot => {
        const data = snapshot.val();
        const newClicks = (data?.clicks || 0) + 1;
        set(userRef, { clicks: newClicks });

        const totalRef = ref(db, 'meta/totalClicks');
        get(totalRef).then(snap => {
            const total = (snap.val() || 0) + 1;
            set(totalRef, total);
        });

        clicksLeft--;
    });
};

window.buyClicks = function() {
    alert("Zahlungssystem folgt – du hast 5 Klicks gratis dazu bekommen.");
    clicksLeft += 5;
};

window.setLanguage = function(lang) {
    const texts = {
        de: {
            title: "Drück ihn nicht!",
            subtitle: "Der weltweit meistgeklickte verbotene Knopf",
            desc: "Willkommen! Du hast 3 Freiklicks pro Tag...",
            pricing: "5 Klicks = 1,00 €",
            buy: "Klicks kaufen",
            join: "Teilnehmen"
        },
        en: {
            title: "Don't Push It!",
            subtitle: "The world's most clicked forbidden button",
            desc: "Welcome! You have 3 free clicks per day...",
            pricing: "5 Clicks = €1.00",
            buy: "Buy Clicks",
            join: "Join"
        }
    };
    const t = texts[lang];
    document.getElementById("main-title").innerText = t.title;
    document.getElementById("subtitle").innerText = t.subtitle;
    document.getElementById("description").innerText = t.desc;
    document.getElementById("pricing").innerText = t.pricing;
    document.querySelector("button[onclick='buyClicks()']").innerText = t.buy;
    document.querySelector("button[onclick='registerUser()']").innerText = t.join;
};

loadLeaderboard();
loadTotalClicks();
