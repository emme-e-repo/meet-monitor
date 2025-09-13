console.log("[TEST] content.js caricato");

let callStartedAt = null;

const observer = new MutationObserver(() => {
  console.log("[TEST] observer callback");
});

observer.observe(document.body, { childList: true, subtree: true });
