import { CssBaseline } from '@mui/material';
import Document, { DocumentContext, DocumentInitialProps, Head, Html, Main, NextScript } from 'next/document';
import { checkProductionMode } from '../utils/utilityFunctions';

class MyDocument extends Document {
	static async getInitialProps(ctx: DocumentContext): Promise<DocumentInitialProps> {
		const initialProps = await Document.getInitialProps(ctx);
		return { ...initialProps };
	}

	render(): JSX.Element {
		return (
			<Html lang='ru'>
				<Head>
					<meta charSet='utf-8' />
					<meta name='robots' content='noindex, nofollow' />
					<meta
						name='copyright'
						lang='ru'
						content='Научно-образовательный центр ООО «Газпром межрегионгаз инжиниринг»'
					/>
					<link rel='manifest' href='/pwa/manifest.json' />

					<link rel='apple-touch-icon' sizes='57x57' href='/pwa/pwa/apple-icon-57x57.png' />
					<link rel='apple-touch-icon' sizes='60x60' href='/pwa/apple-icon-60x60.png' />
					<link rel='apple-touch-icon' sizes='72x72' href='/pwa/apple-icon-72x72.png' />
					<link rel='apple-touch-icon' sizes='76x76' href='/pwa/apple-icon-76x76.png' />
					<link rel='apple-touch-icon' sizes='114x114' href='/pwa/apple-icon-114x114.png' />
					<link rel='apple-touch-icon' sizes='120x120' href='/pwa/apple-icon-120x120.png' />
					<link rel='apple-touch-icon' sizes='144x144' href='/pwa/apple-icon-144x144.png' />
					<link rel='apple-touch-icon' sizes='152x152' href='/pwa/apple-icon-152x152.png' />
					<link rel='apple-touch-icon' sizes='180x180' href='/pwa/apple-icon-180x180.png' />
					<link rel='icon' href='/pwa/favicon.ico' />
					<link rel='icon' type='image/png' sizes='192x192' href='/pwa/android-icon-192x192.png' />
					<link rel='icon' type='image/png' sizes='32x32' href='/pwa/favicon-32x32.png' />
					<link rel='icon' type='image/png' sizes='96x96' href='/pwa/favicon-96x96.png' />
					<link rel='icon' type='image/png' sizes='16x16' href='/pwa/favicon-16x16.png' />

					<meta name='theme-color' content='#ffffff' />
					<meta name='msapplication-TileColor' content='#ffffff' />
					<meta name='msapplication-TileImage' content='/ms-icon-144x144.png' />
					<meta name='msapplication-navbutton-color' content='#ffffff' />

					<meta name='mobile-web-app-capable' content='yes' />
					<meta name='apple-mobile-web-app-capable' content='yes' />
					<meta name='application-name' content='Educational platform' />
					<meta name='apple-mobile-web-app-title' content='Educational platform' />
					<meta name='apple-mobile-web-app-status-bar-style' content='black-translucent' />
					<meta name='msapplication-starturl' content='/' />

					{/* service workers initialize */}
					<script async src='/sw/initializeSW.js' />

					{/* init for Yandex Metrics */}
					{checkProductionMode() && (
						<>
							<script
								dangerouslySetInnerHTML={{
									__html: `
                    			(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
                    			m[i].l=1*new Date();
                    			for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
                    			k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
                    			(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
                    			ym(${process.env.NEXT_PUBLIC_YM}, "init", {
                    			clickmap:true,
                    			trackLinks:true,
                    			accurateTrackBounce:true,
                    			webvisor:true
                				});`,
								}}
							/>

							<noscript>
								<div>
									<img
										src={`https://mc.yandex.ru/watch/${process.env.NEXT_PUBLIC_YM}`}
										style={{ position: 'absolute', left: '-9999px' }}
										alt=''
										width={0}
										height={0}
									/>
								</div>
							</noscript>
						</>
					)}
				</Head>

				<CssBaseline />
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}

export default MyDocument;
