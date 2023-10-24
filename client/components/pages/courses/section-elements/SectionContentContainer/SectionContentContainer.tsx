import AddCircleIcon from '@mui/icons-material/AddCircle';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ControlPointDuplicateIcon from '@mui/icons-material/ControlPointDuplicate';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import EjectIcon from '@mui/icons-material/Eject';
import ErrorIcon from '@mui/icons-material/Error';
import SettingsIcon from '@mui/icons-material/Settings';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { Button, Paper } from '@mui/material';
import { ComponentProps, ReactNode } from 'react';
import { useTypedSelector } from '../../../../../redux/hooks';
import OnyxSpeedDial from '../../../../basics/OnyxSpeedDial';
import { EditFieldset, EditFieldsetLegend } from '../SectionEditElements';

function SectionContentContainer(props: { children: ReactNode | ReactNode[]; elevated?: boolean }) {
	const viewMode = useTypedSelector(store => store.courses.mode);
	const Container = (
		<Paper
			elevation={props.elevated ? 3 : 0}
			sx={{
				width: '100%',
				display: 'flex',
				flexDirection: 'column',
				gap: '.5rem',
				padding: props.elevated ? '1.25rem' : '',
				border: props.elevated ? '1px solid #006fba' : '',
				borderRadius: props.elevated ? '13px' : '',
			}}
		>
			{props.children}
		</Paper>
	);

	return viewMode === 'observe' ? (
		Container
	) : (
		<EditFieldsetContainerWrapper>{Container}</EditFieldsetContainerWrapper>
	);
}

export default SectionContentContainer;

function EditFieldsetContainerWrapper(props: ComponentProps<typeof SectionContentContainer>) {
	return (
		<EditFieldset styles={{ border: '3px solid lightgray' }}>
			<EditFieldsetLegend>
				Контейнер
				<OnyxSpeedDial
					icon={<SettingsIcon />}
					blockElement
					disableOpenIcon
					disableBackdrop
					size='small'
					placement='top'
					itemsPlacement='right'
					ariaLabel='Container config'
					items={[
						{ name: 'Редактировать стили', icon: <EditIcon /> },
						{
							name: !!props.elevated ? 'Опустить контейнер' : 'Поднять контейнер',
							icon: <EjectIcon sx={{ transform: !!props.elevated ? 'rotate(180deg)' : undefined }} />,
						},
					]}
					containerSx={{ position: 'absolute', right: '-27px', top: '-7px' }}
				/>
				<OnyxSpeedDial
					icon={<SwapVertIcon />}
					blockElement
					disableOpenIcon
					disableBackdrop
					size='small'
					placement='top'
					itemsPlacement='right'
					ariaLabel='Container movement'
					items={[
						{ name: 'Переместить вниз', icon: <ArrowDropDownIcon /> },
						{ name: 'Переместить вверх', icon: <ArrowDropUpIcon /> },
					]}
					containerSx={{ position: 'absolute', right: '-52px', top: '-7px' }}
				/>
				<OnyxSpeedDial
					icon={<ErrorIcon />}
					blockElement
					disableOpenIcon
					disableBackdrop
					size='small'
					placement='top'
					itemsPlacement='right'
					ariaLabel='Container movement'
					items={[
						{ name: 'Удалить элемент', icon: <DeleteForeverIcon color='error' /> },
						{ name: 'Скрыть элемент', icon: <VisibilityOffIcon color='error' /> },
						{ name: 'Дублировать элемент', icon: <ControlPointDuplicateIcon /> },
					]}
					containerSx={{ position: 'absolute', right: '-77px', top: '-7px' }}
				/>
			</EditFieldsetLegend>
			{props.children}

			<Button variant='text' size='small' color='warning' sx={{ marginTop: '.25rem', fontSize: '.85rem' }}>
				Добавить элемент в контейнер
			</Button>
		</EditFieldset>
	);
}
