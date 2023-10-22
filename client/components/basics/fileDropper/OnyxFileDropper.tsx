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

export type OnyxFileTypes =
	| 'image/webp'
	| 'image/svg+xml'
	| 'image/png'
	| 'image/jpeg'
	| 'video/webm'
	| 'video/mp4'
	| 'application/pdf'
	| 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
export type UploadURIType = { uri: string; method: 'POST' | 'PUT' };
export interface OnyxFileDropperI {
	uploadUri: UploadURIType;
	callback?: Function;
	onUploadEndMerge?: (source: string) => void;
	fullwidth?: boolean;
	containerClassName?: string;
	fileType?: OnyxFileTypes | OnyxFileTypes[];
	maxSizeKb?: number;
}

/**
 * @IUnknown404I FileDropper component for drag-and-drop or basic choosing the file\files to be sent to the server side according passed config.
 * @param props as a config Object:
    - path: string as path for server-side be processed;
    - callback?: Function that will be fired after onClick event for upload button will be done in .finally() block;
    - onUploadEndMerge?: (source: string) => void as filter-function for processing responce from the server if responce containing string[] data (not FileWithSizes[]);
    - fullwidth?: boolean;
    - containerClassName?: string;
    - fileType?: OnyxFileTypes | OnyxFileTypes[];
    - maxSizeKb?: number;
 * @returns a FileDropper component.
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

		reader.onloadend = () => {
			try {
				setPreview(reader.result as string | null);
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
				ref={inputRef}
				type='file'
				accept={
					props.fileType
						? Array.isArray(props.fileType)
							? props.fileType.toString().replaceAll(',', ', ')
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
					<Grid item lg={6} md={12} sx={{ textAlign: 'center' }}>
						<img src={preview || ''} alt='Preview' style={{ maxWidth: 'min(90%, 700px)' }} />
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
										variant='contained'
										onClick={() => {
											handleUpload().finally(() => {
												if (props.callback) props.callback();
											});
										}}
									>
										Загрузить
									</Button>
									<Button
										fullWidth
										variant='outlined'
										onClick={() => {
											setFile(undefined);
										}}
									>
										Выбрать другой
									</Button>
								</Stack>
							)}
						</Stack>
					</Grid>

					{file !== undefined && (
						<Grid item lg={0} md={12} sx={{ display: { xs: '', lg: 'none' } }}>
							{file !== undefined && (
								<Box
									sx={{
										display: 'flex',
										flexDirection: 'row',
										gap: '1.25rem',
										width: '100%',
										marginTop: '1rem',
									}}
								>
									<Button
										fullWidth
										variant='contained'
										onClick={() => {
											handleUpload().finally(() => {
												if (props.callback) props.callback();
											});
										}}
									>
										Загрузить
									</Button>
									<Button
										sx={{ paddingInline: '1.25rem', minWidth: '220px' }}
										variant='outlined'
										onClick={() => {
											setFile(undefined);
										}}
									>
										Выбрать другой
									</Button>
								</Box>
							)}
						</Grid>
					)}
				</Grid>
			)}
		</Box>
	);

	async function handleUpload() {
		if (file instanceof File && !Array.isArray(file)) {
			await FilesFetch.uploadFile({ axiosInstance: authInstance, uploadUri: props.uploadUri, file })
				.then(res => {
					if (typeof res === 'string' && props.onUploadEndMerge) props.onUploadEndMerge(res);
					notification({
						message:
							'Файл успешно загружен!',
						type: 'success',
					});
				})
				.catch(() =>
					notification({
						message:
							'Не удалось загрузить файл! Попробуйте перезагрузить страницу и попробовать снова.',
						type: 'error',
					}),
				);
		}
	}

	function fileCheck(file: File | undefined | null): boolean {
		if (!file || !(file instanceof File)) return false;
		if (file.size >= (props.maxSizeKb != undefined ? props.maxSizeKb * 1024 : 10 * 1024 * 1024)) {
			notification({
				type: 'error',
				message: 'Размер файла превышает ограничения!',
				autoClose: 5000,
			});
			return false;
		}
		if (isNaN(file.size)) {
			notification({
				type: 'error',
				message: 'Указанный файл не прошёл фильтрацию!',
				autoClose: 5000,
			});
			return false;
		}
		if (
			file.type === undefined ||
			file.type.trim() === '' ||
			(props.fileType !== undefined && props.fileType
				? !props.fileType.includes(file.type as OnyxFileTypes)
				: ![
						'image/webp',
						'video/webm',
						'application/pdf',
						'image/svg+xml',
						'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
				  ].includes(file.type))
		) {
			notification({
				type: 'error',
				message: 'Расширение выбранного файла не соответствует критериям!',
				autoClose: 5000,
			});
			return false;
		} else return true;
	}
};

export default OnyxFileDropper;
