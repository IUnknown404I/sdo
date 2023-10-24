import { useTheme } from '@mui/material/styles';
import { NextPage } from 'next';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import Script from 'next/script';
import { ReactElement, ReactNode, useEffect } from 'react';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import AuthProtectWrapper from '../layout/AuthProtectWrapper';
import CommunicationWrapper from '../layout/CommunicationWrapper';
import MetaWrapper from '../layout/MetaWrapper';
import { store } from '../redux/store';
import '../styles/ckeditor5.css';
import '../styles/globals.scss';
import ToggleColorMode from '../theme/Theme';
import * as gtag from '../utils/gtag';
import { checkProductionMode } from '../utils/utilityFunctions';

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
	getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
	Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
	const theme = useTheme();
	const router = useRouter();

	useEffect(() => {
		const handleRouteChange = (url: any) => {
			gtag.pageview(url);
		};
		router.events.on('routeChangeComplete', handleRouteChange);
		router.events.on('hashChangeComplete', handleRouteChange);
		return () => {
			router.events.off('routeChangeComplete', handleRouteChange);
			router.events.off('hashChangeComplete', handleRouteChange);
		};
	}, [router.events]);

	return (
		<>
			{/* Global Site Tag (gtag.js) - Google Analytics */}
			{checkProductionMode() && (
				<>
					<Script
						strategy='afterInteractive'
						src={`https://www.googletagmanager.com/gtag/js?id=${gtag.GA_TRACKING_ID}`}
					/>
					<Script
						id='gtag-init'
						strategy='afterInteractive'
						dangerouslySetInnerHTML={{
							__html: `
            					window.dataLayer = window.dataLayer || [];
            					function gtag(){dataLayer.push(arguments);}
            					gtag('js', new Date());
            					gtag('config', '${gtag.GA_TRACKING_ID}', {
              					page_path: window.location.pathname,
            					});
							`,
						}}
					/>
				</>
			)}

			<Provider store={store}>
				<AuthProtectWrapper>
					<ToggleColorMode>
						<MetaWrapper>
							<CommunicationWrapper>
								<ToastContainer
									limit={5}
									autoClose={4500}
									position='top-right'
									draggable
									newestOnTop
									closeOnClick
									pauseOnHover
									pauseOnFocusLoss
									rtl={false}
									hideProgressBar={false}
									theme={theme.palette.mode}
								/>
								<Component {...pageProps} />
							</CommunicationWrapper>
						</MetaWrapper>
					</ToggleColorMode>
				</AuthProtectWrapper>
			</Provider>
		</>
	);
}

export default MyApp;
