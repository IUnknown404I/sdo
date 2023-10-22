import React from 'react';

/**
 * @IUnknown404I Hook for debounce data.
 * @param value <T> value to be debounced.
 * @param delay <number> as milliseconds.
 * @param options <Object> with 'leading' attribute.
 * - Leading attribute forces the first update of the value when no query is stucked.
 * @returns an Array<X, Y>, where:
 * - X is debounced value;
 * - Y is clearFunction.
 */
//TODO: doesnt work as planned. Infinity reload detected.
export function useDebouncedValue<T = any>(
	value: T,
	delay: number,
	options = { leading: false }
): readonly [T, () => void] {
	const [_value, setValue] = React.useState(value);
	const mountedRef = React.useRef(false);
	const timeoutRef = React.useRef<number>();
	const cooldownRef = React.useRef(false);

	const cancel = () => window.clearTimeout(timeoutRef.current);
	React.useEffect(() => {
		mountedRef.current = true;
		return cancel;
	}, []);

	React.useEffect(() => {
		if (mountedRef.current) {
			if (!cooldownRef.current && options.leading) {
				cooldownRef.current = true;
				setValue(value);
			} else {
				cancel();
				timeoutRef.current = window.setTimeout(() => {
					cooldownRef.current = false;
					setValue(value);
				}, delay);
			}
		}
	}, [value, options.leading, delay]);


	return [_value, cancel] as const;
}
