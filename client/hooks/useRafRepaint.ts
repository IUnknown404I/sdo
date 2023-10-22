import React from 'react';

/**
 * @IUnknown404I Hook for manually repaint the component according passed timing.
 * @param delay (partial) number as milleseconds;
 * @returns timer id or undefined while initializing.
 * @default delay = 30s
 */
const useRafRepaint = (delay?: number): undefined | number => {
	let timerID: undefined | NodeJS.Timeout = undefined;

	React.useEffect(() => {
		timerID = setTimeout(
			function tick() {
				requestAnimationFrame(() => {});
				timerID = setTimeout(tick, typeof delay === 'undefined' ? 30e3 : delay);
			},
			typeof delay === 'undefined' ? 30e3 : delay,
		);
		return () => clearTimeout(timerID);
	}, []);

	return timerID;
};

export default useRafRepaint;
