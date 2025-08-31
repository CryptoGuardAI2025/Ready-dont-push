
import { db, ref, set, get, update, onValue } from './firebase-config.js';

document.addEventListener("DOMContentLoaded", () => {
  const joinBtn = document.getElementById("joinBtn");
  const clickBtn = document.getElementById("clickBtn");
  const buyBtn = document.getElementById("buyBtn");

  joinBtn.addEventListener("click", () => {
    const name = document.getElementById("username").value;
    if (name) {
      clickBtn.style.display = "inline-block";
      buyBtn.style.display = "inline-block";
    }
  });

  clickBtn.addEventListener("click", () => {
    alert("Button clicked – Demo");
  });

  buyBtn.addEventListener("click", () => {
    alert("Klicks gekauft – Demo");
  });

  function setLanguage(lang) {
    alert("Sprache wird umgestellt – " + lang);
  }

  window.setLanguage = setLanguage;
});
