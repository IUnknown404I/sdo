import React from 'react';

/**
 * @IUnknown404I Hook for interaction with data.
 * @param stateValue <T> value of the returned debounced state.
 * @param delay <number> as milliseconds.
 * @param options <Object> with 'leading' attribute.
 * - Leading attribute forces the first update of the value when no query is stucked.
 * @returns tipical array of the React State and Set State Function.
 */
export function useDebouncedState<T = any>(
	stateValue: T,
	delay: number,
	options = { leading: false }
): readonly [T, React.Dispatch<React.SetStateAction<T>>] {
	const [value, setValue] = React.useState<T>(stateValue);
	
	const timeoutRef = React.useRef<number>();
	const leadingRef = React.useRef<boolean>(true);

	const cancel = () => window.clearTimeout(timeoutRef.current);
	React.useEffect(() => cancel, []);

	const debouncedSetValue = (passedValue: T | ((previousValue: T) => T)) => {
		cancel();
		const callback = typeof passedValue === 'function' 
			? () => setValue(passedValue as ((previousValue: T) => T))
			: () => setValue(passedValue);

		if (leadingRef.current && options.leading) callback();
		else
			timeoutRef.current = window.setTimeout(() => {
				leadingRef.current = true;
				callback();
			}, delay);
		leadingRef.current = false;
	};

	return [value, debouncedSetValue] as const;
}