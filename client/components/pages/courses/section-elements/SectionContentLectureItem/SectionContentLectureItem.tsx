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
import OnyxLink from '../../../../basics/OnyxLink';
import { OnyxTypography } from '../../../../basics/OnyxTypography';
import {
    EditFieldset,
    EditFieldsetLegend,
    SectionEditCofigButton,
    SectionEditConfigSubDial
} from '../SectionEditElements';
import { CourseSectionItemFooter } from '../SectionItems';

const LECTURES_MAP = {
	lecture: {
		iconHref: '/images/courses/sections/abstract.png',
		width: '50px',
		hrefTitle: 'Перейти к лекции',
		fileType: 'Лекционные материалы',
	},
};

export interface SectionItemBaseProps {
	text: string;
	basis?: number;
	viewed?: boolean;
	fileSize?: number;
}

function SectionContentLectureItem(
	props: {
		href?: string;
		sx?: SxProps;
	} & SectionItemBaseProps,
) {
	const viewMode = useTypedSelector(store => store.courses.mode);
	const ContentLink = (
		<OnyxLink
			href={props.href || '/'}
			title={LECTURES_MAP.lecture.hrefTitle}
			style={{ flexBasis: props.basis ? `${props.basis}%` : '100%' }}
		>
			<Button
				fullWidth
				variant='outlined'
				sx={{ height: '100%', padding: '.5rem .5rem .25rem !important', flexDirection: 'column' }}
			>
				<Stack width='100%' height='100%' direction='row' alignItems='center' gap={2}>
					<img
						alt='Lecture icon'
						src={LECTURES_MAP.lecture.iconHref}
						style={{ width: LECTURES_MAP.lecture.width }}
					/>
					<OnyxTypography text={props.text} />
				</Stack>
				<CourseSectionItemFooter
					viewed={props.viewed}
					additional={{ fileSize: props.fileSize, fileType: LECTURES_MAP.lecture.fileType }}
				/>
			</Button>
		</OnyxLink>
	);

	return viewMode === 'observe' ? (
		ContentLink
	) : (
		<EditFieldsetLectureWrapper {...props}>{ContentLink}</EditFieldsetLectureWrapper>
	);
}

export default SectionContentLectureItem;

export function EditFieldsetLectureWrapper(
	props: ComponentProps<typeof SectionContentLectureItem> & { title?: string; children: ReactNode },
) {
	const [configState, setConfigState] = React.useState<boolean>(false);
	return (
		<EditFieldset styles={{ borderStyle: 'ridge', width: !!props.basis ? `${props.basis}%` : '100%' }}>
			<EditFieldsetLegend>
				Элемент - {LECTURES_MAP.lecture.fileType}
				<SectionEditCofigButton configState={configState} setConfigState={setConfigState} />
				<SectionEditConfigSubDial
					orderNumber={1}
					configState={configState}
					ariaLabel='Container config'
					items={[
						{ name: 'Ограничения', icon: <SecurityIcon /> },
						{ name: 'Редактировать', icon: <EditIcon /> },
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
		</EditFieldset>
	);
}
