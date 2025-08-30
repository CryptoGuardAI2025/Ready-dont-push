
document.addEventListener('DOMContentLoaded', () => {
    const { ref, set, get, update, onValue } = window.firebaseRefs;
    const db = window.db;

    const usernameInput = document.getElementById("username");
    const joinBtn = document.getElementById("joinBtn");
    const clickBtn = document.getElementById("clickBtn");
    const buyBtn = document.getElementById("buyClicksBtn");
    const totalClicksSpan = document.getElementById("totalClicks");
    const buttonContainer = document.getElementById("button-container");
    let username = "";
    let clicksLeft = 3;

    joinBtn.onclick = () => {
        username = usernameInput.value.trim();
        if (!username) return alert("Bitte Namen eingeben!");
        const userRef = ref(db, 'users/' + username);

        get(userRef).then(snapshot => {
            if (!snapshot.exists()) {
                set(userRef, { name: username, clicks: 3 });
            }
            clicksLeft = snapshot.val()?.clicks ?? 3;
            buttonContainer.style.display = 'block';
            loadLeaderboard();
        });
    };

    clickBtn.onclick = () => {
        if (clicksLeft <= 0) return alert("Keine Klicks mehr übrig. Bitte kaufen.");
        const userRef = ref(db, 'users/' + username);
        clicksLeft--;
        update(userRef, { clicks: clicksLeft });

        const totalRef = ref(db, 'totalClicks');
        get(totalRef).then(snapshot => {
            let total = snapshot.val() || 0;
            total++;
            set(totalRef, total);
        });
    };

    buyBtn.onclick = () => {
        clicksLeft += 5;
        const userRef = ref(db, 'users/' + username);
        update(userRef, { clicks: clicksLeft });
    };

    function loadLeaderboard() {
        const usersRef = ref(db, 'users');
        onValue(usersRef, snapshot => {
            const data = snapshot.val();
            const leaderboard = Object.values(data || {})
                .sort((a, b) => b.clicks - a.clicks)
                .slice(0, 10);

            const tbody = document.querySelector("#leaderboard tbody");
            tbody.innerHTML = "";
            leaderboard.forEach((user, index) => {
                const row = `<tr><td>${index + 1}</td><td>${user.name}</td><td>${user.clicks}</td></tr>`;
                tbody.innerHTML += row;
            });
        });

        const totalRef = ref(db, 'totalClicks');
        onValue(totalRef, snapshot => {
            totalClicksSpan.innerText = snapshot.val() ?? 0;
        });
    }

    window.switchLanguage = function(lang) {
        document.getElementById("title").innerText = lang === "en" ? "Don't push it!" : "Drück ihn nicht!";
        document.getElementById("subtitle").innerText = lang === "en" ? "The world's most clicked forbidden button" : "Der weltweit meistgeklickte verbotene Knopf";
        document.getElementById("welcome-text").innerText = lang === "en" ? "Welcome! You get 3 free clicks per day…" : "Willkommen! Du hast 3 Freiklicks pro Tag…";
        document.getElementById("joinBtn").innerText = lang === "en" ? "Join" : "Teilnehmen";
        document.getElementById("clickBtn").innerText = lang === "en" ? "Don't Push" : "Nicht Drücken";
        document.getElementById("buyClicksBtn").innerText = lang === "en" ? "Buy Clicks" : "Klicks kaufen";
        document.getElementById("clickInfo").innerText = lang === "en" ? "5 Clicks = €1.00" : "5 Klicks = 1,00 €";
    };
});
