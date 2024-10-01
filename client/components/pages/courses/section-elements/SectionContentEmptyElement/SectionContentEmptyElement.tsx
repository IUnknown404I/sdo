import { Box, Divider } from '@mui/material';
import React, { ComponentProps, ReactNode } from 'react';
import { useTypedSelector } from '../../../../../redux/hooks';
import { selectUser, SystemRolesOptions } from '../../../../../redux/slices/user';
import { OnyxTypography } from '../../../../basics/OnyxTypography';
import { CourseSectionEmptyDividerI } from '../../courseItemsTypes';
import SectionContentSkeleton from '../SectionContentSkeleton';
import { EditFieldset, EditFieldsetLegend, SectionEditCofigButton } from '../SectionEditElements';
import { EditMovementSubDial, ManageOptionsSubDial } from '../edit-sub-dials/edit-sub-dials';

export function SectionContentEmptyElement(
	props: Omit<CourseSectionEmptyDividerI, 'type' | 'subType'> & { skeleton?: boolean },
) {
	const userData = useTypedSelector(selectUser);
	const viewMode = useTypedSelector(store => store.courses.mode);

	const ContentEmptyDivider = (
		<Divider
			sx={{
				width: '0px',
				margin: '1.5rem 0',
				display:
					SystemRolesOptions[userData._systemRole].accessLevel < 1 && !!props.hide && viewMode === 'observe'
						? 'none'
						: '',
			}}
		/>
	);

	return !!props.skeleton ? (
		<SectionContentSkeleton forcedSkeletonType='empty' />
	) : viewMode === 'observe' ? (
		ContentEmptyDivider
	) : (
		<EditFieldsetDividerWrapper {...props}>{ContentEmptyDivider}</EditFieldsetDividerWrapper>
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
					{!!props.hide && (
						<OnyxTypography
							tpSize='.7rem'
							component='span'
							tpColor='warning'
							sx={{
								padding: '1px .25rem',
								marginRight: '.25rem',
								borderRadius: '6px',
								border: theme => `1px solid ${theme.palette.warning.dark}`,
							}}
						>
							Скрытый элемент
						</OnyxTypography>
					)}
					Пустой блок
					<SectionEditCofigButton configState={configState} setConfigState={setConfigState} />
					<EditMovementSubDial
						orderNumber={1}
						state={configState}
						csiid={props.csiid}
						parentCsiid={props.parentCsiid}
						excludeOutOfContainer={!props.parentCsiid}
					/>
					<ManageOptionsSubDial orderNumber={2} state={configState} hide={props.hide} csiid={props.csiid} />
				</EditFieldsetLegend>

				{props.children}
			</EditFieldset>
		</Box>
	);
}
