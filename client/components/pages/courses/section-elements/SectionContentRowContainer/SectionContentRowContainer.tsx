import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import ControlPointDuplicateIcon from '@mui/icons-material/ControlPointDuplicate';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import ErrorIcon from '@mui/icons-material/Error';
import FormatPaintIcon from '@mui/icons-material/FormatPaint';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { Button, Stack } from '@mui/material';
import React, { ComponentProps, ReactNode } from 'react';
import { useTypedSelector } from '../../../../../redux/hooks';
import { OnyxTypography } from '../../../../basics/OnyxTypography';
import ContentAddElemetModal from '../../config-elements/ContentAddElemetModal';
import ContentContainerEditModal from '../../config-elements/ContentContainerEditModal';
import {
	EditFieldset,
	EditFieldsetLegend,
	SectionEditCofigButton,
	SectionEditConfigSubDial,
} from '../SectionEditElements';

export function SectionContentRowContainer(props: {
	children: ReactNode | ReactNode[];
	alignItems?: 'center' | 'flex-start' | 'flex-end';
}) {
	const viewMode = useTypedSelector(store => store.courses.mode);
	const RowContainer = (
		<Stack
			direction={{ xs: 'column', md: 'row' }}
			alignItems={props.alignItems}
			gap={1}
			sx={{
				'> a': { flexBasis: '50%' },
				'> a > button': { flexDirection: 'column', padding: '.5rem' },
			}}
		>
			{props.children}
		</Stack>
	);

	return viewMode === 'observe' ? (
		RowContainer
	) : (
		<EditFieldsetRowContainerWrapper rowChildren={props.children}>{RowContainer}</EditFieldsetRowContainerWrapper>
	);
}

export default SectionContentRowContainer;

function EditFieldsetRowContainerWrapper(
	props: ComponentProps<typeof SectionContentRowContainer> & { rowChildren: ReactNode | ReactNode[] },
) {
	const [configState, setConfigState] = React.useState<boolean>(false);
	const [addModalState, setAddModalState] = React.useState<boolean>(false);
	const [configModalState, setConfigModalState] = React.useState<boolean>(false);

	return (
		<EditFieldset
			styles={{
				borderStyle: 'dashed',
				paddingRight: !Array.isArray(props.rowChildren) || props.rowChildren.length <= 1 ? '50px' : undefined,
			}}
		>
			<EditFieldsetLegend>
				Строчный контейнер
				<SectionEditCofigButton configState={configState} setConfigState={setConfigState} />
				<SectionEditConfigSubDial
					orderNumber={1}
					icon={<FormatPaintIcon />}
					configState={configState}
					ariaLabel='Container config'
					items={[
						{
							name: 'Редактировать стили',
							icon: <DesignServicesIcon />,
							onClick: () => setConfigModalState(prev => !prev),
						},
					]}
				/>
				<SectionEditConfigSubDial
					orderNumber={2}
					icon={<SwapVertIcon />}
					configState={configState}
					ariaLabel='Container movement'
					items={[
						{ name: 'Переместить вниз', icon: <ArrowDropDownIcon /> },
						{ name: 'Переместить вверх', icon: <ArrowDropUpIcon /> },
					]}
				/>
				<SectionEditConfigSubDial
					orderNumber={3}
					icon={<ErrorIcon />}
					configState={configState}
					ariaLabel='Container config'
					items={[
						{ name: 'Удалить элемент', icon: <DeleteForeverIcon color='error' /> },
						{ name: 'Скрыть элемент', icon: <VisibilityOffIcon color='error' /> },
						{ name: 'Дублировать элемент', icon: <ControlPointDuplicateIcon /> },
					]}
				/>
			</EditFieldsetLegend>

			{props.children}

			{(!Array.isArray(props.rowChildren) || props.rowChildren.length <= 1) && (
				<OnyxTypography
					component='div'
					sx={{
						position: 'absolute',
						top: 'calc(50% - 20px)',
						right: '2px',
					}}
					ttFollow={false}
					ttPlacement='top'
					ttNode='Добавить элемент в строку'
				>
					<Button
						variant='text'
						size='small'
						color='success'
						sx={{
							minWidth: 'unset',
						}}
						onClick={() => setAddModalState(prev => !prev)}
					>
						<ControlPointIcon sx={{ fontSize: '2.25rem' }} />
					</Button>
				</OnyxTypography>
			)}

			<ContentContainerEditModal
				rowMode
				modalState={configModalState}
				setModalState={setConfigModalState}
				{...props}
			/>
			<ContentAddElemetModal state={addModalState} setState={setAddModalState} />
		</EditFieldset>
	);
}
