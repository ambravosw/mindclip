/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */
workbox.core.setCacheNameDetails({prefix: "mindclip"});

self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

// Background sync
const bgSyncPlugin = new workbox.backgroundSync.Plugin('mindclip', {
    maxRetentionTime: 0.1 * 60 // Retry for max of 24 Hours
});

workbox.routing.registerRoute(
    // 'http://192.168.1.193:8000/api/test', // con la ruta funciona, hacer regExp
    new RegExp('http://192.168.1.193:8000/api/.*'),
    workbox.strategies.networkOnly({
        plugins: [bgSyncPlugin]
    }),
    'POST'
);

// self.addEventListener('sync', event => {
//     console.log('syncing',event)
// });

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});