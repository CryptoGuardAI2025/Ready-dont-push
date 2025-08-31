
// Firebase-Setup (Dummy - deine API hier einfügen)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-app.firebaseapp.com",
  databaseURL: "https://your-app.firebaseio.com",
  projectId: "your-app",
  storageBucket: "your-app.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdefghij"
};

const app = firebase.initializeApp(firebaseConfig);
const db = firebase.database();
let username = "";
let clicksLeft = 3;

function setLanguage(lang) {
  alert("Sprache wird umgestellt – " + lang);
}

function registerUser() {
  username = document.getElementById("username").value.trim();
  if (username.length === 0) return;
  db.ref("users/" + username).set({ clicks: 0 });
}

function clickButton() {
  if (clicksLeft > 0) {
    clicksLeft--;
    document.getElementById("freeClicks").textContent = clicksLeft;
    updateClicks(1);
  } else {
    document.getElementById("paypal-button-container").style.display = "block";
  }
}

function updateClicks(amount) {
  db.ref("globalClicks").get().then(snapshot => {
    let total = snapshot.val() || 0;
    total += amount;
    db.ref("globalClicks").set(total);
    document.getElementById("globalCounter").textContent = total.toString().padStart(6, '0');
  });
}
