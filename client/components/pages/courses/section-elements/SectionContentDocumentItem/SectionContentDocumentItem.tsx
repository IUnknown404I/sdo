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
import { SectionItemBaseProps } from '../SectionContentLinkItem/SectionContentLinkItem';
import {
	EditFieldset,
	EditFieldsetLegend,
	SectionEditCofigButton,
	SectionEditConfigSubDial,
} from '../SectionEditElements';
import { CourseSectionItemFooter } from '../SectionItems';

const DOCUMENTS_MAP = {
	pdf: {
		iconHref: '/images/courses/sections/pdf.png',
		width: '50px',
		hrefTitle: 'Открыть документ',
		fileType: 'Pdf-документ',
		target: undefined,
	},
	ppt: {
		iconHref: '/images/courses/sections/ppt.png',
		width: '50px',
		hrefTitle: 'Открыть презентацию',
		fileType: 'Ppt-презентация',
		target: '_blank',
	},
	word: {
		iconHref: '/images/courses/sections/doc.png',
		width: '50px',
		hrefTitle: 'Открыть файл',
		fileType: 'Word-документ',
		target: '_blank',
	},
	excel: {
		iconHref: '/images/courses/sections/xls.png',
		width: '50px',
		hrefTitle: 'Открыть таблицу',
		fileType: 'Excel-таблица',
		target: '_blank',
	},
};

function SectionContentDocumentItem(
	props: {
		forcedMode?: CoursesReduxI['mode'];
		type: keyof typeof DOCUMENTS_MAP;
		href?: string;
		target?: string;
		sx?: SxProps;
	} & SectionItemBaseProps,
) {
	const viewMode = useTypedSelector(store => store.courses.mode);
	const ContentLink = (
		<OnyxLink
			href={props.href || '/'}
			target={props.target || DOCUMENTS_MAP[props.type].target}
			title={DOCUMENTS_MAP[props.type].hrefTitle}
			style={{ flexBasis: props.basis ? `${props.basis}%` : '100%' }}
		>
			<Button
				fullWidth
				variant='outlined'
				sx={{ height: '100%', padding: '.5rem .5rem .25rem !important', flexDirection: 'column' }}
			>
				<Stack width='100%' height='100%' direction='row' alignItems='center' gap={2}>
					<img
						alt='File icon'
						src={DOCUMENTS_MAP[props.type].iconHref}
						style={{ width: DOCUMENTS_MAP[props.type].width }}
					/>
					<OnyxTypography text={props.text} />
				</Stack>
				<CourseSectionItemFooter
					viewed={props.viewed}
					additional={{
						fileSize: props.fileSize,
						fileType: DOCUMENTS_MAP[props.type].fileType,
					}}
				/>
			</Button>
		</OnyxLink>
	);

	return props.forcedMode === 'observe' || (props.forcedMode !== 'editor' && viewMode === 'observe') ? (
		ContentLink
	) : (
		<EditFieldsetDocumentWrapper {...props}>{ContentLink}</EditFieldsetDocumentWrapper>
	);
}

export default SectionContentDocumentItem;

export function EditFieldsetDocumentWrapper(
	props: ComponentProps<typeof SectionContentDocumentItem> & { title?: string; children: ReactNode },
) {
	const [configState, setConfigState] = React.useState<boolean>(false);
	return (
		<EditFieldset styles={{ borderStyle: 'ridge', width: !!props.basis ? `${props.basis}%` : '100%' }}>
			<EditFieldsetLegend>
				Элемент - {DOCUMENTS_MAP[props.type]['fileType']}
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
