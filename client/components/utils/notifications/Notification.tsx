import { toast, ToastOptions } from 'react-toastify';

interface NotificationI {
	message: string;
	type?: 'info' | 'success' | 'warning' | 'error' | 'default';
	position?: 'top-left' | 'top-right' | 'top-center' | 'bottom-center' | 'bottom-right';
	autoClose?: number;
	hideProgressBar?: boolean;
	closeOnClick?: boolean;
	pauseOnHover?: boolean;
	draggable?: boolean;
	// progress: float from 0 to 1
	theme?: 'light' | 'dark' | 'colored';
}

/**
 * @IUnknown404I Create a toast within ToastWrapper by passed attributes.
 * @param props as Object for ToasterWrapper:
 *  - message: string as toast's text;
	- type?: 'info' | 'success' | 'warning' | 'error' | 'default';
	- position?: 'top-left' | 'top-right' | 'top-center' | 'bottom-center' | 'bottom-right' (by default is 'top-right);
	- autoClose?: number as duration in milliseconds of toast will be on the screen before closing event (by default is 5000);
	- hideProgressBar?: boolean (by default is false);
	- closeOnClick?: boolean (by default is true);
	- pauseOnHover?: boolean (by default is true);
	- draggable?: boolean (by default is true);
 */
export const notification = (props: NotificationI) => {
	const notificationOptions: ToastOptions<{}> | undefined = {
		position: props.position || 'top-right',
		autoClose: props.autoClose || 5000,
		hideProgressBar: props.hideProgressBar || false,
		closeOnClick: props.closeOnClick || true,
		pauseOnHover: props.pauseOnHover || true,
		draggable: props.draggable || true,
		progress: undefined,
		theme: props.theme || 'light',
	};

	switch (props?.type) {
		case 'info': {
			toast.info(props.message, notificationOptions);
			break;
		}
		case 'success': {
			toast.success(props.message, notificationOptions);
			break;
		}
		case 'warning': {
			toast.warn(props.message, notificationOptions);
			break;
		}
		case 'error': {
			toast.error(props.message, notificationOptions);
			break;
		}
		default: {
			toast(props.message, notificationOptions);
			break;
		}
	}
};

/**
 * @IUnknown404I Parser for basic error boundaries.
 * @param error from catch block;
 * @returns A parsed error string for output or an empty string if error ocured or cant be parsed.
 */
export const errorMessage = (error?: any): string | '' => {
	if (!error) return '';
	try {
		const response = error.response;
		const statusCode = error.response?.status || error.statusCode;
		const message = error.response?.data?.message || error.message;
		if (response?.data.message.length)
			return message === 'Incorrect data transmitted!'
				? 'Переданы некорректные данные!'
				: message === 'Internal server error'
				? 'Ошибка взаимодействия с сервером, проверьте введенные данные / подключение и перезагрузите страницу.'
				: message === 'Incorrect token provided!' || message === 'Access token is not set!'
				? 'Предоставлены нерелевантные данные для авторизации!'
				: statusCode === 401 && message === 'Unauthorized'
				? 'Ошибка авторизации и проверки прав доступа к разделу сайта!' // Unauthorized
				: message;
		else
			return statusCode === 401
				? 'Ошибка авторизации и проверки прав доступа к разделу сайта!'
				: 'Ошибка взаимодействия с сервером, проверьте введенные данные!'; //404
	} catch (e) {
		return '';
	}
};
