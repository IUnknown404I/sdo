import { Box, Divider, SxProps } from '@mui/material';
import React, { ComponentProps, ReactNode } from 'react';
import { useTypedSelector } from '../../../../../redux/hooks';
import { selectUser, SystemRolesOptions } from '../../../../../redux/slices/user';
import { OnyxTypography } from '../../../../basics/OnyxTypography';
import { CourseSectionDividerI } from '../../courseItemsTypes';
import SectionContentSkeleton from '../SectionContentSkeleton';
import { EditFieldset, EditFieldsetLegend, SectionEditCofigButton } from '../SectionEditElements';
import { EditMovementSubDial, ManageOptionsSubDial } from '../edit-sub-dials/edit-sub-dials';

function SectionContentDivider(
	props: Omit<CourseSectionDividerI, 'type' | 'subType'> & { sx?: SxProps; skeleton?: boolean },
) {
	const userData = useTypedSelector(selectUser);
	const viewMode = useTypedSelector(store => store.courses.mode);

	const ContentDivider = (
		<Divider
			sx={{
				width: '90%',
				margin: '1rem auto',
				...props.sx,
				display:
					SystemRolesOptions[userData._systemRole].accessLevel < 1 && !!props.hide && viewMode === 'observe'
						? 'none'
						: '',
			}}
		/>
	);

	return !!props.skeleton ? (
		<SectionContentSkeleton forcedSkeletonType='divider' />
	) : viewMode === 'observe' ? (
		ContentDivider
	) : (
		<EditFieldsetDividerWrapper {...props}>{ContentDivider}</EditFieldsetDividerWrapper>
	);
}

export default SectionContentDivider;

function EditFieldsetDividerWrapper(props: ComponentProps<typeof SectionContentDivider> & { children: ReactNode }) {
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
					Разделитель
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
