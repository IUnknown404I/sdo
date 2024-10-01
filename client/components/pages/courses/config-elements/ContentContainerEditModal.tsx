import { Box, Button, Divider, Stack, TextField, useTheme } from '@mui/material';
import React, { ComponentProps } from 'react';
import { useDebouncedState } from '../../../../hooks/useDebouncedState';
import { COROPRATIVE_COLOR_DARK, COROPRATIVE_COLOR_LIGHT } from '../../../../theme/ThemeOptions';
import OnyxAlertModal from '../../../basics/OnyxAlertModal';
import OnyxSelect from '../../../basics/OnyxSelect';
import OnyxSwitch from '../../../basics/OnyxSwitch';
import { OnyxTypography } from '../../../basics/OnyxTypography';
import SectionContentContainer from '../section-elements/SectionContentContainer/SectionContentContainer';

export interface ContentContainerEditParams {
	hide: boolean;
	styles: {
		centered: boolean;
		elevation: number;
		borderWidth: number;
		borderColor: string;
		borderStyle: string;
	};
}

interface IContentContainerEditModal extends ComponentProps<typeof SectionContentContainer> {
	rowMode?: boolean;
	modalState: boolean;
	setModalState: React.Dispatch<React.SetStateAction<boolean>>;
	onSubmitCallback?: (payload: ContentContainerEditParams) => void;
	onCancelCallback?: () => void;
}

const ContentContainerEditModal = (props: IContentContainerEditModal) => {
	const theme = useTheme();
	const colorInputRef = React.useRef<HTMLInputElement>(null);

	const [status, setStatus] = React.useState<boolean>(!props.hide ?? true);
	const [centered, setCentered] = React.useState<boolean>(props.styles?.centered ?? false);
	const [elevation, setElevation] = React.useState<number>(props.styles?.elevation || 0);
	const [borderWidth, setBorderWidth] = React.useState<number>(props.styles?.borderWidth || 0);
	const [borderColor, setBorderColor] = useDebouncedState<string>(
		props.styles?.borderColor ||
			(theme.palette.mode === 'light' ? COROPRATIVE_COLOR_LIGHT : COROPRATIVE_COLOR_DARK),
		250,
	);
	const [borderStyle, setBorderStyle] = React.useState<string>(props.styles?.borderStyle || 'solid');

	function handleSubmit() {
		if (!!props.onSubmitCallback)
			props.onSubmitCallback({
				hide: status,
				styles: { centered, elevation, borderWidth, borderColor, borderStyle },
			});
		props.setModalState(false);
	}

	function handleCancel() {
		if (!!props.onCancelCallback) props.onCancelCallback();
		props.setModalState(false);
	}

	function handleElevationChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
		const newValue = parseInt(e.target.value);
		if (newValue < 0) setElevation(0);
		else if (newValue > 24) setElevation(24);
		else setElevation(newValue);
	}

	return (
		<OnyxAlertModal
			uncontrolled
			width='800px'
			title='Редактирование контейнера'
			state={props.modalState}
			setState={props.setModalState}
			disableButton
			disableCloseButton
		>
			<Stack direction='column' gap={2} width='100%'>
				<OnyxTypography
					text='При изменении параметров компонента они сразу показываются снизу, чтобы вы заранее видели изменения. Для сохранения результата нажмите на кнопку "Сохранить изменения".'
					tpColor='secondary'
					tpSize='.85rem'
				/>
				<Divider sx={{ margin: '0 auto', width: '100%' }} />

				<Stack direction='row' justifyContent='space-between' alignItems='center' gap={2.5}>
					<Stack sx={{ width: '50%' }}>
						<OnyxTypography text='Высота контейнера:' tpColor='secondary' tpSize='.85rem' />
						<TextField
							value={elevation}
							onChange={handleElevationChange}
							size='small'
							type='number'
							variant='outlined'
						/>
					</Stack>
					<Stack sx={{ width: '100%' }}>
						<OnyxTypography text='Выравнивание содержимого:' tpColor='secondary' tpSize='.85rem' />
						<OnyxSwitch
							label={!centered ? 'Стандартное отображение' : 'Форматирование по центру'}
							state={centered}
							setState={setCentered}
							size='medium'
							labelPlacement='end'
						/>
					</Stack>
					<Stack sx={{ width: '100%' }}>
						<OnyxTypography text='Видимость контейнера:' tpColor='secondary' tpSize='.85rem' />
						<OnyxSwitch
							label={status ? 'Содержимое отображается' : 'Содержимое скрыто'}
							state={status}
							setState={setStatus}
							size='medium'
							labelPlacement='end'
						/>
					</Stack>
				</Stack>

				<Stack direction='row' justifyContent='space-between' alignItems='center' gap={2.5}>
					<Stack sx={{ width: '50%' }}>
						<OnyxTypography text='Ширина границ:' tpColor='secondary' tpSize='.85rem' />
						<TextField
							value={borderWidth}
							onChange={e => setBorderWidth(parseInt(e.target.value))}
							size='small'
							type='number'
							variant='outlined'
						/>
					</Stack>

					<Stack direction='row' gap={1.5} sx={{ width: '100%' }}>
						<Box sx={{ width: '100%' }}>
							<OnyxTypography text='Стиль границ:' tpColor='secondary' tpSize='.85rem' />
							<OnyxSelect
								fullwidth
								disableEmptyOption
								value={borderStyle}
								setValue={e => setBorderStyle(e.target.value as string)}
								itemsIndexes={['solid', 'dashed', 'dotted']}
								listItems={['Линия', 'Через тире', 'Точками']}
							/>
						</Box>

						<Box>
							<OnyxTypography text='Цвет границ:' tpColor='secondary' tpSize='.85rem' />
							<Box
								sx={{
									position: 'relative',
									padding: '1px',
									border: '1px solid gray',
									borderRadius: '5px',
								}}
								onClick={() => colorInputRef.current?.click()}
							>
								<Box
									sx={{
										width: '75px',
										height: '40px',
										borderRadius: '3px',
										backgroundColor: borderColor,
									}}
								></Box>
								<input
									ref={colorInputRef}
									type='color'
									value={borderColor}
									onChange={e => setBorderColor(e.target.value)}
									style={{ width: '0', height: '0', opacity: '0', position: 'absolute' }}
								/>
							</Box>
						</Box>
					</Stack>
				</Stack>

				<Divider sx={{ margin: '0 auto', width: '100%' }} />

				<Box>
					<OnyxTypography text='Предпросмотр:' tpColor='primary' tpSize='1.15rem' tpWeight='bold' />

					<Box
						sx={{
							marginTop: '.25rem',
							border: '1px solid lightgray',
							borderRadius: '5px',
							padding: '1rem',
						}}
					>
						{!!props.rowMode ? (
							<ContentRowContainerSkeleton
								status={status}
								styles={{ centered, elevation, borderWidth, borderColor, borderStyle }}
							/>
						) : (
							<ContentContainerSkeleton
								status={status}
								styles={{ centered, elevation, borderWidth, borderColor, borderStyle }}
							/>
						)}
					</Box>
				</Box>

				<Stack direction='row' justifyContent='flex-end' alignItems='center' gap={1.5}>
					<Button color='success' variant='outlined' sx={{ paddingInline: '2.25rem' }} onClick={handleSubmit}>
						Сохранить изменения
					</Button>
					<Button variant='contained' sx={{ paddingInline: '1.75rem' }} onClick={handleCancel}>
						Вернуться
					</Button>
				</Stack>
			</Stack>
		</OnyxAlertModal>
	);
};

interface IContentContainerSkeleton
	extends Omit<IContentContainerEditModal, 'modalState' | 'setModalState' | 'children' | 'csiid' | 'forcedMode'> {}

export function ContentContainerSkeleton(props: IContentContainerSkeleton) {
	return (
		<SectionContentContainer {...props} csiid='none' forcedMode='observe'>
			{!!props.rowMode ? (
				<Stack direction='row' gap={1}>
					<Box sx={{ border: '1px dashed lightgray', width: '100%', height: '75px' }}>
						<OnyxTypography text='Элемент 1' tpColor='secondary' tpSize='.85rem' tpAlign='center' />
					</Box>
					<Box sx={{ border: '1px dashed lightgray', width: '100%', height: '75px' }}>
						<OnyxTypography text='Элемент 2' tpColor='secondary' tpSize='.85rem' tpAlign='center' />
					</Box>
				</Stack>
			) : (
				<>
					<OnyxTypography text='Содержимое контейнера' tpColor='secondary' tpSize='.85rem' tpAlign='center' />
					<Stack direction='row' gap={1} width='100%'>
						<Box sx={{ border: '1px dashed lightgray', width: '100%', height: '75px' }}></Box>
						<Box sx={{ border: '1px dashed lightgray', width: '100%', height: '75px' }}></Box>
					</Stack>
					<Box sx={{ border: '1px dashed lightgray', width: '100%', height: '50px' }}></Box>
					<Box
						sx={{
							border: '1px dashed lightgray',
							width: '75%',
							height: '38px',
						}}
					></Box>
					<Box
						sx={{
							border: '1px dashed lightgray',
							width: '25%',
							height: '20px',
						}}
					></Box>
				</>
			)}
		</SectionContentContainer>
	);
}

export function ContentRowContainerSkeleton(props: IContentContainerSkeleton) {
	return (
		<SectionContentContainer {...props} csiid='none' forcedMode='observe'>
			<Stack direction='row' gap={1}>
				<Box sx={{ border: '1px dashed lightgray', width: '100%', height: '75px' }}>
					<OnyxTypography text='Элемент 1' tpColor='secondary' tpSize='.85rem' tpAlign='center' />
				</Box>
				<Box sx={{ border: '1px dashed lightgray', width: '100%', height: '75px' }}>
					<OnyxTypography text='Элемент 2' tpColor='secondary' tpSize='.85rem' tpAlign='center' />
				</Box>
			</Stack>
		</SectionContentContainer>
	);
}

export default ContentContainerEditModal;
