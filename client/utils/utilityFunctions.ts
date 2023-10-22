// TODO: proxing observable realize!
// export const makeObservable = (target: Object, handler: (property: string, newValue?: any) => void) => {
// 	console.log(target);
// 	console.log(handler);

// 	const observe = Symbol('observe');
// 	const handlers = Symbol('handlers');
// 	target[handlers] = [] as ((property: string, value: any) => void)[];

// 	target[observe] = function () {
// 		this[handlers].push(handler);
// 	};

// 	return new Proxy(target, {
// 		get(target, property, receiver) {
// 			console.log('SETTING', property);
// 			if (Reflect.get(...arguments)) target[handlers].forEach(handler => handler(property));
// 			return true;
// 		},
// 		set(target, property, value, receiver) {
// 			console.log('SETTING', property);
// 			if (Reflect.set(...arguments)) target[handlers].forEach(handler => handler(property, value));
// 			return true;
// 		},
// 	});
// };

/**
 * @IUnknown404I Generic for type-checks of passed ?any value accroding passed Type.
 * @param x is a value to type-check.
 * @returns is value's type passed Type or not.
 */
export const isType = <T>(x: any): x is T => true;

/**
 * @IUnknown404I Simply return an array with all keys by deep scanning. Also can logs all steps.
 * @param payload as [Object] with keys:
 * - obj: [Object] as main obj to analize;
 * - enableLogs?: [boolean], false by default. Pass true to logout every found key on the steps;
 * - prefix?: [string] as prefixed keynames for the inner objects.
 * @returns Array<string> as all-keys of passed object.
 */
export const deepObjectKeysGetter = (payload: { obj: Object; enableLogs?: boolean; prefix?: string }): string[] => {
	let keysArray: string[] = [];
	Object.keys(payload.obj).forEach(el => {
		if (payload.obj[el as keyof typeof payload.obj] instanceof Object)
			keysArray = keysArray.concat(
				deepObjectKeysGetter({ obj: payload.obj[el as keyof typeof payload.obj], prefix: el }),
			);
		else keysArray.push(payload.prefix ? `${payload.prefix}.${el}` : el);
	});
	return keysArray;
};

export const isIOS = (): boolean => typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);

export const isMobileDevice = (): boolean =>
	typeof navigator !== 'undefined' &&
	/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(
		navigator.userAgent,
	);

export const checkProductionMode = (): boolean => process.env.NEXT_PUBLIC_PRODUCTION_MODE === 'true';

/**
 * @IUnknown404I funciton for copying text. Uses deprecated browser API as fallback in edge cases.
 * @param text as string to copy.
 */
export async function copyTextToClipboard(text: string) {
	if (!navigator.clipboard) {
		// deprecated fallback
		fallbackCopyTextToClipboard(text);
		return;
	}
	navigator.clipboard.writeText(text);
}

/**
 * @deprecated
 * @IUnknown404I use this function only if navigator.clipboard object isn't avaible.
 * @param text as string to copy.
 */
function fallbackCopyTextToClipboard(text: string) {
	var textArea = document.createElement('textarea');
	textArea.value = text;
	textArea.style.opacity = '0';

	// Avoid scrolling to bottom
	textArea.style.top = '0';
	textArea.style.left = '0';
	textArea.style.position = 'fixed';

	document.body.appendChild(textArea);
	textArea.focus();
	textArea.select();

	try {
		var successful = document.execCommand('copy');
	} catch (e) {}

	document.body.removeChild(textArea);
}

export function scrollDocumentToTop() {
	if (!!document.scrollingElement) document.scrollingElement.scrollTo(0, 0);
}

/**
 * @IUnknown404I Scrolling to the end of passed element throught Ref object.
 * @param element as Ref object.
 * @param timeout optional, pass as number.
 */
export function scrollDivToBottom(
	element: React.RefObject<HTMLDivElement | undefined> | React.RefObject<HTMLDivElement>,
	timeout: number = 0,
) {
	setTimeout(() => {
		if (element?.current) {
			element.current.scrollTo({ top: element.current.scrollHeight });
		}
	}, timeout);
}
