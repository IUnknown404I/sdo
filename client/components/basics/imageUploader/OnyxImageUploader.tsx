import DownloadDoneIcon from '@mui/icons-material/DownloadDone';
import SimCardAlertIcon from '@mui/icons-material/SimCardAlert';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import { Box, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import Pagination from '@mui/material/Pagination';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import React from 'react';
import ModernLoader from '../../utils/loaders/ModernLoader';
import { notification } from '../../utils/notifications/Notification';
import OnyxAlertConfirmDialog from '../OnyxAlertConfirmDialog';
import OnyxAlertModal from '../OnyxAlertModal';
import { OnyxTypography } from '../OnyxTypography';
import OnyxFileDropper, { OnyxFileTypes, UploadURIType } from '../fileDropper/OnyxFileDropper';
import { default as modal } from './imageUploader.module.scss';

export type FileUploadBaseType = {
	url: string;
	size?: number;
};
type QueryEndpointDataT<T extends FileUploadBaseType> = {
	currentData: T[] | undefined;
	isLoading: boolean;
	isError: boolean;
	refetch: () => void;
};
interface OnyxImgUploaderI<T extends FileUploadBaseType> {
	url: {
		get: QueryEndpointDataT<T>;
		create: UploadURIType;
	};
	image?: string;
	setImage: (localImage: string) => void;
	state: boolean;
	setState: React.Dispatch<React.SetStateAction<boolean>>;
	showFileNames?: boolean;
	showFileSizes?: boolean;
	urlSplitter?: string;
	sortingAlgoritm?: (url1: string, url2: string) => number;
	displayMode?: 'big' | 'small';
	fileTypes?: OnyxFileTypes | OnyxFileTypes[];
	maxSizeKb?: number;
	modalClassName?: string;
	downloadModalInitialState?: boolean;
	dropZoneClassName?: string;
	disableControls?: boolean;
	callback?: Function;
	onUploadEndMerge?: Function;
	onUploadEnd?: Function;
}

/**
 * @IUnknown404I
 * @param props as an complex config-Object:
 	- url: string | { get: string; post: string };
	- image?: string;
	- setImage: (localImage: string) => void;
	- state: boolean;
	- setState: React.Dispatch<React.SetStateAction<boolean>>;
	- showFileNames?: boolean;
	- showFileSizes?: boolean;
	- urlSplitter?: string;
	- sortingAlgoritm?: (url1: string, url2: string) => number;
	- displayMode?: 'big' | 'small';
	- fileTypes?: OnyxFileTypes | OnyxFileTypes[];
	- maxSizeKb?: number;
	- modalClassName?: string;
	- downloadModalInitialState?: boolean;
	- dropZoneClassName?: string;
	- disableControls?: boolean;
	- callback?: Function;
	- onUploadEndMerge?: Function;
	- onUploadEnd?: Function;
 * @returns complex JSX.Element for uploading and visualizing images from the api.
 */
const OnyxImgUploader = <T extends FileUploadBaseType>(props: OnyxImgUploaderI<T>): JSX.Element => {
	const { currentData, isLoading: isFetching, isError, refetch } = props.url.get;
	const [avatars, setAvatars] = React.useState<T[]>(currentData || []);
	const elementsOnPageCount = props.displayMode === undefined ? 10 : props.displayMode === 'big' ? 8 : 20;
	const [previewImg, setPreviewImg] = React.useState<string>('');
	const [currentPage, setCurrentPage] = React.useState<number>(1);
	const [localImg, setLocalImg] = React.useState<string>(props.image || '');
	const [uploadModal, setUploadModal] = React.useState<boolean>(props.downloadModalInitialState || false);
	const [dialogState, setDialogState] = React.useState<{ state: boolean; url: string }>({ state: false, url: '' });

	React.useEffect(() => {
		// any actions after fetching complete
		if (isError && isFetching)
			notification({
				message: 'Не удалось получить изображения с сервера! Перезагрузите страницу или попробуйте позже.',
				autoClose: 6500,
				type: 'warning',
			});
	}, [isFetching]);

	React.useEffect(() => {
		if (!!props.image && props.image !== localImg) setLocalImg(props.image);
	}, [props.image]);

	React.useEffect(() => {
		// current page check (auto-select the page on which presented current avatar (if not empty))
		if (!localImg || !props.state) return;
		const indexOfLocalImg = avatars.reduce(
			(flag, cur, index) =>
				compareFileNames(cur.url, localImg, props.urlSplitter) ? index + 1 : flag !== -1 ? flag : -1,
			-1,
		);
		setCurrentPage(indexOfLocalImg && indexOfLocalImg > 0 ? Math.ceil(indexOfLocalImg / elementsOnPageCount) : 1);
	}, [props.state]);

	React.useEffect(() => {
		// sorting data if sorting func passed
		if (!currentData?.length) return;
		const sortedAvatars =
			[...currentData].sort((a, b) =>
				props.sortingAlgoritm ? props.sortingAlgoritm(a.url, b.url) : a.url.localeCompare(b.url),
			) || [];
		setAvatars(() => sortedAvatars);
	}, [currentData]);

	return (
		<OnyxAlertModal
			keepMounted={false}
			title='Выбор изображения из БД'
			state={props.state}
			setState={props.setState}
			disableButton
			hideFooter
		>
			{isFetching ? (
				<Stack
					flexDirection='row'
					alignItems='center'
					justifyContent='center'
					sx={{
						width: '100%',
						gap: '1.5rem',
					}}
				>
					<ModernLoader /> <ModernLoader /> <ModernLoader />
				</Stack>
			) : (
				<>
					{currentData != null && currentData.length ? (
						<OnyxTypography
							tpColor='secondary'
							tpSize='1rem'
							text={`Всего изображений в базе: ${currentData.length}`}
						/>
					) : (
						<span />
					)}

					<Box
						className={`
                        ${props.modalClassName || ''} 
                        ${
							props.displayMode === 'big' || !props.displayMode
								? modal.postersPhoto
								: modal.iconsContainer
						} 
                        ${modal.imgGridBig}
                    `}
					>
						{getPageElements().map((element, index) => {
							return (
								<Box key={element.url + index} className={modal.imgContainer}>
									{props.showFileNames && props.showFileSizes && (
										<Box className={modal.fileDescriptionContainer}>
											<FileNameSideText url={element.url} />
											<FileSizeSideText size={element.size} />
										</Box>
									)}
									{props.showFileNames && !props.showFileSizes && (
										<FileNameSideText
											url={element.url}
											styles={{ width: '100%', textAlign: 'left', paddingLeft: '.5rem' }}
										/>
									)}
									{props.showFileSizes && !props.showFileNames && (
										<FileSizeSideText
											size={element.size}
											styles={{ width: '100%', textAlign: 'right', paddingRight: '.5rem' }}
										/>
									)}

									<img
										className={
											compareFileNames(localImg, element.url, props.urlSplitter)
												? modal.currentPickImage
												: ''
										}
										src={element.url}
										alt={`Изображение: ${element.url}`}
										onClick={
											props.disableControls != null
												? () => {
														if (!compareFileNames(localImg, element.url, props.urlSplitter))
															setLocalImg(element.url);
												  }
												: undefined
										}
									/>

									{props.disableControls == null && (
										<Box className={modal.imgControls}>
											<Box
												title='Увеличить'
												onClick={() => {
													setPreviewImg(element.url);
												}}
											>
												<ZoomInIcon />
											</Box>
											<Box
												title={element.url !== localImg ? 'Выбрать' : 'Уже выбрано'}
												className={
													compareFileNames(localImg, element.url, props.urlSplitter)
														? modal.disabledImage
														: ''
												}
												onClick={() => {
													if (!compareFileNames(localImg, element.url, props.urlSplitter))
														setLocalImg(element.url);
												}}
											>
												<DownloadDoneIcon />
											</Box>
											{/* {(authData.userPrivileges === 'admin' || authData.userPrivileges === 'superuser') &&
                                            <Box
                                                className={compareFileNames(props.image, url) ? modal.disabledImage : ''} 
                                                title={compareFileNames(props.image, url) ? 'Привязанное изображение' : 'Удалить'}
                                                onClick={() => {
                                                    if (!compareFileNames(props.image, url)) setDialogState({state: true, url: url})
                                                }}
                                            >
                                                <DeleteForeverIcon/>
                                            </Box>
                                        } */}
										</Box>
									)}
								</Box>
							);
						})}
					</Box>

					{currentData == null || currentData?.length == null ? (
						<span />
					) : (
						<Stack
							spacing={5}
							justifyContent='center'
							alignItems='center'
							sx={{
								width: '100%',
								margin: '.75rem 0 1rem',
								marginBottom: '1.25rem',
							}}
						>
							<Pagination
								page={currentPage}
								className='pagination'
								count={Math.ceil(currentData.length / elementsOnPageCount)}
								showFirstButton
								showLastButton
								variant='outlined'
								shape='rounded'
								onChange={handlePaginationChange}
							/>
						</Stack>
					)}

					<Stack direction='row' width='100%' gap={2}>
						<Button
							fullWidth
							variant='contained'
							disabled={compareFileNames(props.image || 'x_q_z', localImg, props.urlSplitter)}
							title={
								props.image === localImg
									? 'Выбранное изображение уже привязано.'
									: 'Использовать выбранное изображение.'
							}
							onClick={() => {
								props.setImage(localImg);
								props.setState(false);
							}}
						>
							Зафиксировать выбранное изображение
						</Button>
						<Button
							variant='outlined'
							sx={{ paddingInline: '1.25rem', minWidth: '300px' }}
							onClick={() => {
								setUploadModal(true);
							}}
						>
							Загрузить файл
						</Button>
					</Stack>
				</>
			)}

			<OnyxAlertModal
				title='Загрузить изображение'
				state={uploadModal}
				setState={setUploadModal}
				hideFooter
			>
				<OnyxFileDropper
					fullwidth
					containerClassName={props.dropZoneClassName}
					uploadUri={props.url.create}
					fileType={props.fileTypes || ['image/webp', 'image/svg+xml']}
					maxSizeKb={props.maxSizeKb ? props.maxSizeKb : 5 * 1024}
					callback={() => {
						if (props.onUploadEnd) props.onUploadEnd();
						setUploadModal(false);
					}}
					onUploadEndMerge={(uploadedUrl: string) => {
						refetch();
					}}
				/>
				<Paper
					sx={{
						textAlign: 'center',
						padding: '.5rem 1rem',
						display: 'flex',
						flexDirection: 'row',
						width: '100%',
						gap: '.5rem',
						alignItems: 'center',
						justifyContent: 'center',
						border: '1px solid darkorange',
						svg: {
							color: 'darkorange',
							fontSize: '1.75rem',
						},
					}}
				>
					<SimCardAlertIcon />
					<OnyxTypography component='span' tpSize='1.1rem' tpAlign='center'>
						Вы можете загрузить изображения&nbsp;
						<OnyxTypography component='b' tpWeight='bold'>
							в формате&nbsp;
							{props.fileTypes
								? props.fileTypes instanceof Array
									? props.fileTypes.length === 2
										? `.${props.fileTypes[0].slice(
												props.fileTypes[0].indexOf('/') + 1,
										  )} и ${props.fileTypes[1].slice(props.fileTypes[1].indexOf('/') + 1)}`
										: props.fileTypes.reduce(
												(accum, type, index) =>
													accum +
													(index === 0
														? `.${type.slice(type.indexOf('/') + 1)}`
														: index !== props.fileTypes!.length - 1
														? `, .${type.slice(type.indexOf('/') + 1)}`
														: ` или .${type.slice(type.indexOf('/') + 1)}`),
												'',
										  )
									: props.fileTypes
								: '.webp и .svg'}
						</OnyxTypography>
						,&nbsp;
						<OnyxTypography component='b' tpWeight='bold'>
							не превышающие&nbsp;
							{props.maxSizeKb
								? props.maxSizeKb / 1024 > 1
									? `${props.maxSizeKb / 1024}Мб`
									: `${props.maxSizeKb}Кб`
								: '5Мб'}
						</OnyxTypography>
						!
					</OnyxTypography>
				</Paper>
			</OnyxAlertModal>

			<OnyxAlertConfirmDialog
				open={dialogState.state}
				onClose={(res: true | undefined) => {
					// deleteDialogConfirmation(res, dialogState.url);
					setDialogState({ state: false, url: '' });
				}}
				text={
					<Typography component='span'>
						Вы собираетесь удалить изображение из базы данных!
						<b>Результат данной операции будет невозможно восстановить.</b> Выполнить удаление?
					</Typography>
				}
			/>

			{/* {previewImg != null && (
				<Lightbox
					image={previewImg}
					onClose={() => {
						setPreviewImg('');
					}}
					// doubleClickZoom={0}
				/>
			)} */}
		</OnyxAlertModal>
	);

	function handlePaginationChange(event: React.ChangeEvent<unknown>, value: number) {
		setCurrentPage(value);
	}

	function getPageElements() {
		return avatars.slice((currentPage - 1) * elementsOnPageCount, currentPage * elementsOnPageCount) || [];
	}

	// function deleteDialogConfirmation(res: true | undefined, url: string) {
	// 	if (!res || !url) return;

	// 	FilesFetch.deleteFile(authInstance, url.split('path=')[1]).then(res => {
	// 		if (res) {
	// 			notification({
	// 				type: 'success',
	// 				message: 'Удаление успешно завершено!',
	// 			});
	// 			refetch();
	// 		}
	// 	});
	// }
};

export function FileNameSideText(props: { url: string; styles?: React.CSSProperties }) {
	return (
		<span className={modal.imgContainerName} style={props.styles}>
			файл:&nbsp;
			<strong>
				{props.url.slice(
					props.url.lastIndexOf('/') + 1,
					props.url.lastIndexOf('-') < props.url.lastIndexOf('/')
						? props.url.lastIndexOf('.')
						: props.url.lastIndexOf('-'),
				)}
			</strong>
		</span>
	);
}

export function FileSizeSideText(props: { size?: number; styles?: React.CSSProperties }) {
	return (
		<span className={modal.imgContainerName} style={props.styles}>
			размер:&nbsp;
			<strong>
				{props.size == null
					? 'NaN'
					: props.size / 1024 ** 2 > 1
					? (props.size / 1024 ** 2).toFixed(2) + ' Мб'
					: props.size / 1024 > 1
					? `${Math.round(props.size / 1024)} Кб`
					: `${Math.round(props.size)} байт`}
			</strong>
		</span>
	);
}

function compareFileNames(name1: string, name2: string, urlSplitter?: string): boolean {
	if (typeof name1 === 'undefined' || typeof name2 === 'undefined') return false;

	const validName1 =
		name1.lastIndexOf(urlSplitter || '/') === -1
			? name1
			: name1.slice(
					name1.lastIndexOf(urlSplitter || '/') +
						(name1.indexOf(urlSplitter || '/') ? urlSplitter?.length || 1 : 1),
			  );
	const validName2 =
		name2.lastIndexOf(urlSplitter || '/') === -1
			? name2
			: name2.slice(
					name2.lastIndexOf(urlSplitter || '/') +
						(name2.indexOf(urlSplitter || '/') ? urlSplitter?.length || 1 : 1),
			  );
	return validName1 === validName2;
}

export default OnyxImgUploader;
