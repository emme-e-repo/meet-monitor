console.log("[Meet Monitor EXT] content.js caricato su", location.href);

let callStartedAt = null;
let currentURL = location.href;
let alreadyLogged = false;

// Funzione per inviare il log al server
function sendLog(start, end, participants) {
  if (alreadyLogged) return;
  alreadyLogged = true;

  setTimeout(() => (alreadyLogged = false), 5000);

  const duration = Math.floor((end - start) / 1000);
  console.log("[Meet Monitor EXT] Invio log:", duration, "secondi", participants);

  fetch("https://c56f826bd0d4.ngrok-free.app/api/log", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      start: new Date(start).toISOString(),
      end: new Date(end).toISOString(),
      duration,
      participants
    })
  })
    .then(() => console.log("✅ Log inviato correttamente"))
    .catch((err) => console.error("❌ Errore nell'invio log:", err));
}

// Funzione per estrarre le email dei partecipanti
function getParticipantsEmails() {
  const elems = document.querySelectorAll('[data-participant-id]');
  const emails = [];
  elems.forEach((el) => {
    const email = el.getAttribute('data-participant-id');
    if (email && !emails.includes(email)) emails.push(email);
  });
  return emails;
}
console.log("[Meet Monitor EXT] prima observer");
// Observer per rilevare inizio/fine chiamata
const observer = new MutationObserver(() => {
  const participants = getParticipantsEmails();

  // Inizio chiamata: almeno 2 partecipanti (tu + almeno 1)
  if (participants.length > 1 && !callStartedAt) {
    callStartedAt = Date.now();
    console.log("[Meet Monitor EXT] Chiamata iniziata con", participants.length, "partecipanti:", new Date(callStartedAt));
  }

  // Fine chiamata: rimasto solo 1 partecipante
  if (participants.length <= 1 && callStartedAt) {
    const callEndedAt = Date.now();
    sendLog(callStartedAt, callEndedAt, participants);
    callStartedAt = null;
    console.log("[Meet Monitor EXT] Chiamata terminata automaticamente");
  }
});

// Avvio observer sul DOM
observer.observe(document.body, { childList: true, subtree: true });
console.log("[Meet Monitor EXT] observer avviato");

// Controllo cambio URL (uscita dalla call o cambio pagina)
setInterval(() => {
  if (location.href !== currentURL) {
    if (callStartedAt && currentURL.includes('meet.google.com') && !location.href.includes('meet.google.com')) {
      const callEndedAt = Date.now();
      const participants = getParticipantsEmails();
      sendLog(callStartedAt, callEndedAt, participants);
      callStartedAt = null;
      console.log("[Meet Monitor EXT] Chiamata terminata (URL change)");
    }
    currentURL = location.href;
  }
}, 1000);

// Prima che la tab si chiuda
window.addEventListener('beforeunload', () => {
  if (callStartedAt) {
    const participants = getParticipantsEmails();
    sendLog(callStartedAt, Date.now(), participants);
    callStartedAt = null;
    console.log("[Meet Monitor EXT] Chiamata terminata (tab close)");
  }
});
