import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ControlPointDuplicateIcon from '@mui/icons-material/ControlPointDuplicate';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import ErrorIcon from '@mui/icons-material/Error';
import SettingsIcon from '@mui/icons-material/Settings';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import { Box, Divider } from '@mui/material';
import { ReactNode } from 'react';
import { useTypedSelector } from '../../../../../redux/hooks';
import OnyxSpeedDial from '../../../../basics/OnyxSpeedDial';
import { EditFieldset, EditFieldsetLegend } from '../SectionEditElements';

export function SectionContentEmptyElement() {
	const viewMode = useTypedSelector(store => store.courses.mode);
	const ContentEmptyDivider = <Divider sx={{ width: '0px', margin: '1rem 0' }} />;

	return viewMode === 'observe' ? (
		ContentEmptyDivider
	) : (
		<EditFieldsetDividerWrapper>{ContentEmptyDivider}</EditFieldsetDividerWrapper>
	);
}

export default SectionContentEmptyElement;

function EditFieldsetDividerWrapper(props: { children: ReactNode }) {
	return (
		<Box sx={{ width: '100%', zIndex: 0, '&:hover': { zIndex: 1 } }}>
			<EditFieldset
				styles={{ zIndex: 1, border: 'unset', borderLeft: '1px dashed gray', borderRight: '1px dashed gray' }}
			>
				<EditFieldsetLegend>
					Пустой блок
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
						containerSx={{ position: 'absolute', right: '-27px', top: '-7px' }}
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
						containerSx={{ position: 'absolute', right: '-52px', top: '-7px' }}
					/>
				</EditFieldsetLegend>
				{props.children}
			</EditFieldset>
		</Box>
	);
}
