/** @type {import('next').NextConfig} */

module.exports = {
	reactStrictMode: true,
	swcMinify: true,

	rewrites: async () => {
		return [...getAllRewrites()];
	},

	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'api.umcmrg.ru',
				pathname: '/files/get-file',
			},
			{
				protocol: 'https',
				hostname: 'api.umcmrg.ru',
				pathname: '/public/',
			},
		],
	},

	webpack(config, options) {
		config.module.rules.push({
			loader: '@svgr/webpack',
			issuer: /\.[jt]sx?$/,
			options: {
				prettier: false,
				svgo: true,
				svgoConfig: {
					plugins: [
						{
							name: 'preset-default',
							params: {
								override: {
									removeViewBox: false,
								},
							},
						},
					],
				},
				titleProp: true,
			},
			test: /\.svg$/,
		});
		return config;
	},

	typescript: {
		ignoreBuildErrors: true,
	},
};

/**
 * @IUnknown404I
 * @returns all next rewrites options for Pages, Files and Seo-params.
 */
function getAllRewrites() {
	const nextPagesRewites = [
		{ source: '/', destination: '/account/dashboard' },
		{ source: '/account', destination: '/account/dashboard' },
		{ source: '/communication', destination: '/communication/hub' },
		{ source: '/events', destination: '/events/records' },
		{ source: '/service', destination: '/service/configuration' },
		// { source: '', destination: '' },
	];
	const nextFilesRewites = [
		{ source: '/cache-sw.js', destination: '/sw/cache-sw.js' },

		{ source: '/favicon', destination: '/favicon.ico' },
		{ source: '/static/favicon', destination: '/favicon.ico' },
		{ source: '/static/favicon.ico', destination: '/favicon.ico' },

		{ source: '/mailing-image', destination: '/images/emails/mailing.png' },
		{ source: '/static/mailing-image', destination: '/images/emails/mailing.png' },
		{ source: '/lock-image', destination: '/images/emails/lock.png' },
		{ source: '/static/lock-image', destination: '/images/emails/lock.png' },
		{ source: '/email-verification-image', destination: '/images/emails/emailVerification.png' },
		{ source: '/static/email-verification-image', destination: '/images/emails/emailVerification.png' },
		{ source: '/email-notification-image', destination: '/images/emails/emailNotification.png' },
		{ source: '/static/email-notification-image', destination: '/images/emails/emailNotification.png' },
		{ source: '/pass-recovery-image', destination: '/images/emails/passVerification.png' },
		{ source: '/static/pass-recovery-image', destination: '/images/emails/passVerification.png' },
	];
	const nextSeoRewites = [
		{ source: '/static/sitemap-html', destination: '/static/sitemap.html' },
		{ source: '/sitemap-html', destination: '/static/sitemap.html' },
		{ source: '/sitemap.html', destination: '/static/sitemap.html' },

		{ source: '/static/sitemap', destination: '/static/sitemap.xml' },
		{ source: '/static/sitemap-xml', destination: '/static/sitemap.xml' },
		{ source: '/sitemap-xml', destination: '/static/sitemap.xml' },
		{ source: '/sitemap.xml', destination: '/static/sitemap.xml' },
	];

	return [ ...nextPagesRewites, ...nextFilesRewites, ...nextSeoRewites ];
}
