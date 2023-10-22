import { useEffect, useState } from 'react';

export interface UseWinDimI {
	clientWidth: number;
	clientHeight: number;
}

const getWindowDimensions: Function = (window: Window): UseWinDimI | undefined => {
	if (!window) return;
	const { innerWidth: clientWidth, innerHeight: clientHeight } = window;

	return { clientWidth, clientHeight };
};

/**
 * @IUnknown404I Hook used for get actual width and height of the client including any dimension changes. 
 * @returns  
    - clientWidth: number,
    - clientHeight: number,
 */
export const useWindowDimensions: Function = (): UseWinDimI => {
	const [windowDimensions, setWindowDimensions] = useState<UseWinDimI>({ clientWidth: 0, clientHeight: 0 });

	useEffect(() => {
		setWindowDimensions(getWindowDimensions(window));

		function handleResize() {
			setWindowDimensions(getWindowDimensions(window));
		}
		window.addEventListener('resize', handleResize);

		return () => window.removeEventListener('resize', handleResize);
	}, []);

	return windowDimensions;
};
