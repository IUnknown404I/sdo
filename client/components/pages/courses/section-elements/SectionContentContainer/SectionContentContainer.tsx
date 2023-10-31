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
import { Button, Paper } from '@mui/material';
import React, { ComponentProps, ReactNode } from 'react';
import { useTypedSelector } from '../../../../../redux/hooks';
import { CoursesReduxI } from '../../../../../redux/slices/courses';
import { OnyxTypography } from '../../../../basics/OnyxTypography';
import ContentContainerEditModal from '../../config-elements/ContentContainerEditModal';
import { CourseSectionContainer } from '../../courseItemsTypes';
import {
	EditFieldset,
	EditFieldsetLegend,
	SectionEditCofigButton,
	SectionEditConfigSubDial,
} from '../SectionEditElements';
import ContentAddElemetModal from '../../config-elements/ContentAddElemetModal';

function SectionContentContainer(props: {
	forcedMode?: CoursesReduxI['mode'];
	status?: boolean;
	children: ReactNode | ReactNode[];
	styles?: CourseSectionContainer['styles'];
}) {
	const viewMode = useTypedSelector(store => store.courses.mode);
	
	const Container = (
		<Paper
			elevation={props.styles?.elevation || 0}
			sx={{
				width: '100%',
				display: 'flex',
				flexDirection: 'column',
				gap: '.5rem',
				padding: !!props.styles?.elevation ? '1.25rem' : '',
				borderWidth: props.styles?.borderWidth ? `${props.styles.borderWidth}px` : '0px',
				borderColor: props.styles?.borderColor,
				borderStyle: props.styles?.borderStyle,
				borderRadius: !!props.styles?.elevation ? '13px' : '',
			}}
		>
			{props.children}
		</Paper>
	);

	return props.forcedMode === 'observe' || (props.forcedMode !== 'editor' && viewMode === 'observe') ? (
		Container
	) : (
		<EditFieldsetContainerWrapper {...props}>{Container}</EditFieldsetContainerWrapper>
	);
}

export default SectionContentContainer;

function EditFieldsetContainerWrapper(props: ComponentProps<typeof SectionContentContainer>) {
	const [configState, setConfigState] = React.useState<boolean>(false);
	const [configModalState, setConfigModalState] = React.useState<boolean>(false);
	const [addModalState, setAddModalState] = React.useState<boolean>(false);

	return (
		<EditFieldset styles={{ border: '3px solid lightgray' }}>
			<EditFieldsetLegend>
				Контейнер
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
					ariaLabel='Container options'
					items={[
						{ name: 'Удалить элемент', icon: <DeleteForeverIcon color='error' /> },
						{ name: 'Скрыть элемент', icon: <VisibilityOffIcon color='error' /> },
						{ name: 'Дублировать элемент', icon: <ControlPointDuplicateIcon /> },
					]}
				/>
			</EditFieldsetLegend>

			{props.children}

			<OnyxTypography
				component='div'
				ttFollow={false}
				ttPlacement='top'
				ttNode='Добавить элемент в контейнер'
				sx={{ marginTop: '.5rem', marginInline: 'auto', width: 'fit-content' }}
			>
				<Button variant='text' size='small' color='success' onClick={() => setAddModalState(prev => !prev)}>
					<ControlPointIcon sx={{ fontSize: '2.25rem' }} />
				</Button>
			</OnyxTypography>

			<ContentContainerEditModal modalState={configModalState} setModalState={setConfigModalState} {...props} />
			<ContentAddElemetModal state={addModalState} setState={setAddModalState} />
		</EditFieldset>
	);
}
