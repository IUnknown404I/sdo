import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import ControlPointDuplicateIcon from '@mui/icons-material/ControlPointDuplicate';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ErrorIcon from '@mui/icons-material/Error';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { Button, Stack } from '@mui/material';
import { ComponentProps, ReactNode } from 'react';
import { useTypedSelector } from '../../../../../redux/hooks';
import OnyxSpeedDial from '../../../../basics/OnyxSpeedDial';
import { EditFieldset, EditFieldsetLegend } from '../SectionEditElements';

export function SectionContentRowContainer(props: {
	children: ReactNode | ReactNode[];
	alignItems?: 'center' | 'flex-start' | 'flex-end';
}) {
	const viewMode = useTypedSelector(store => store.courses.mode);
	const RowContainer = (
		<Stack
			direction={{ xs: 'column', md: 'row' }}
			alignItems={props.alignItems}
			gap={1}
			sx={{
				'> a': { flexBasis: '50%' },
				'> a > button': { flexDirection: 'column', padding: '.5rem' },
			}}
		>
			{props.children}
		</Stack>
	);

	return viewMode === 'observe' ? (
		RowContainer
	) : (
		<EditFieldsetRowContainerWrapper rowChildren={props.children}>{RowContainer}</EditFieldsetRowContainerWrapper>
	);
}

export default SectionContentRowContainer;

function EditFieldsetRowContainerWrapper(
	props: ComponentProps<typeof SectionContentRowContainer> & { rowChildren: ReactNode | ReactNode[] },
) {
	return (
		<EditFieldset
			styles={{
				borderStyle: 'dashed',
				paddingRight: !Array.isArray(props.rowChildren) || props.rowChildren.length <= 1 ? '250px' : undefined,
			}}
		>
			<EditFieldsetLegend>
				Строчный контейнер
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
						{ name: 'Скрыть элемент', icon: <VisibilityOffIcon color='error' /> },
						{ name: 'Дублировать элемент', icon: <ControlPointDuplicateIcon /> },
					]}
					containerSx={{ position: 'absolute', right: '-52px', top: '-7px' }}
				/>
			</EditFieldsetLegend>

			{props.children}

			{(!Array.isArray(props.rowChildren) || props.rowChildren.length <= 1) && (
				<Button
					variant='text'
					size='small'
					color='warning'
					sx={{
						position: 'absolute',
						top: 'calc(50% - 20px)',
						right: '0',
						fontSize: '.85rem',
					}}
				>
					<ControlPointIcon />
					&nbsp; Добавить элемент к строке
				</Button>
			)}
		</EditFieldset>
	);
}
