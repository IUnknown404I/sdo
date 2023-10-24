import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ControlPointDuplicateIcon from '@mui/icons-material/ControlPointDuplicate';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import ErrorIcon from '@mui/icons-material/Error';
import SecurityIcon from '@mui/icons-material/Security';
import SettingsIcon from '@mui/icons-material/Settings';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import UTurnLeftIcon from '@mui/icons-material/UTurnLeft';
import { Button, Stack } from '@mui/material';
import { useRouter } from 'next/router';
import { ComponentProps, ReactNode } from 'react';
import { useTypedSelector } from '../../../../../redux/hooks';
import OnyxLink from '../../../../basics/OnyxLink';
import OnyxSpeedDial from '../../../../basics/OnyxSpeedDial';
import { OnyxTypography } from '../../../../basics/OnyxTypography';
import SectionContentLinkItem, { SectionItemBaseProps } from '../SectionContentLinkItem/SectionContentLinkItem';
import { EditFieldset, EditFieldsetLegend, LINK_ITEM_MAP } from '../SectionEditElements';
import { CourseSectionItemFooter } from '../SectionItems';

type ScormItemsTypes = 'ispring' | 'storyline';
function SectionScormItem(props: { scid: string; type: ScormItemsTypes } & SectionItemBaseProps) {
	const router = useRouter();
	const viewMode = useTypedSelector(store => store.courses.mode);

	const ScormItem = (
		<OnyxLink
			href={`/courses/${router.query.cid}/${router.query.csid}/scorm?path=${props.scid}/${
				props.type === 'ispring' ? 'index.html' : 'story.html'
			}`}
			title='Интерактивная презентация'
			style={{ flexBasis: props.basis ? `${props.basis}%` : '100%' }}
		>
			<Button
				fullWidth
				variant='outlined'
				sx={{ height: '100%', padding: '.5rem .5rem .25rem !important', flexDirection: 'column' }}
			>
				<Stack width='100%' height='100%' direction='row' alignItems='center' gap={2}>
					<img
						alt='Scorm package icon'
						src={LINK_ITEM_MAP.scorm.href}
						style={{ width: LINK_ITEM_MAP.scorm.width }}
					/>
					<OnyxTypography text={props.text} />
				</Stack>
				<CourseSectionItemFooter
					viewed={props.viewed}
					additional={{ fileSize: props.size, fileType: 'scorm' }}
				/>
			</Button>
		</OnyxLink>
	);

	return viewMode === 'observe' ? (
		ScormItem
	) : (
		<EditFieldsetScormWrapper {...props} type='scorm' title={`Scorm-пакет, тип: ${props.type}`}>
			{ScormItem}
		</EditFieldsetScormWrapper>
	);
}

export function EditFieldsetScormWrapper(
	props: ComponentProps<typeof SectionContentLinkItem> & { title?: string; children: ReactNode },
) {
	return (
		<EditFieldset styles={{ borderStyle: 'ridge' }}>
			<EditFieldsetLegend>
				Элемент - {LINK_ITEM_MAP[props.type]['fileType']}
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
						{ name: 'Ограничения', icon: <SecurityIcon /> },
						{ name: 'Редактировать', icon: <EditIcon /> },
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
						{ name: 'Вынести из конейнера', icon: <UTurnLeftIcon /> },
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
						{ name: 'Дублировать элемент', icon: <ControlPointDuplicateIcon /> },
					]}
					containerSx={{ position: 'absolute', right: '-77px', top: '-7px' }}
				/>
			</EditFieldsetLegend>
			{props.children}
		</EditFieldset>
	);
}

export default SectionScormItem;
