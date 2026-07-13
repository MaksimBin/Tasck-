const CACHE_NAME = "iudushka-cache-v1";
const urlsToCache = [
  "./",
  "./index.html",
  "./style.css",
  "./main.js",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

// Установка: кэшируем базовые файлы и сразу активируем воркер
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting(); // активируем без ожидания перезагрузки
});

// Активация: чистим старый кэш и сразу берём управление страницами
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(names =>
      Promise.all(names.map(name => {
        if (name !== CACHE_NAME) return caches.delete(name);
      }))
    )
  );
  self.clients.claim(); // сразу управляем открытыми вкладками
});

// Перехват запросов: сначала кэш, потом сеть
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(resp => resp || fetch(event.request))
  );
});