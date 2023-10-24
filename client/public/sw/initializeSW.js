/**
 * Init the nesessary SW-files.
 */
if (!!navigator && 'serviceWorker' in navigator) {
	window.addEventListener('load', () => {
		navigator.serviceWorker
			.register('/cache-sw.js')
			.then(
				registration => console.log('ServiceWorker registration done'),
				error => console.log('ServiceWorker registration failed: ', error) ,
			)
			.catch(error => console.log(error));
	});
}