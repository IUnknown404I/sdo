export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
//@ts-ignore
export const pageview = url => {
	try {
		//@ts-ignore
		window.gtag('config', GA_TRACKING_ID, {
			page_path: url,
		});
	} catch (e) {}
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
//@ts-ignore
export const event = ({ action, category, label, value }) => {
	try {
		//@ts-ignore
		window.gtag('event', action, {
			event_category: category,
			event_label: label,
			value: value,
		});
	} catch (e) {}
};
