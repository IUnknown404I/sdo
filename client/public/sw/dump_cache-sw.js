/**
 *  Stale-While-Revalidate service worker's strategy used.
 */

const SHOULD_CACHE = false;
const CACHE_NAME = 'onyx-sw-cache';

// here we can cache all files described in the sw-manifest.
// MDN: fired when a ServiceWorkerRegistration acquires a new ServiceWorkerRegistration.installing worker
self.addEventListener('install', event => {
    if (!SHOULD_CACHE) return event;

    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => 
            fetch("/sw/asset-manifest.json").then(response => 
                response.json()).then(assets => {
                    const urlsToCache = ["/"];
                    if (!!assets && !!Object.values(assets).length) urlsToCache.concat(Object.values(assets));
                    cache.addAll(urlsToCache);
                })
        )
    );
});

// Look for the requested file in the cache then return and async revalidate it.
// MDN: Enables the service worker to intercept network requests and send customized responses (for example, from a local cache).
self.addEventListener('fetch', event => {
    if (!SHOULD_CACHE) return event;

    return fetch(event.request).then(networkResponse => networkResponse);
    
    // event.respondWith(
    //     caches.open(CACHE_NAME).then(cache => 
    //         caches.match(event.request).then(cachedResponse => {
    //             // if requested data has been cached
    //             if (!!cachedResponse) {
    //                 // revalidate cache
    //                 fetch(event.request)
    //                     .then(networkResponse => cache.put(event.request, networkResponse));

    //                 // return cached data
    //                 return cachedResponse;
    //             }

    //             // either just fetch, update cache and return server-response
    //             fetch(event.request)
    //                 .then(networkResponse => {
    //                     cache.put(event.request, networkResponse);
    //                     return networkResponse;
    //                 });
    //         })
    //     )
    // );
});

// that's events for the every initializing the application --> all sw-s activating
// Delete old caches that are not equal to CACHE_NAME!
self.addEventListener("activate", event => {
    // cache-names that would not wiped during iteration
    const cacheWhitelist = [CACHE_NAME];

    event.waitUntil(
        caches.keys().then(keyList =>
            // clear all caches not included in white list
            Promise.all(keyList.map(key => {
                if (!cacheWhitelist.includes(key)) return caches.delete(key);
            }))
        )
    );
});
