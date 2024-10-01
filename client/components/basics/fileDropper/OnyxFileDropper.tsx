import FileDownloadIcon from '@mui/icons-material/FileDownload';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { Box, Grid, Stack, useTheme } from '@mui/material';
import Button from '@mui/material/Button';
import React from 'react';
import { useTypedSelector } from '../../../redux/hooks';
import logapp from '../../../utils/logapp';
import { notification } from '../../utils/notifications/Notification';
import { OnyxTypography } from '../OnyxTypography';
import classes from './fileDropper.module.scss';
import { FilesFetch } from './filesFetch';

export type UploadURIType = { uri: string; method: 'POST' | 'PUT' };
export interface OnyxFileDropperI {
	fullwidth?: boolean;
	uploadUri?: UploadURIType;
	submitButtonText?: string;
	changeButtonText?: string;
	maxSizeKb?: number;
	fileType?: 'all' | OnyxFileTypes | OnyxFileTypes[];
	previewImageUrl?: string;
	containerClassName?: string;
	callback?: (file: File) => void;
	onFileDropCallback?: (file: File) => void;
	onUploadEndMerge?: (source: string) => void;
}

/**
 * @IUnknown404I FileDropper component for drag-and-drop or basic choosing the file\files to be sent to the server side according passed config.
 * @description if uploadUri haven't been passed or the uri attribute in uploadUri
 * @param props as a config Object:
    - path: string as path for server-side be processed;
    - callback?: Function that will be fired after onClick event for upload button will be done in .finally() block;
    - onUploadEndMerge?: (source: string) => void as filter-function for processing responce from the server if responce containing string[] data (not FileWithSizes[]);
	- previewImageUrl?: uri for the image to be placed next to the uploaded data's meta information if the preview-img cannot be get from the file;
    - fullwidth?: boolean;
    - containerClassName?: string;
    - fileType?: 'all' | OnyxFileTypes | OnyxFileTypes[];
    - maxSizeKb?: number;
 * @returns a FileDropper JSX.Element.
 */
const OnyxFileDropper = (props: OnyxFileDropperI) => {
	const theme = useTheme();
	const dateFormatter = new Intl.DateTimeFormat('ru', {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: 'numeric',
		minute: 'numeric',
		second: 'numeric',
	});

	const authInstance = useTypedSelector(store => store.axiosInstance.instance);
	const dropRef = React.useRef<HTMLDivElement>(null);
	const inputRef = React.useRef<HTMLInputElement>(null);

	const [file, setFile] = React.useState<File | undefined>(undefined);
	const [preview, setPreview] = React.useState<string | null>('');

	React.useEffect(() => {
		document.addEventListener('dragover', ev => ev.preventDefault());
		document.addEventListener('drop', ev => ev.preventDefault());
	}, []);

	React.useEffect(() => {
		if (!file) return;
		const reader = new FileReader();

		if (props.fileType)
			reader.onloadend = () => {
				try {
					setPreview(
						!!reader.result && typeof reader.result === 'string' && reader.result.includes('data:image/')
							? (reader.result as string)
							: null,
					);
				} catch (error) {
					logapp.log('[!] Unable to read file from OnyxFileDropper on the client!');
					if (preview != null) setPreview(null);
				}
			};
		reader.readAsDataURL(file);
	}, [file]);

	return (
		<Box className={`${props.containerClassName || ''} ${classes.container}`}>
			{file === undefined && (
				<Box className={classes.dropper} ref={dropRef} title='Нажмите для выбора файла'>
					<Box
						className={classes.dropZone}
						onClick={() => {
							inputRef.current?.click();
						}}
						onDrop={e => {
							if (dropRef.current?.classList.contains(classes.wrong))
								dropRef.current?.classList.toggle(classes.wrong);
							if (dropRef.current?.classList.contains(classes.dragover))
								dropRef.current?.classList.toggle(classes.dragover);

							if (fileCheck(e.dataTransfer.files[0])) setFile(e.dataTransfer.files[0]);
						}}
						onDragOver={ev => {
							if (
								ev.dataTransfer.files[0] &&
								!fileCheck(ev.dataTransfer.files[0]) &&
								!dropRef.current?.classList.contains(classes.wrong)
							)
								dropRef.current?.classList.toggle(classes.wrong);
							if (!dropRef.current?.classList.contains(classes.dragover))
								dropRef.current?.classList.toggle(classes.dragover);
						}}
						onDragLeave={ev => {
							if (dropRef.current?.classList.contains(classes.wrong))
								dropRef.current?.classList.toggle(classes.wrong);
							if (dropRef.current?.classList.contains(classes.dragover))
								dropRef.current?.classList.toggle(classes.dragover);
						}}
					/>

					<OnyxTypography tpAlign='center' tpSize='1.25em'>
						<FileDownloadIcon />
						<br />
						Перенесите сюда файл
						<br />
						или нажмите для ручного выбора
					</OnyxTypography>
					<OnyxTypography component='span' tpAlign='center' tpSize='1.25em'>
						<UploadFileIcon />
						<br />
						Обнаружен файл!
					</OnyxTypography>
				</Box>
			)}

			<input
				hidden
				type='file'
				role='button'
				alt='file-input'
				ref={inputRef}
				accept={
					!!props.fileType
						? props.fileType === 'all'
							? allOnyxFileTypes.join(', ')
							: Array.isArray(props.fileType)
							? props.fileType.join(', ')
							: props.fileType
						: 'image/webp, video/webm, application/pdf, image/svg+xml, application/vnd.openxmlformats-officedocument.wordprocessingml.document'
				}
				multiple
				name='files'
				onChange={event => {
					if (fileCheck(event?.currentTarget?.files?.length ? event?.currentTarget?.files[0] : undefined))
						setFile(event?.currentTarget?.files?.length ? event?.currentTarget?.files[0] : undefined);
				}}
			/>

			{file !== undefined && (
				<Grid container fontSize='1.25rem' rowGap={1}>
					<Grid item lg={6} md={12} sx={{ textAlign: 'center', marginInline: 'auto' }}>
						<Stack
							sx={{
								position: 'relative',
								width: '100%',
								overflow: 'hidden',
							}}
						>
							<img
								src={preview ?? props.previewImageUrl ?? '/images/courses/sections/fileicon.png'}
								alt='Preview'
								style={{
									marginInline: 'auto',
									minWidth: 'min(25%, 200px)',
									maxWidth: 'min(85%, 600px)',
									filter: !preview && !props.previewImageUrl ? 'opacity(0.5)' : undefined,
								}}
							/>
							{!preview && !props.previewImageUrl && (
								<OnyxTypography
									text='Предпросмотр недоступен'
									tpColor='primary'
									tpSize='1rem'
									tpWeight='bold'
									sx={{
										position: 'absolute',
										opacity: '.75',
										top: '50%',
										left: '50%',
										textAlign: 'center',
										transform: 'translate(-50%, -50%)',
									}}
								/>
							)}
						</Stack>
					</Grid>

					<Grid item lg={6} md={12}>
						<Stack direction='column'>
							<OnyxTypography>
								<strong>Полное имя файла:</strong>&nbsp; {file?.name}
							</OnyxTypography>
							<OnyxTypography
								sx={{ '> span': { color: theme.palette.mode === 'light' ? 'darkblue' : '#ef95ff' } }}
							>
								<strong>Расширение файла:</strong>&nbsp;
								<span>{file?.type}</span>
							</OnyxTypography>
							<OnyxTypography
								sx={{ '> span': { color: theme.palette.mode === 'light' ? 'darkblue' : '#ef95ff' } }}
							>
								<strong>Размер файла:</strong>&nbsp;
								<span>
									{file?.size
										? file?.size / 1024 ** 2 > 1
											? `${(file?.size / 1024 ** 2).toFixed(1)}Мб`
											: `${(file?.size / 1024).toFixed(1)}Кб`
										: 'не указан файл'}
								</span>
							</OnyxTypography>
							<OnyxTypography>
								<strong>Последнее изменение:</strong>&nbsp;
								{dateFormatter.format(new Date(file?.lastModified))}
							</OnyxTypography>

							{file !== undefined && (
								<Stack
									marginTop='1rem'
									paddingBottom='.5rem'
									flexDirection='column'
									justifyContent='flex-end'
									gap={1}
									flexGrow={1}
								>
									<Button
										fullWidth
										color='success'
										variant='contained'
										onClick={() => {
											handleUpload().finally(() => {
												console.log('[!!!] OnyxFileDroppper handleUpload - FINAL block fired.');
												if (props.callback) props.callback(file);
											});
										}}
									>
										{props.submitButtonText || 'Загрузить'}
									</Button>
									<Button
										fullWidth
										variant='outlined'
										onClick={() => {
											if (!!props.onFileDropCallback) props.onFileDropCallback(file);
											setFile(undefined);
										}}
									>
										{props.changeButtonText || 'Выбрать другой'}
									</Button>
								</Stack>
							)}
						</Stack>
					</Grid>
				</Grid>
			)}
		</Box>
	);

	async function handleUpload() {
		if (!!props.uploadUri) {
			if (!props.uploadUri?.uri)
				notification({
					message: `${!!props.uploadUri ? 'Указан некорректный' : 'Не указан'} url для отправки файла!`,
					type: 'error',
				});
			else if (file instanceof File && !Array.isArray(file)) {
				await FilesFetch.uploadFile({ axiosInstance: authInstance, uploadUri: props.uploadUri, file })
					// .then(response => {
					// 	if (typeof response === 'string' && props.onUploadEndMerge) props.onUploadEndMerge(response);
					// 	notification({
					// 		message: 'Файл успешно загружен!',
					// 		type: 'success',
					// 	});
					// })
					// .catch(() =>
					// 	notification({
					// 		message:
					// 			'Не удалось загрузить файл! Попробуйте перезагрузить страницу и попробовать снова.',
					// 		type: 'error',
					// 	}),
					// );
			}
		}
	}

	function fileCheck(file: File | undefined | null): boolean {
		// file instance check
		if (!file || !(file instanceof File)) return false;

		// file size edge case check
		if (isNaN(file.size)) {
			notification({
				type: 'error',
				message: 'Указанный файл не прошёл фильтрацию!',
				autoClose: 5000,
			});
			return false;
		}
		// file size check
		if (file.size >= (props.maxSizeKb != undefined ? props.maxSizeKb * 1024 : 10 * 1024 * 1024)) {
			notification({
				type: 'error',
				message: 'Размер файла превышает ограничения!',
				autoClose: 5000,
			});
			return false;
		}

		// file type check
		if (
			file.type === undefined ||
			file.type.trim() === '' ||
			(!!props.fileType
				? props.fileType === 'all'
					? !allOnyxFileTypes.includes(file.type as OnyxFileTypes)
					: !props.fileType.includes(file.type as OnyxFileTypes)
				: ![
						'image/webp',
						'video/webm',
						'application/pdf',
						'image/svg+xml',
						'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
				  ].includes(file.type))
		) {
			// check for zip allias (all counts as valid)
			if (
				(props.fileType === 'application/zip' ||
					(Array.isArray(props.fileType) && props.fileType.includes('application/zip'))) &&
				(file.type === 'application/x-zip' ||
					file.type === 'application/x-zip-compressed' ||
					file.type === 'multipart/x-zip')
			)
				return true;

			// throws an error message and return false
			notification({
				type: 'error',
				message: 'Расширение выбранного файла не соответствует критериям!' + ' <--> ' + file.type.trim(),
				autoClose: 5000,
			});
			return false;
		} else return true;
	}
};

export default OnyxFileDropper;

export type OnyxFileTypes =
	// images
	| 'image/jpeg'
	| 'image/png'
	| 'image/webp'
	| 'image/svg+xml'
	// videos
	| 'video/webm'
	| 'video/mp4'
	// zip
	| 'application/zip' // application/octet-stream and multipart/x-zip
	// docs
	| 'application/pdf'
	// word
	| 'application/msword' // doc
	| 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' // docx
	| 'application/vnd.ms-word.document.macroEnabled.12' // docm
	// powerpoint
	| 'application/vnd.ms-powerpoint' //ppt
	| 'application/vnd.openxmlformats-officedocument.presentationml.presentation' //pptx
	| 'application/vnd.ms-powerpoint.presentation.macroEnabled.12' //pptm
	// excel
	| 'text/csv' // csv
	| 'application/vnd.ms-excel' // xls
	| 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' // xlsx
	| 'application/vnd.ms-excel.sheet.macroEnabled.12'; // xlsm

var allOnyxFileTypes: OnyxFileTypes[] = [
	'image/jpeg',
	'image/png',
	'image/webp',
	'image/svg+xml',
	'video/webm',
	'video/mp4',
	'application/zip',
	'application/pdf',
	'application/msword',
	'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
	'application/vnd.ms-word.document.macroEnabled.12',
	'application/vnd.ms-powerpoint',
	'application/vnd.openxmlformats-officedocument.presentationml.presentation',
	'application/vnd.ms-powerpoint.presentation.macroEnabled.12',
	'text/csv',
	'application/vnd.ms-excel',
	'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
	'application/vnd.ms-excel.sheet.macroEnabled.12',
];
