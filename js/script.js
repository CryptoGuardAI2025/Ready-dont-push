
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

let userClicks = 0;
let username = "";
let freeClicks = 3;

function registerUser() {
    username = document.getElementById("username").value;
    if (!username) return alert("Name eingeben!");
    userClicks = 0;
    alert("Teilnahme bestätigt: " + username);
}

function handleClick() {
    if (!username) return alert("Bitte Namen eingeben!");
    if (freeClicks > 0) {
        freeClicks--;
        document.getElementById("freeClicks").innerText = freeClicks;
        incrementClick();
    } else {
        alert("Keine Freiklicks mehr. Bitte kaufe Klicks!");
    }
}

function incrementClick() {
    db.ref("globalClicks").transaction(current => (current || 0) + 1);
    db.ref("users/" + username).transaction(current => (current || 0) + 1);
}

db.ref("globalClicks").on("value", snapshot => {
    document.getElementById("globalClicks").innerText = String(snapshot.val() || 0).padStart(6, "0");
});

db.ref("users").on("value", snapshot => {
    const data = snapshot.val() || {};
    const sorted = Object.entries(data).sort((a,b) => b[1] - a[1]);
    document.getElementById("leaderboard").innerHTML = sorted.map(([name, clicks], i) =>
        `<tr><td>${i+1}</td><td>${name}</td><td>${clicks}</td></tr>`
    ).join("");
});

paypal.Buttons({
  createOrder: (data, actions) => {
    return actions.order.create({
      purchase_units: [{ amount: { value: "1.00" } }]
    });
  },
  onApprove: (data, actions) => {
    return actions.order.capture().then(() => {
      freeClicks += 5;
      document.getElementById("freeClicks").innerText = freeClicks;
      alert("Du hast 5 zusätzliche Klicks erhalten!");
    });
  }
}).render("#paypal-button-container");

function setLanguage(lang) {
    alert("Sprache geändert – " + lang);
}
