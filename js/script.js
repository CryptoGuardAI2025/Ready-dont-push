
let language = 'de';
let userClicks = 0;
let totalClicks = 0;
let username = '';
let freeClicks = 3;

function setLanguage(lang) {
  language = lang;
  document.getElementById('title').innerText = lang === 'de' ? 'Drück ihn nicht!' : "Don't Push!";
  document.getElementById('subtitle').innerText = lang === 'de' 
    ? 'Der weltweit meistgeklickte verbotene Knopf'
    : 'The world’s most pushed forbidden button';
  document.getElementById('welcome').innerText = lang === 'de'
    ? 'Willkommen! Du hast 3 Freiklicks pro Tag'
    : 'Welcome! You have 3 free clicks per day';
  document.getElementById('joinBtn').innerText = lang === 'de' ? 'Teilnehmen' : 'Join';
  document.getElementById('clickBtn').innerText = lang === 'de' ? 'Nicht Drücken' : 'Don't Push';
}

function registerUser() {
  const nameField = document.getElementById('username');
  const name = nameField.value.trim();
  if (!name) return alert(language === 'de' ? 'Bitte Namen eingeben.' : 'Please enter a name.');
  username = name;
  userClicks = 0;
  freeClicks = 3;
  document.getElementById('clickBtn').disabled = false;
  alert(language === 'de' 
    ? `Willkommen, ${username}! Du hast ${freeClicks} freie Klicks.` 
    : `Welcome, ${username}! You have ${freeClicks} free clicks.`);
}

function handleClick() {
  if (!username) return alert(language === 'de' ? 'Bitte zuerst teilnehmen.' : 'Please join first.');
  if (freeClicks > 0) {
    userClicks++;
    totalClicks++;
    freeClicks--;
    updateGlobalClicks();
  } else {
    alert(language === 'de' 
      ? 'Keine Freiklicks mehr. Bitte kaufe Klicks.'
      : 'No free clicks left. Please purchase more.');
  }
}

function updateGlobalClicks() {
  const clickDisplay = document.getElementById('globalClicks');
  clickDisplay.innerText = totalClicks.toString().padStart(6, '0');
}

setLanguage('de'); // Default on load
