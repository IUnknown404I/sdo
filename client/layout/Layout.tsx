import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { Button, SxProps, Theme } from '@mui/material';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ComponentProps, JSXElementConstructor, ReactElement } from 'react';
import { Footer, Header, LogoGMI, Sidebar } from '../components';
import OnyxBreacrumbs, { BreadcrumbItem } from '../components/basics/OnyxBreadcrumbs';
import { APP_MAX_WIDTH } from '../pages/_app';
import ActiveRunsModalAlert from './layout-components/ActiveRunsModalAlert';

export type WrapperProps<T> = {
	wrapper: JSXElementConstructor<T>;
	props: Omit<ComponentProps<JSXElementConstructor<T>>, 'children'>;
};
interface ILayoutPropsWithWrapper<T> extends ILayoutProps {
	additionalWrapper: WrapperProps<T>;
}
export interface ILayoutProps {
	children: ReactElement | JSX.Element[];
	contentContainerSx?: SxProps<Theme>;
	breadcrumbs?: BreadcrumbItem[];
	backButton?: boolean;
	backButtonProps?: {
		historyBack?: boolean;
		href?: string;
		text?: string;
		color?: ComponentProps<typeof Button>['color'];
		size?: ComponentProps<typeof Button>['size'];
		variant?: ComponentProps<typeof Button>['variant'];
		onClick?: Function;
		sx?: SxProps;
	};
	disableActiveRunsAlert?: boolean;
}

/**
 * @IUnknown404I This is basic layout all over across Onyx ecosystem for the pages.
 * @param additionalWrapper is optional Object that can be used for adding an additional logic-layer as wrapper for all inner content (generic);
 * - additionalWrapper.wrapper is and Constructor for the additional wrapper (generic);
 * - additionalWrapper.props is an optional Props for the additional wrapper that will be passed in (generic);
 * @param contentContainerSx is an MUI SxStyles Object for the container of the passed children;
 * @param breadcrumbs an optional Array of BreadcrumbItems that will be processed by OnyxBreacrumbs component;
 * @param backButton boolean flag for use or not the back-button on the top-right of the content-layout;
 * - backButtonProps.historyBack optional boolean flag for redirecting user to the previous url from the router-history (by default will be redirected to the previous elem via the url);
 * - backButtonProps.href optional url that user will be redirected to if he click on the button;
 * - backButtonProps.text optional text for the button;
 * - backButtonProps.color optional MUI-palette colors for the button;
 * - backButtonProps.size optional MUI-Components size for the button;
 * - backButtonProps.variant optional MUI-Button component variant for the button;
 * - backButtonProps.onClick onClick callback for the button's click event;
 * - backButtonProps.sx is an MUI SxStyles Object for the button;
 * @returns JSX.Element as the basic UI with the passed childrens.
 */
function Layout<T>(props: ILayoutProps | ILayoutPropsWithWrapper<T>): JSX.Element {
	const router = useRouter();

	const handleRouteBack = () => {
		if (!!props.backButtonProps?.historyBack) router.back();
		else if (!!router.query.from) router.push(router.query.from as string);
		else if (!!props.backButtonProps?.href) router.push(props.backButtonProps.href);
		else {
			const basepath = router.asPath.includes('?')
				? router.asPath.slice(0, router.asPath.indexOf('?'))
				: router.asPath;
			router.push(basepath.slice(0, basepath.lastIndexOf('/')));
		}
	};

	return (
		<>
			<Head>
				<meta name='description' content='Система дистанционного образования Газпром межрегионгаз инжиниринг' />
				<meta
					name='copyright'
					lang='ru'
					content='Научно-образовательный центр ООО «Газпром межрегионгаз инжиниринг»'
				/>
				<link rel='icon' href='/favicon.ico' />
			</Head>

			<Grid
				container
				component='main'
				sx={{
					color: 'text.primary',
					bgcolor: 'background.default',
					maxWidth: `${APP_MAX_WIDTH}px`,
				}}
			>
				{!props.disableActiveRunsAlert && <ActiveRunsModalAlert />}

				<Grid
					item
					component='nav'
					xs={0}
					md={0}
					lg={2}
					xl={2}
					display={{ xs: 'none', md: 'none', lg: 'block' }}
				>
					<Stack position='sticky' top='0' sx={{ minHeight: '99.9lvh' }}>
						<LogoGMI />
						<Sidebar />
						<Footer />
					</Stack>
				</Grid>

				<Grid
					item
					sx={{ margin: 0, padding: 0, position: 'relative', backgroundColor: '#eceff1', overflow: 'hidden' }}
					xs={12}
					sm={12}
					md={12}
					lg={10}
					xl={10}
				>
					<Header />
					<Box
						component='section'
						sx={{
							width: '100%',
							display: 'flex',
							flexDirection: 'column',
							padding: '15px',
							marginTop: '100px',
							minHeight: 'calc(100vh - 100px)',
							backgroundColor: 'content.main',
							...props.contentContainerSx,
						}}
					>
						{props.backButton ? (
							<Stack
								width='100%'
								direction='row'
								justifyContent='space-between'
								alignItems='center'
								marginBottom='.5rem'
								gap={2}
							>
								{!!props.breadcrumbs && props.breadcrumbs.length > 0 ? (
									<OnyxBreacrumbs
										separator='>'
										itemList={[...props.breadcrumbs]}
										sx={{ marginBottom: '1rem' }}
									/>
								) : (
									<div />
								)}

								<Button
									color={props.backButtonProps?.color}
									size={props.backButtonProps?.size || 'small'}
									variant={props.backButtonProps?.variant || 'outlined'}
									onClick={
										!!props.backButtonProps?.onClick
											? () => {
													props.backButtonProps!.onClick!();
													handleRouteBack();
											  }
											: handleRouteBack
									}
									sx={{ paddingInline: '1rem', whiteSpace: 'nowrap', ...props.backButtonProps?.sx }}
								>
									<KeyboardBackspaceIcon sx={{ fontSize: '1.25rem', marginRight: '.25rem' }} />{' '}
									{props.backButtonProps?.text || 'Вернуться'}
								</Button>
							</Stack>
						) : !!props.breadcrumbs && props.breadcrumbs.length > 0 ? (
							<OnyxBreacrumbs
								separator='>'
								itemList={[...props.breadcrumbs]}
								sx={{ marginBottom: '1rem' }}
							/>
						) : (
							<></>
						)}

						{'additionalWrapper' in props && !!props.additionalWrapper ? (
							// @ts-ignore
							<props.additionalWrapper.wrapper {...props.additionalWrapper.props}>
								{props.children}
							</props.additionalWrapper.wrapper>
						) : (
							props.children
						)}
					</Box>
				</Grid>
			</Grid>
		</>
	);
}

export default Layout;
