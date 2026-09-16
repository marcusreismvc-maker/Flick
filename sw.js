const CACHE_NAME = "missoes-familia-v1";
const SHELL = ["index.html", "manifest.json"];

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL)));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  // Network-first para tudo (o app depende de dados sempre atualizados
  // do Supabase); cache é só um fallback offline básico do shell.
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
