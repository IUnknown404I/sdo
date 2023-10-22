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
					<link rel='icon' href='/favicon.ico' />
					<meta
						name='copyright'
						lang='ru'
						content='Научно-образовательный центр ООО «Газпром межрегионгаз инжиниринг»'
					/>

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
