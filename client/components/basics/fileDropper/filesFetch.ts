import { AxiosInstance, AxiosResponse } from 'axios';
import { OnyxApiErrorResponseType } from '../../../redux/api';
import { notification } from '../../utils/notifications/Notification';
import { UploadURIType } from './OnyxFileDropper';

export type FileWithSizeT = { url: string; size: number };
export type RequestProps = {
	axiosInstance: AxiosInstance;
	path: string;
	disableNotifications?: boolean;
	metadata?: boolean;
};

/**
 * @IUnknown404I
 * Class-helper for getting, creating, updating and deleting any files on and from the api.
 */
export class FilesFetch {
	/**
	 * @IUnknown404I Method for getting all files from the special directory on the server.
	 * @param axiosInstance - axiosInstance with preconfigured secure-headers;
	 * @param path - string as path to directory on the server to be processed;
	 * @param disableNotifications - boolean that disables all toasts for this method;
	 * @param metadata - boolean key for metadata request (sizes, dates and etc.);
	 * @returns Promise with string[] or FileWithSizeT[] depending on the passed metadata key.
	 */
	public static async getAllFilenames(
		payload: Omit<RequestProps, 'metadata'> & { metadata?: false },
	): Promise<string[]>;
	public static async getAllFilenames(
		payload: Omit<RequestProps, 'metadata'> & { metadata: true },
	): Promise<FileWithSizeT[]>;
	public static async getAllFilenames(payload: RequestProps): Promise<FileWithSizeT[] | string[]> {
		let filenames: string[] | FileWithSizeT[] = [];

		await payload.axiosInstance
			.get(
				`${process.env.NEXT_PUBLIC_SERVER}/files/all-files?path=${payload.path}&directory=true${
					payload.metadata ? '&extended=true' : ''
				}`,
			)
			.then(res => {
				filenames = payload.metadata ? (res.data as FileWithSizeT[]) : (res.data as string[]);
			})
			.catch(() => {
				if (payload.disableNotifications == null)
					notification({
						type: 'error',
						message: 'Не удалось получить контент с сервера!',
						autoClose: 5000,
					});
			});
		return filenames;
	}

	public static uploadFile = async (props: {
		axiosInstance: AxiosInstance;
		uploadUri: UploadURIType;
		file: File;
		disableNotifications?: boolean;
	}): Promise<false | string> => {
		let result: false | string = false;

		await sendRequest()
			.then(response => {
				if (typeof response === 'object' && 'error' in response)
					notification({
						message: (response.error as OnyxApiErrorResponseType).data?.message,
						type: 'error',
					});
				else {
					result = response.data as string;
					if (!props.disableNotifications)
						notification({
							type: 'success',
							message: 'Файл успешно загружен на сервер!',
							autoClose: 5000,
						});
				}
			})
			.catch(err => {
				if (!props.disableNotifications)
					notification({
						type: 'error',
						message:
							err?.response.data?.message === 'Incorrect data transmitted!'
								? 'Неверный тип передаваемых данных!'
								: err?.response.data?.message === 'File too large'
								? 'Размер передаваемых данных превышает ограничения!'
								: (err?.response.data?.message && !err.response.data.message.includes('Cannot')
										? err.response.data.message
										: undefined) ?? 'Не удалось выгрузить файл! Проверьте вводные!',
					});
			});
		return result;

		async function sendRequest(): Promise<AxiosResponse<any, any>> {
			return props.axiosInstance[props.uploadUri.method === 'POST' ? 'post' : 'put'](
				`${process.env.NEXT_PUBLIC_SERVER}/${
					props.uploadUri.uri.startsWith('/') ? props.uploadUri.uri.slice(1) : props.uploadUri.uri
				}`,
				{ file: props.file },
				{
					headers: {
						'Content-type': 'multipart/form-data',
					},
				},
			);
		}
	};

	public static deleteFile = async (
		axiosInstance: AxiosInstance,
		path: string,
		disableNotifications: boolean = false,
	): Promise<boolean> => {
		let deleteResult: boolean = true;

		await axiosInstance.delete(`${process.env.NEXT_PUBLIC_SERVER}/files?path=${path}`).catch(() => {
			deleteResult = false;
			if (!disableNotifications)
				notification({
					type: 'error',
					message: 'Не удалось удалить постер! Перезагрузите страницу или попробуйте позже.',
				});
		});
		return deleteResult;
	};

	/**
	 * @IUnknown404I Send GET-Request for all avaible defaults avatars on the server.
	 * @param payload as RequestProps without url\path property. Still auth required.
	 * @returns all images in string[] or FileWithSizeT[] if metadata property passed.
	 */
	public static async getDefaultAvatars(
		payload: Omit<RequestProps, 'path'> & { metadata?: false },
	): Promise<string[]>;
	public static async getDefaultAvatars(
		payload: Omit<RequestProps, 'path'> & { metadata: true },
	): Promise<FileWithSizeT[]>;
	public static async getDefaultAvatars(payload: Omit<RequestProps, 'path'>): Promise<FileWithSizeT[] | string[]> {
		let filenames: string[] | FileWithSizeT[] = [];

		await payload.axiosInstance
			.get(
				`${process.env.NEXT_PUBLIC_SERVER}/files/users/avatars/defaults/all${
					payload.metadata ? '?extended=true' : ''
				}`,
			)
			.then(res => {
				filenames = payload.metadata ? (res.data as FileWithSizeT[]) : (res.data as string[]);
			})
			.catch(() => {
				if (payload.disableNotifications == null)
					notification({
						type: 'error',
						message: 'Не удалось получить контент с сервера!',
						autoClose: 5000,
					});
			});
		return filenames;
	}
}
