
let lang = 'de';
let clicksLeft = 3;

function setLang(selectedLang) {
  lang = selectedLang;
  document.getElementById("headline").textContent = lang === 'de' ? "Drück ihn nicht!" : "Don't press it!";
  document.getElementById("subline").textContent = lang === 'de' ? "Der weltweit meistgeklickte verbotene Knopf" : "The most clicked forbidden button worldwide";
  document.getElementById("welcome").innerHTML = lang === 'de' ? "Willkommen! Du hast <span id='freiklicks'>" + clicksLeft + "</span> Freiklicks pro Tag…" : "Welcome! You have <span id='freiklicks'>" + clicksLeft + "</span> free clicks per day…";
  document.getElementById("joinBtn").textContent = lang === 'de' ? "Teilnehmen" : "Join";
  document.getElementById("buyBtn").textContent = lang === 'de' ? "Klicks kaufen" : "Buy clicks";
  document.getElementById("priceInfo").textContent = "5 Klicks = 1,00 €";
  document.getElementById("totalClicksTitle").textContent = lang === 'de' ? "Gesamtklicks weltweit:" : "Total Clicks Worldwide:";
  document.getElementById("rankingTitle").textContent = lang === 'de' ? "Rangliste" : "Leaderboard";
}

document.getElementById("joinBtn").addEventListener("click", () => {
  const name = document.getElementById("username").value;
  if (!name) return alert("Name eingeben!");
  document.getElementById("pushBtn").style.display = "inline-block";
  document.getElementById("buyBtn").style.display = "inline-block";
});

document.getElementById("pushBtn").addEventListener("click", () => {
  if (clicksLeft <= 0) {
    alert("Keine Klicks mehr! Bitte kaufen.");
    return;
  }
  clicksLeft--;
  document.getElementById("freiklicks").textContent = clicksLeft;
  // Hier Firebase update code einfügen
});

document.getElementById("buyBtn").addEventListener("click", () => {
  clicksLeft += 5;
  document.getElementById("freiklicks").textContent = clicksLeft;
  alert("Demo: 5 Klicks hinzugefügt (kein echtes Geld abgebucht)");
});
