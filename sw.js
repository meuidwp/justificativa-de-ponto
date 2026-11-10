/* Service worker: deixa o aplicativo abrir offline.
   Ao publicar uma nova versão do app, aumente o número em VERSION para atualizar o cache nos aparelhos. */
const VERSION = 'v6';
const CACHE = 'justificativa-ponto-' + VERSION;
const RUNTIME = 'justificativa-ponto-runtime'; // bibliotecas de OCR (CDN), guardadas na primeira leitura
const PRECACHE = [
  './', './index.html', './manifest.webmanifest',
  './icons/icon-192.png', './icons/icon-512.png', './icons/maskable-512.png',
  './icons/apple-touch-icon.png', './icons/favicon-32.png', './icons/favicon.ico',
];
const CDN_HOSTS = ['cdn.jsdelivr.net', 'tessdata.projectnaptha.com', 'unpkg.com'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('justificativa-ponto-') && k !== CACHE && k !== RUNTIME).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Bibliotecas do OCR: cache primeiro; se não tiver, busca na rede e guarda
  if (CDN_HOSTS.includes(url.hostname)) {
    e.respondWith(
      caches.open(RUNTIME).then(async (cache) => {
        const hit = await cache.match(req);
        if (hit) return hit;
        const res = await fetch(req);
        if (res && (res.ok || res.type === 'opaque')) cache.put(req, res.clone());
        return res;
      })
    );
    return;
  }

  // Arquivos do próprio app: cache primeiro e atualiza em segundo plano
  if (url.origin === self.location.origin) {
    e.respondWith(
      caches.open(CACHE).then(async (cache) => {
        const hit = await cache.match(req, { ignoreSearch: true });
        const net = fetch(req).then((res) => { if (res && res.ok) cache.put(req, res.clone()); return res; }).catch(() => null);
        if (hit) { e.waitUntil(net); return hit; }
        const res = await net;
        if (res) return res;
        if (req.mode === 'navigate') return cache.match('./index.html');
        return new Response('Sem conexão', { status: 503, statusText: 'Offline' });
      })
    );
  }
});
