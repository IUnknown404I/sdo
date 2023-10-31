import { Box, Button, Divider, Stack, TextField, useTheme } from '@mui/material';
import React, { ComponentProps } from 'react';
import { COROPRATIVE_COLOR_DARK, COROPRATIVE_COLOR_LIGHT } from '../../../../theme/ThemeOptions';
import OnyxAlertModal from '../../../basics/OnyxAlertModal';
import OnyxSelect from '../../../basics/OnyxSelect';
import { OnyxTypography } from '../../../basics/OnyxTypography';
import SectionContentLinkItem from '../section-elements/SectionContentLinkItem/SectionContentLinkItem';

const ContentLinkEditModal = (
	props: ComponentProps<typeof SectionContentLinkItem> & {
		modalState: boolean;
		setModalState: React.Dispatch<React.SetStateAction<boolean>>;
		onSubmitCallback?: () => void;
		onCancelCallback?: () => void;
	},
) => {
	const theme = useTheme();
	const fontColorInputRef = React.useRef<HTMLInputElement>(null);
	const borderColorInputRef = React.useRef<HTMLInputElement>(null);

	const [flexBasis, setFlexBasis] = React.useState<number>(props.basis || 100);
	const [title, setTitle] = React.useState<string>(props.text || 'Текст элемента');
	const [elementType, setElementType] = React.useState<string>(props.type || 'link');
	const [fontColor, setFontColor] = React.useState<string>(
		props.styles?.borderColor || theme.palette.mode === 'light' ? COROPRATIVE_COLOR_LIGHT : COROPRATIVE_COLOR_DARK,
	);

	const [borderWidth, setBorderWidth] = React.useState<number>(props.styles?.borderWidth || 1);
	const [borderStyle, setBorderStyle] = React.useState<string>(props.styles?.borderStyle || 'solid');
	const [borderColor, setBorderColor] = React.useState<string>(
		props.styles?.borderColor || theme.palette.mode === 'light' ? COROPRATIVE_COLOR_LIGHT : COROPRATIVE_COLOR_DARK,
	);

	function handleSubmit() {
		if (!!props.onSubmitCallback) props.onSubmitCallback();
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
			title='Редактирование ссылочного элемента'
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

				<Stack direction='row' gap={1.5} sx={{ width: '100%' }}>
					<Box sx={{ width: '100%' }}>
						<OnyxTypography text='Текст элемента:' tpColor='secondary' tpSize='.85rem' />
						<TextField
							value={title}
							fullWidth
							size='small'
							variant='outlined'
							onChange={e => setTitle(e.target.value as string)}
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

				<Stack width='100%' direction='row' justifyContent='space-between' alignItems='center' gap={1.5}>
					<Box sx={{ width: '100%' }}>
						<OnyxTypography text='Тип элемента:' tpColor='secondary' tpSize='.85rem' />
						<OnyxSelect
							fullwidth
							value={elementType}
							setValue={e => setElementType(e.target.value as string)}
							disableEmptyOption
							listItems={['Веб-ссылка', 'Видеофайл', 'Опросный лист']}
							itemsIndexes={['link', 'video', 'feedback']}
							size='small'
						/>
					</Box>
					<Box>
						<OnyxTypography text='Занимаемая ширина:' tpColor='secondary' tpSize='.85rem' />
						<OnyxSelect
							value={flexBasis}
							setValue={e =>
								setFlexBasis(
									typeof e.target.value === 'number' ? e.target.value : parseInt(e.target.value),
								)
							}
							disableEmptyOption
							listItems={['100%', '75%', '50%', '25%']}
							itemsIndexes={[100, 75, 50, 25]}
							size='small'
						/>
					</Box>
				</Stack>

				<Stack direction='row' justifyContent='space-between' alignItems='center' gap={1.5}>
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
							<OnyxTypography text='Ширина границ:' tpColor='secondary' tpSize='.85rem' />
							<TextField
								value={borderWidth}
								onChange={e => setBorderWidth(parseInt(e.target.value))}
								size='small'
								type='number'
								variant='outlined'
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

				<Box>
					<OnyxTypography text='Предпросмотр:' tpColor='primary' tpSize='1.15rem' tpWeight='bold' />

					<Stack
						width='100%'
						sx={{
							marginTop: '.25rem',
							border: '1px solid lightgray',
							borderRadius: '5px',
							padding: '1rem',
						}}
					>
						<SectionContentLinkItem
							forcedMode='observe'
							href='/'
							text={title}
							type={elementType as ComponentProps<typeof SectionContentLinkItem>['type']}
							basis={flexBasis}
							styles={{
								color: fontColor,
								borderColor,
								borderStyle,
								borderWidth,
							}}
						/>
					</Stack>
				</Box>

				<Stack direction='row' justifyContent='flex-end' alignItems='center' gap={1.5}>
					<Button variant='contained' sx={{ paddingInline: '2.25rem' }} onClick={handleSubmit}>
						Сохранить изменения
					</Button>
					<Button variant='outlined' onClick={handleCancel}>
						Вернуться
					</Button>
				</Stack>
			</Stack>
		</OnyxAlertModal>
	);
};

export default ContentLinkEditModal;
