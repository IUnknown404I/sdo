import React from 'react';

/**
 * @IUnknown404I Hook for debounce the functions.
 * @param callback as a <function> to be debounced.
 * @param delay as <number>.
 * @returns wrapper-function over passed function
 */
export function useDebouncedCallback<T extends any[]>(
	callback: (...args: T) => void,
	delay: number
): (...args: T) => void {
	const argsRef = React.useRef<T>();
	const timeoutRef = React.useRef<ReturnType<typeof setTimeout>>();

	const cancel = () =>
		window.clearTimeout(
			timeoutRef.current && (timeoutRef.current as unknown as number)
		);
	React.useEffect(() => cancel, []);

	return function debouncedCallback(...args: T) {
		argsRef.current = args;
		cancel();

		timeoutRef.current = setTimeout(() => {
			if (argsRef.current) callback(...argsRef.current);
		}, delay);
	};
}
