import AirlineStopsIcon from '@mui/icons-material/AirlineStops';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ControlPointDuplicateIcon from '@mui/icons-material/ControlPointDuplicate';
import Crop75Icon from '@mui/icons-material/Crop75';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import ErrorIcon from '@mui/icons-material/Error';
import HeightIcon from '@mui/icons-material/Height';
import SecurityIcon from '@mui/icons-material/Security';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import UTurnLeftIcon from '@mui/icons-material/UTurnLeft';
import WidthFullIcon from '@mui/icons-material/WidthFull';
import WidthNormalIcon from '@mui/icons-material/WidthNormal';
import WidthWideIcon from '@mui/icons-material/WidthWide';
import { Button, Stack, SxProps } from '@mui/material';
import React, { ComponentProps, ReactNode } from 'react';
import { useTypedSelector } from '../../../../../redux/hooks';
import { CoursesReduxI } from '../../../../../redux/slices/courses';
import OnyxLink from '../../../../basics/OnyxLink';
import { OnyxTypography } from '../../../../basics/OnyxTypography';
import ContentLinkEditModal from '../../config-elements/ContentLinkEditModal';
import { CourseSectionItemLinkI } from '../../courseItemsTypes';
import {
	EditFieldset,
	EditFieldsetLegend,
	SectionEditCofigButton,
	SectionEditConfigSubDial,
} from '../SectionEditElements';
import { CourseSectionItemFooter } from '../SectionItems';

const LINKS_MAP = {
	link: {
		href: '/images/courses/sections/link.png',
		width: '35px',
		hrefTitle: 'Перейти',
		fileType: 'Веб-ссылка',
		target: '_blank',
	},
	video: {
		href: '/images/courses/sections/video.png',
		width: '40px',
		hrefTitle: 'Перейти к видео',
		fileType: 'Видеофайл',
		target: '_blank',
	},
	feedback: {
		href: '/images/courses/sections/feedback.png',
		width: '50px',
		hrefTitle: 'Заполнить анкету',
		fileType: 'Опросный лист',
		target: '_blank',
	},
};

export interface SectionItemBaseProps {
	text: string;
	basis?: number;
	viewed?: boolean;
	fileSize?: number;
	styles?: CourseSectionItemLinkI['styles'];
}

function SectionContentLinkItem(
	props: {
		forcedMode?: CoursesReduxI['mode'];
		type: keyof typeof LINKS_MAP;
		href?: string;
		sx?: SxProps;
	} & SectionItemBaseProps,
) {
	const viewMode = useTypedSelector(store => store.courses.mode);
	const ContentLink = (
		<OnyxLink
			href={props.href || '/'}
			title={LINKS_MAP[props.type].hrefTitle}
			target={props.type === 'link' || props.type === 'feedback' ? '_blank' : undefined}
			rel={props.type === 'link' || props.type === 'feedback' ? 'norefferer' : undefined}
			style={{
				width: props.basis ? `${props.basis}%` : '100%',
				flexBasis: props.basis ? `${props.basis}%` : '100%',
			}}
		>
			<Button
				fullWidth
				variant='outlined'
				sx={{
					height: '100%',
					padding: '.5rem .5rem .25rem !important',
					flexDirection: 'column',
					flexBasis: props.basis ? `${props.basis}% !important` : '100%',
					borderWidth: props.styles?.borderWidth ? `${props.styles.borderWidth}px !important` : '',
					borderColor: `${props.styles?.borderColor} !important`,
					borderStyle: `${props.styles?.borderStyle} !important`,
					color: props.styles?.color,
				}}
			>
				<Stack width='100%' height='100%' direction='row' alignItems='center' gap={2}>
					<img
						alt='Link type icon'
						src={LINKS_MAP[props.type].href}
						style={{ width: LINKS_MAP[props.type].width }}
					/>
					<OnyxTypography text={props.text} />
				</Stack>
				<CourseSectionItemFooter
					viewed={props.viewed}
					additional={{ fileSize: props.fileSize, fileType: props.type }}
				/>
			</Button>
		</OnyxLink>
	);

	return props.forcedMode === 'observe' || (props.forcedMode !== 'editor' && viewMode === 'observe') ? (
		ContentLink
	) : (
		<EditFieldsetLinkWrapper {...props}>{ContentLink}</EditFieldsetLinkWrapper>
	);
}

export default SectionContentLinkItem;

export function EditFieldsetLinkWrapper(
	props: ComponentProps<typeof SectionContentLinkItem> & { title?: string; children: ReactNode },
) {
	const [configState, setConfigState] = React.useState<boolean>(false);
	const [configModalState, setConfigModalState] = React.useState<boolean>(false);

	return (
		<EditFieldset styles={{ borderStyle: 'ridge', width: !!props.basis ? `${props.basis}%` : '100%' }}>
			<EditFieldsetLegend>
				Элемент - {LINKS_MAP[props.type]['fileType']}
				<SectionEditCofigButton configState={configState} setConfigState={setConfigState} />
				<SectionEditConfigSubDial
					orderNumber={1}
					configState={configState}
					ariaLabel='Container config'
					items={[
						{ name: 'Ограничения', icon: <SecurityIcon /> },
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
						{ name: 'Вынести из конейнера', icon: <UTurnLeftIcon /> },
						{ name: 'Переместить', icon: <AirlineStopsIcon /> },
						{ name: 'Переместить вверх', icon: <ArrowDropUpIcon /> },
					]}
				/>
				<SectionEditConfigSubDial
					orderNumber={3}
					icon={<HeightIcon sx={{ transform: 'rotate(90deg)' }} />}
					configState={configState}
					ariaLabel='Container size'
					items={[
						{
							name: '25% ширины',
							icon: <Crop75Icon color={props.basis === 25 ? 'secondary' : 'primary'} />,
						},
						{
							name: '50% ширины',
							icon: <WidthNormalIcon color={props.basis === 50 ? 'secondary' : 'primary'} />,
						},
						{
							name: '75% ширины',
							icon: <WidthWideIcon color={props.basis === 75 ? 'secondary' : 'primary'} />,
						},
						{
							name: 'Вся ширина',
							icon: (
								<WidthFullIcon color={!props.basis || props.basis === 100 ? 'secondary' : 'primary'} />
							),
						},
					]}
				/>
				<SectionEditConfigSubDial
					orderNumber={4}
					icon={<ErrorIcon />}
					configState={configState}
					ariaLabel='Container options'
					items={[
						{ name: 'Удалить элемент', icon: <DeleteForeverIcon color='error' /> },
						{ name: 'Дублировать элемент', icon: <ControlPointDuplicateIcon /> },
					]}
				/>
			</EditFieldsetLegend>

			{props.children}

			<ContentLinkEditModal {...props} modalState={configModalState} setModalState={setConfigModalState} />
		</EditFieldset>
	);
}
