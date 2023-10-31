import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ControlPointDuplicateIcon from '@mui/icons-material/ControlPointDuplicate';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import ErrorIcon from '@mui/icons-material/Error';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import React, { ComponentProps, ElementType, ReactNode } from 'react';
import { useTypedSelector } from '../../../../../redux/hooks';
import { CoursesReduxI } from '../../../../../redux/slices/courses';
import { OnyxTypography } from '../../../../basics/OnyxTypography';
import ContentHeaderEditModal from '../../config-elements/ContentHeaderEditModal';
import { CourseSectionItemHeaderI } from '../../courseItemsTypes';
import {
	EditFieldset,
	EditFieldsetLegend,
	SectionEditCofigButton,
	SectionEditConfigSubDial,
} from '../SectionEditElements';

function SectionContentHeader(props: {
	forcedMode?: CoursesReduxI['mode'];
	title: CourseSectionItemHeaderI['title'];
	component?: ElementType<any>;
	styles?: Omit<CourseSectionItemHeaderI['styles'], 'elevation'>;
}) {
	const viewMode = useTypedSelector(store => store.courses.mode);
	const ContentHeader = (
		<OnyxTypography
			component={props.component || 'h2'}
			text={props.title}
			tpSize='1.5rem'
			tpColor={props.styles?.color || 'primary'}
			sx={{
				marginBottom: '.5rem',
				paddingLeft: '.5rem',
				borderLeftColor: props.styles?.borderColor || 'currentColor',
				borderLeftStyle: props.styles?.borderStyle || 'solid',
				borderLeftWidth: props.styles?.borderWidth ? `${props.styles.borderWidth}px` : '3px',
			}}
		/>
	);

	return props.forcedMode === 'observe' || (props.forcedMode !== 'editor' && viewMode === 'observe') ? (
		ContentHeader
	) : (
		<EditFieldsetHeaderWrapper {...props}>{ContentHeader}</EditFieldsetHeaderWrapper>
	);
}

export default SectionContentHeader;

function EditFieldsetHeaderWrapper(props: ComponentProps<typeof SectionContentHeader> & { children: ReactNode }) {
	const [configState, setConfigState] = React.useState<boolean>(false);
	const [configModalState, setConfigModalState] = React.useState<boolean>(false);

	return (
		<EditFieldset styles={{ borderStyle: 'solid' }}>
			<EditFieldsetLegend>
				Заголовок
				<SectionEditCofigButton configState={configState} setConfigState={setConfigState} />
				<SectionEditConfigSubDial
					orderNumber={1}
					configState={configState}
					ariaLabel='Container config'
					items={[
						{
							name: 'Редактировать',
							icon: <EditIcon />,
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
						{ name: 'Дублировать элемент', icon: <ControlPointDuplicateIcon /> },
					]}
				/>
				<ContentHeaderEditModal modalState={configModalState} setModalState={setConfigModalState} {...props} />
			</EditFieldsetLegend>

			{props.children}
		</EditFieldset>
	);
}
