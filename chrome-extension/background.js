
  self.addEventListener('install', () => {
    console.log("Meet Monitor EXT installata");
  });
  
  self.addEventListener('activate', (event) => {
    // Disattiva la navigation preload per evitare l'errore
    event.waitUntil(
      self.registration.navigationPreload.disable()
    );
  });
  
  
