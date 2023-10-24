/**
 *  @IUnknown404I
 */

const SHOULD_CACHE = true;
const CACHE_STORAGE_NAME = 'onyx-main-cache';

const TIMEOUT_FETCH_MODE = false;
const TIMEOUT_BEFORE_CACHE_USED = 500;

// here we can cache all files described in the sw-manifest or hard-coded.
self.addEventListener('install', event => {
    if (!SHOULD_CACHE) return event;

    event.waitUntil(
        caches
            .open(CACHE_STORAGE_NAME)
            .then((cache) => fetch("/sw/asset-manifest.json").then(response =>
            // .then((cache) => fetch("https://sdo.rnprog.ru/sw/asset-manifest.json").then(response => 
                response.json()).then(assets => {
                    let urlsToCache = ["/"];
                    if (!!assets && !!Object.values(assets).length) urlsToCache = urlsToCache.concat(Object.values(assets));
                    cache.addAll(urlsToCache);
                }))
            // skipWaiting() needs here for setting this sw as the controller for all scope in "activate" bock down
            .then(() => self.skipWaiting())
    );
});

self.addEventListener("activate", event => {
    if (!SHOULD_CACHE) return event;

    // self.clients.claim() for the scope-controller change and intercept all events
    event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
    if (!SHOULD_CACHE) return event;

    // network first --> cache after --> FALLBACK_ELEMENT either
    event.respondWith(networkOrCache(event.request).catch(error => event.request.method === 'GET' ? useFallback() : error));
});

function networkOrCache(request) {
    return fromNetwork(request.clone(), TIMEOUT_FETCH_MODE ? TIMEOUT_BEFORE_CACHE_USED : false)
        .then(response => {
            return response;
            // // if response is ok cache it and return
            // if (response.ok) {
            //     if (request.method === 'GET') {
            //         caches.open(CACHE_STORAGE_NAME).then(cache => cache.put(request.clone(), response.clone()));
            //         return response.clone();
            //     }
            //     return response.clone();
            // }
        })
        // if error during fetch-logic occures --> check the cached data
        .catch(() => fromCache(request.clone()));
}

// the Element for the offline mode only
const FALLBACK_ELEMENT = `
        <html><head><title>Нет интернета!</title></head><body><main><article style="width:100vw;height:100vh;display:flex;justify-content:center;align-items:center;background-color:#eff2f6;padding:.25rem"><section style="position:relative;display:flex;flex-direction:column;width:fit-content;max-width:1005px;padding:1.25rem 1.5rem;background-color:white;border:3px inset #006fba;border-radius:15px;gap:2rem"><h2 style="font-size:1.5rem;text-align:center;width:100%;color:#006fba">Система дистанционного образования ООО «Газпром межрегионгаз инжиниринг»</h2><div style="width:100%;display:flex;flex-direction:row;align-items:center;justify-content:space-between;gap:1rem"><img src="/offline.png" alt="offline mode" width="128px" height="128px"><div><strong>Упс! Кажется, у вас нет доступа в интернет!</strong><p style="margin-top:.75rem">Запрашиваемый ресурс сейчас недоступен, попробуйте снова, когда появится выход в интернет!</p><p>Без сети можно посещать только те страницы, которые были заранее закешированы системой.</p></div></div><p style="text-align:center;width:100%;font-size:.85rem;color:gray">© Система дистанционного образования научно-образовательного центра ООО «Газпром межрегионгаз инжиниринг»</p></section></article></main></body></html>
    `;

/**
 *  returns the promise as http response for the offline mode.
 */
function useFallback() {
    return Promise.resolve(new Response(FALLBACK_ELEMENT, { headers: {
        'Content-Type': 'text/html; charset=utf-8'
    }}));
}

/**
 *  updates the cache by passed request-object.
 */
function update(request) {
    return caches.open(CACHE_STORAGE_NAME).then(cache =>
        fetch(request.clone()).then(response =>
            cache.put(request.clone(), response.clone()).then(() => response)
        )
    );
}

/**
 *  search and returns the target data by passed request-object.
 */
function fromCache(request) {
    return caches.open(CACHE_STORAGE_NAME).then(cache =>
        cache.match(request).then(matching =>
            matching || Promise.reject('no-cache-store-match')
        ));
}

/**
 *  fetching the passed request with time limit (if passed) or not.
 */
function fromNetwork(request, timeout) {
    // time-limited request
    if (!!timeout)
        return new Promise((fulfill, reject) => {
            const timeoutId = setTimeout(reject, timeout);
            fetch(request).then(response => {
                clearTimeout(timeoutId);
                fulfill(response);
            }, reject);
        });
    
    // common case
    return fetch(request);
}

/**
 *  send the notification about changed ui for the all clients of the controller.
 *  @deprecated
 */
// function refresh(response) {
//     return self.clients.matchAll().then(clients => {
//         clients.forEach(client => {
//             const message = {
//                 type: 'refresh-ui',
//                 url: response.url,
//                 eTag: response.headers.get('ETag')
//             };
//             client.postMessage(JSON.stringify(message));
//         });
//     });
// }