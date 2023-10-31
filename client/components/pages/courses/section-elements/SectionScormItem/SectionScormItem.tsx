import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ControlPointDuplicateIcon from '@mui/icons-material/ControlPointDuplicate';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import ErrorIcon from '@mui/icons-material/Error';
import SecurityIcon from '@mui/icons-material/Security';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import UTurnLeftIcon from '@mui/icons-material/UTurnLeft';
import { Button, Stack } from '@mui/material';
import { useRouter } from 'next/router';
import React, { ComponentProps, ReactNode } from 'react';
import { useTypedSelector } from '../../../../../redux/hooks';
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

type ScormItemsTypes = 'ispring' | 'storyline';
const SCORM_MAP = {
	scorm: {
		href: '/images/courses/sections/scorm.png',
		width: '50px',
		hrefTitle: 'Интерактивная презентация',
		fileType: 'Scorm-пакет',
	},
};

function SectionScormItem(props: { scid: string; type: ScormItemsTypes } & SectionItemBaseProps) {
	const router = useRouter();
	const viewMode = useTypedSelector(store => store.courses.mode);

	const ScormItem = (
		<OnyxLink
			href={`/courses/${router.query.cid}/${router.query.csid}/scorm/${props.scid}`}
			title='Интерактивная презентация'
			style={{ flexBasis: props.basis ? `${props.basis}%` : '100%' }}
		>
			<Button
				fullWidth
				variant='outlined'
				sx={{ height: '100%', padding: '.5rem .5rem .25rem !important', flexDirection: 'column' }}
			>
				<Stack width='100%' height='100%' direction='row' alignItems='center' gap={2}>
					<img alt='Scorm package icon' src={SCORM_MAP.scorm.href} style={{ width: SCORM_MAP.scorm.width }} />
					<OnyxTypography text={props.text} />
				</Stack>
				<CourseSectionItemFooter
					viewed={props.viewed}
					additional={{ fileSize: props.fileSize, fileType: SCORM_MAP.scorm.fileType }}
				/>
			</Button>
		</OnyxLink>
	);

	return viewMode === 'observe' ? (
		ScormItem
	) : (
		<EditFieldsetScormWrapper {...props} title={`Scorm-пакет, тип: ${props.type}`}>
			{ScormItem}
		</EditFieldsetScormWrapper>
	);
}

export function EditFieldsetScormWrapper(
	props: ComponentProps<typeof SectionScormItem> & { title?: string; children: ReactNode },
) {
	const router = useRouter();
	const [configState, setConfigState] = React.useState<boolean>(false);

	return (
		<EditFieldset styles={{ borderStyle: 'ridge' }}>
			<EditFieldsetLegend>
				{props.title || `Элемент - ${SCORM_MAP.scorm.fileType}`}
				<SectionEditCofigButton configState={configState} setConfigState={setConfigState} />
				<SectionEditConfigSubDial
					orderNumber={1}
					configState={configState}
					ariaLabel='Container config'
					items={[
						{
							name: 'Ограничения',
							icon: <SecurityIcon />,
							href: `/courses/${router.query.cid}/${router.query.csid}/scorm/${props.scid}/config/security`,
						},
						{
							name: 'Редактировать',
							icon: <EditIcon />,
							href: `/courses/${router.query.cid}/${router.query.csid}/scorm/${props.scid}/config`,
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
						{ name: 'Переместить вверх', icon: <ArrowDropUpIcon /> },
					]}
				/>
				<SectionEditConfigSubDial
					orderNumber={3}
					icon={<ErrorIcon />}
					configState={configState}
					ariaLabel='Container movement'
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

export default SectionScormItem;
