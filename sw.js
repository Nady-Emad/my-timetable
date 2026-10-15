var V = 'tt-v1', SHELL = ['./', 'index.html', 'manifest.json', 'icon-192.png', 'icon-512.png'];
self.addEventListener('install', function (e) { e.waitUntil(caches.open(V).then(function (c) { return c.addAll(SHELL); }).then(function () { return self.skipWaiting(); })); });
self.addEventListener('activate', function (e) { e.waitUntil(caches.keys().then(function (ks) { return Promise.all(ks.filter(function (k) { return k !== V; }).map(function (k) { return caches.delete(k); })); }).then(function () { return self.clients.claim(); })); });
self.addEventListener('fetch', function (e) {
  var r = e.request; if (r.method !== 'GET') return;
  var u = new URL(r.url);
  var ok = u.origin === location.origin || /fonts\.(googleapis|gstatic)\.com$/.test(u.hostname);
  if (!ok) return;
  e.respondWith(caches.match(r, { ignoreSearch: true }).then(function (hit) {
    var net = fetch(r).then(function (res) { if (res && (res.ok || res.type === 'opaque')) { var c = res.clone(); caches.open(V).then(function (ch) { ch.put(r, c); }); } return res; })
      .catch(function () { return hit || caches.match('index.html'); });
    return hit || net;
  }));
});
