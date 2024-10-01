import { Box, Button, Divider, Stack, TextField, useTheme } from '@mui/material';
import React, { ComponentProps } from 'react';
import { useDebouncedState } from '../../../../hooks/useDebouncedState';
import { COROPRATIVE_COLOR_DARK, COROPRATIVE_COLOR_LIGHT } from '../../../../theme/ThemeOptions';
import OnyxAlertModal from '../../../basics/OnyxAlertModal';
import OnyxSelect from '../../../basics/OnyxSelect';
import OnyxSwitch from '../../../basics/OnyxSwitch';
import { OnyxTypography } from '../../../basics/OnyxTypography';
import { CourseSectionItemHeaderI } from '../courseItemsTypes';
import SectionContentHeader from '../section-elements/SectionContentHeader/SectionContentHeader';

interface IContentHeaderEditModal extends ComponentProps<typeof SectionContentHeader> {
	modalState: boolean;
	setModalState: React.Dispatch<React.SetStateAction<boolean>>;
	onSubmitCallback?: (payload: { title: string; styles: NonNullable<CourseSectionItemHeaderI['styles']> }) => void;
	onCancelCallback?: () => void;
}

const ContentHeaderEditModal = (props: IContentHeaderEditModal) => {
	const theme = useTheme();
	const fontColorInputRef = React.useRef<HTMLInputElement>(null);
	const borderColorInputRef = React.useRef<HTMLInputElement>(null);

	const [title, setTitle] = React.useState<string>(props.title || 'Текст заголовка');
	const [fullwidth, setFullwidth] = React.useState<boolean>(props.styles?.fullwidth ?? true);
	const [fontColor, setFontColor] = useDebouncedState<string>(
		props.styles?.color || (theme.palette.mode === 'light' ? COROPRATIVE_COLOR_LIGHT : COROPRATIVE_COLOR_DARK),
		250,
	);

	const [borderWidth, setBorderWidth] = React.useState<number>(props.styles?.borderWidth || 3);
	const [borderColor, setBorderColor] = useDebouncedState<string>(
		props.styles?.borderColor ||
			(theme.palette.mode === 'light' ? COROPRATIVE_COLOR_LIGHT : COROPRATIVE_COLOR_DARK),
		250,
	);
	const [borderStyle, setBorderStyle] = React.useState<string>(props.styles?.borderStyle || 'solid');

	function handleSubmit() {
		if (!!props.onSubmitCallback)
			props.onSubmitCallback({
				title,
				styles: { fullwidth, color: fontColor, borderWidth, borderColor, borderStyle },
			});
		props.setModalState(false);
	}

	function handleCancel() {
		if (!!props.onCancelCallback) props.onCancelCallback();
		props.setModalState(false);
	}

	return (
		<OnyxAlertModal
			uncontrolled
			width='800px'
			title='Редактирование заголовка'
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

				<Stack width='100%' direction='row' gap={1.5}>
					<Box sx={{ width: '100%' }}>
						<OnyxTypography text='Текст заголовка:' tpColor='secondary' tpSize='.85rem' />
						<TextField
							value={title}
							fullWidth
							size='small'
							variant='outlined'
							onChange={e => setTitle(e.target.value as string)}
						/>
					</Box>
					<Box sx={{ whiteSpace: 'nowrap' }}>
						<OnyxTypography text='.' tpSize='.85rem' sx={{ color: 'transparent' }} />
						<OnyxSwitch
							state={fullwidth}
							setState={setFullwidth}
							label='Во всю ширину'
							size='medium'
							labelPlacement='end'
						/>
					</Box>
					<Box>
						<OnyxTypography text='Цвет текста:' tpColor='secondary' tpSize='.85rem' />
						<Box
							sx={{
								position: 'relative',
								border: '1px solid gray',
								borderRadius: '5px',
								padding: '1px',
								color: '#006fba',
							}}
							onClick={() => fontColorInputRef.current?.click()}
						>
							<Box
								sx={{
									width: '75px',
									height: '40px',
									borderRadius: '3px',
									backgroundColor: fontColor,
								}}
							></Box>
							<input
								ref={fontColorInputRef}
								type='color'
								value={fontColor}
								onChange={e => setFontColor(e.target.value)}
								style={{ width: '0', height: '0', opacity: '0', position: 'absolute' }}
							/>
						</Box>
					</Box>
				</Stack>

				<Stack direction='row' justifyContent='space-between' alignItems='center' gap={1.5}>
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
									border: '1px solid gray',
									borderRadius: '5px',
									padding: '1px',
									color: '#006fba',
								}}
								onClick={() => borderColorInputRef.current?.click()}
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
									ref={borderColorInputRef}
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

				<Box sx={{ width: '100%' }}>
					<OnyxTypography text='Предпросмотр:' tpColor='primary' tpSize='1.15rem' tpWeight='bold' />
					<Box
						sx={{
							width: '100%',
							marginTop: '.25rem',
							border: '1px solid lightgray',
							borderRadius: '5px',
							padding: '1rem',
						}}
					>
						<SectionContentHeader
							csiid=''
							orderNumber={1}
							forcedMode='observe'
							title={title}
							styles={{ color: fontColor, borderWidth, borderColor, borderStyle }}
						/>
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

export default ContentHeaderEditModal;
