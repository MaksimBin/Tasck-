const CACHE_NAME = "tasck-cache-v1";
const BASE_PATH = "/Tasck-/";

const urlsToCache = [
  BASE_PATH,
  BASE_PATH + "index.html",
  BASE_PATH + "styles.css",
  BASE_PATH + "script.js",
  BASE_PATH + "manifest.json"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))
    )
  );
});