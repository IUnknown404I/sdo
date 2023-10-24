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
import SettingsIcon from '@mui/icons-material/Settings';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import UTurnLeftIcon from '@mui/icons-material/UTurnLeft';
import WidthFullIcon from '@mui/icons-material/WidthFull';
import WidthNormalIcon from '@mui/icons-material/WidthNormal';
import WidthWideIcon from '@mui/icons-material/WidthWide';
import { Button, Stack, SxProps } from '@mui/material';
import { ComponentProps, ReactNode } from 'react';
import { useTypedSelector } from '../../../../../redux/hooks';
import OnyxLink from '../../../../basics/OnyxLink';
import OnyxSpeedDial from '../../../../basics/OnyxSpeedDial';
import { OnyxTypography } from '../../../../basics/OnyxTypography';
import { EditFieldset, EditFieldsetLegend, LINK_ITEM_MAP } from '../SectionEditElements';
import { CourseSectionItemFooter } from '../SectionItems';

export interface SectionItemBaseProps {
	text: string;
	basis?: number;
	viewed?: boolean;
	size?: number;
}

function SectionContentLinkItem(
	props: {
		type: keyof typeof LINK_ITEM_MAP;
		href?: string;
		sx?: SxProps;
	} & SectionItemBaseProps,
) {
	const viewMode = useTypedSelector(store => store.courses.mode);
	const ContentLink = (
		<OnyxLink
			href={props.href || '/'}
			title={LINK_ITEM_MAP[props.type].hrefTitle}
			target={props.type === 'link' || props.type === 'feedback' ? '_blank' : undefined}
			rel={props.type === 'link' || props.type === 'feedback' ? 'norefferer' : undefined}
			style={{ flexBasis: props.basis ? `${props.basis}%` : '100%' }}
		>
			<Button
				fullWidth
				variant='outlined'
				sx={{ height: '100%', padding: '.5rem .5rem .25rem !important', flexDirection: 'column' }}
			>
				<Stack width='100%' height='100%' direction='row' alignItems='center' gap={2}>
					<img
						alt='Link type icon'
						src={LINK_ITEM_MAP[props.type].href}
						style={{ width: LINK_ITEM_MAP[props.type].width }}
					/>
					<OnyxTypography text={props.text} />
				</Stack>
				<CourseSectionItemFooter
					viewed={props.viewed}
					additional={{ fileSize: props.size, fileType: props.type }}
				/>
			</Button>
		</OnyxLink>
	);

	return viewMode === 'observe' ? (
		ContentLink
	) : (
		<EditFieldsetLinkWrapper {...props}>{ContentLink}</EditFieldsetLinkWrapper>
	);
}

export default SectionContentLinkItem;

export function EditFieldsetLinkWrapper(
	props: ComponentProps<typeof SectionContentLinkItem> & { title?: string; children: ReactNode },
) {
	return (
		<EditFieldset styles={{ borderStyle: 'ridge', width: !!props.basis ? `${props.basis}%` : '100%' }}>
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
						{ name: 'Переместить', icon: <AirlineStopsIcon /> },
						{ name: 'Переместить вверх', icon: <ArrowDropUpIcon /> },
					]}
					containerSx={{ position: 'absolute', right: '-52px', top: '-7px', '&:hover': { zIndex: 2 } }}
				/>
				<OnyxSpeedDial
					icon={<HeightIcon sx={{ transform: 'rotate(90deg)' }} />}
					blockElement
					disableOpenIcon
					disableBackdrop
					size='small'
					placement='top'
					itemsPlacement='right'
					ariaLabel='Container size'
					items={[
						{ name: '25% ширины', icon: <Crop75Icon /> },
						{ name: '50% ширины', icon: <WidthNormalIcon /> },
						{ name: '75% ширины', icon: <WidthWideIcon /> },
						{ name: 'Вся ширина', icon: <WidthFullIcon /> },
					]}
					containerSx={{ position: 'absolute', right: '-77px', top: '-7px' }}
				/>
				<OnyxSpeedDial
					icon={<ErrorIcon />}
					blockElement
					disableOpenIcon
					disableBackdrop
					size='small'
					placement='top'
					itemsPlacement='right'
					ariaLabel='Container options'
					items={[
						{ name: 'Удалить элемент', icon: <DeleteForeverIcon color='error' /> },
						{ name: 'Дублировать элемент', icon: <ControlPointDuplicateIcon /> },
					]}
					containerSx={{ position: 'absolute', right: '-102px', top: '-7px' }}
				/>
			</EditFieldsetLegend>

			{props.children}
		</EditFieldset>
	);
}
