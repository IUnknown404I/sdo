import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ControlPointDuplicateIcon from '@mui/icons-material/ControlPointDuplicate';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ErrorIcon from '@mui/icons-material/Error';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import { Box, Divider } from '@mui/material';
import React, { ComponentProps, ReactNode } from 'react';
import { useTypedSelector } from '../../../../../redux/hooks';
import {
	EditFieldset,
	EditFieldsetLegend,
	SectionEditCofigButton,
	SectionEditConfigSubDial,
} from '../SectionEditElements';

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

function EditFieldsetDividerWrapper(
	props: ComponentProps<typeof SectionContentEmptyElement> & { children: ReactNode },
) {
	const [configState, setConfigState] = React.useState<boolean>(false);
	return (
		<Box sx={{ width: '100%', zIndex: 0, '&:hover': { zIndex: 1 } }}>
			<EditFieldset
				styles={{ zIndex: 1, border: 'unset', borderLeft: '1px dashed gray', borderRight: '1px dashed gray' }}
			>
				<EditFieldsetLegend>
					Пустой блок
					<SectionEditCofigButton configState={configState} setConfigState={setConfigState} />
					<SectionEditConfigSubDial
						orderNumber={1}
						icon={<SwapVertIcon />}
						configState={configState}
						ariaLabel='Container movement'
						items={[
							{ name: 'Переместить вниз', icon: <ArrowDropDownIcon /> },
							{ name: 'Переместить вверх', icon: <ArrowDropUpIcon /> },
						]}
					/>
					<SectionEditConfigSubDial
						orderNumber={2}
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
		</Box>
	);
}
