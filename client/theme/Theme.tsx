import { ruRU } from '@mui/material/locale';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { ruRU as dateRU } from '@mui/x-date-pickers/locales';
import { useRouter } from 'next/router';
import React, { createContext } from 'react';
import { notification } from '../components/utils/notifications/Notification';
import { rtkApi } from '../redux/api';
import { useTypedSelector } from '../redux/hooks';
import { IThemeProps } from './Theme.props';
import { componentsTheme, getThemePalette, typographyTheme } from './ThemeOptions';

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const ColorModeContext = createContext({
	mode: 'light',
	toggleColorMode: () => {},
});

/**
 * @IUnknown404I This is MUI Theme Provider component.
 * @description by default takes theme mode from localStorage and after promise resolved compairs it with the server status, where server's status is a priority.
 * @async Will update and sync with server data automatically throught the Provider events.
 * @returns Context with mui mode as <'light' | 'dark'>('light') and toggleTheme void function inside.
 */
export default function ToggleColorMode({ children }: IThemeProps) {
	const router = useRouter();
	const loadState = React.useRef<boolean>(false);
	const serverSyncFlag = React.useRef<boolean>(false);
	const authState = useTypedSelector(store => store.auth.state);

	const [metaInfoUpdate] = rtkApi.usePutMetaMutation();
	const [mode, setMode] = React.useState<'light' | 'dark'>('light');
	const { data, isLoading: isFetching, isError, refetch } = rtkApi.useMetaQuery();

	const colorMode = React.useMemo(
		() => ({
			toggleColorMode: () => {
				setMode(prevMode => (prevMode === 'light' ? 'dark' : 'light'));
			},
		}),
		[],
	);

	const themeOptions = getThemePalette(mode);

	const theme = React.useMemo(
		() =>
			// responsiveFontSizes(
			createTheme(
				{
					palette: {
						mode,
						...themeOptions,
					},
					typography: {
						...typographyTheme,
					},
					components: {
						...componentsTheme,
					},
				},
				ruRU,
				dateRU,
			),
		// {}),
		[mode, themeOptions],
	);

	React.useEffect(() => {
		if (authState && (!!!data?.theme || isError))
			refetch().then(res => {
				if (res.data == null || res.data?.theme == null)
					metaInfoUpdate.call('', { theme: mode }).finally(() => (serverSyncFlag.current = true));
				else {
					if (res.data.theme !== mode) {
						notification({
							message: 'Цветовая тема синхронизирована с сервером!',
							type: 'info',
							theme: mode || 'light',
						});
						setMode(res.data.theme);
						localStorage.setItem('rnprog_colorMode', res.data.theme);
					}
					serverSyncFlag.current = true;
				}
			});
	}, [authState]);

	React.useEffect(() => {
		const localState: string | null = localStorage.getItem('rnprog_colorMode');
		if (!loadState.current) {
			if (localState !== null && (localState === 'light' || localState === 'dark')) setMode(() => localState);
			loadState.current = true;
		} else if (localState === null || localState !== mode) localStorage.setItem('rnprog_colorMode', mode);

		// if local config already in sync with server then and only then we can update user's metaInfo on server
		if (!isError && !!data?.theme && data.theme !== mode && serverSyncFlag.current) {
			localStorage.setItem('rnprog_colorMode', mode);
			metaInfoUpdate
				.call('', { theme: mode })
				.then(res => {
					if (res == null)
						notification({
							message: 'Не удалось обновить цветовую схему на сервере. Попробуйте чуть позже.',
							type: 'warning',
							theme: mode,
						});
				})
				.catch(() =>
					notification({
						message: 'Не удалось обновить цветовую схему на сервере. Попробуйте перезагрузить страницу.',
						type: 'warning',
						theme: mode,
					}),
				);
		}
	}, [mode]);

	React.useEffect(() => {
		if (!router.isReady) return;
		const body: HTMLBodyElement | null = document?.querySelector('body');
		if (body && mode === 'light') {
			if (!body.classList.contains('light-mode')) body.classList.toggle('light-mode');
			if (body.classList.contains('dark-mode')) body.classList.toggle('dark-mode');
		} else if (body && mode === 'dark') {
			if (!body.classList.contains('dark-mode')) body.classList.toggle('dark-mode');
			if (body.classList.contains('light-mode')) body.classList.toggle('light-mode');
		}
	}, [router.isReady, mode]);

	return (
		<ColorModeContext.Provider value={{ ...colorMode, mode }}>
			<ThemeProvider theme={theme}>{Array.isArray(children) ? children.map(el => el) : children}</ThemeProvider>
		</ColorModeContext.Provider>
	);
}
