let currentUser = '';
let userClicks = 0;
let freeClicks = 3;
let totalClicks = 0;

function switchLanguage(lang) {
    const texts = {
        de: {
            title: "Drück ihn nicht!",
            subtitle: "Der weltweit meistgeklickte verbotene Knopf",
            description: "Willkommen! Du hast 3 Freiklicks pro Tag...",
            joinBtn: "Teilnehmen",
            priceInfo: "1 Klick = 0,30 € | 5 Klicks = 1,00 €",
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
    document.getElementById("leaderboardTitle").textContent = t.leaderboardTitle;
    document.getElementById("nameHeader").textContent = t.nameHeader;
    document.getElementById("clicksHeader").textContent = t.clicksHeader;
    document.getElementById("username").placeholder = t.username;
}

function joinGame() {
    const usernameInput = document.getElementById('username');
    const name = usernameInput.value.trim();
    if (!name) return alert("Bitte gib einen Namen ein.");
    currentUser = name;
    document.getElementById('bigButton').style.display = 'inline-block';
}

function handleClick() {
    if (!currentUser) return alert("Du musst erst teilnehmen!");
    if (freeClicks <= 0) return alert("Keine Freiklicks mehr! Bitte kaufe mehr Klicks.");
    userClicks++;
    freeClicks--;
    totalClicks++;
    document.getElementById('totalClicks').textContent = totalClicks;
    updateLeaderboard();
}

function updateLeaderboard() {
    const table = document.getElementById('leaderboard');
    table.innerHTML = `
        <tr>
            <td>1</td>
            <td>${currentUser}</td>
            <td>${userClicks}</td>
        </tr>
    `;
}

function buyClicks() {
    freeClicks += 5;
    alert("5 Klicks wurden gutgeschrieben.");
}

window.onload = () => {
    switchLanguage('de');
    document.getElementById('totalClicks').textContent = totalClicks;
};