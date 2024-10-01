import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import HighlightOffRoundedIcon from '@mui/icons-material/HighlightOffRounded';
import { Divider, Grid, Stack, Zoom } from '@mui/material';
import Button from '@mui/material/Button';
import React from 'react';
import OnyxFormControl from '../../../../parts/forms/OnyxFormControl';

interface ProfileFormI {
	formik: any;
	Loader: JSX.Element;
	loadingState: boolean;
	onCancelEditingHandler?: () => void;
}

const ProfileForm = (props: ProfileFormI) => {
	const [editMode, setEditMode] = React.useState<boolean>(false);

	React.useEffect(() => setEditMode(false), [props.loadingState]);

	return (
		<Grid
			container
			component='form'
			onSubmit={props.formik.handleSubmit}
			sx={{ height: 'calc(100% - 40px)', maxHeight: 'calc(100% - 40px)' }}
			spacing={2}
		>
			<Grid item xs={12} lg={12}>
				<Stack sx={{ width: '100%' }} justifyContent='flex-end' alignItems='flex-end'>
					<Button
						size={'small'}
						startIcon={editMode ? <HighlightOffRoundedIcon /> : <CreateOutlinedIcon />}
						onClick={() => toggleEditMode()}
						sx={{
							borderRadius: '20px',
							paddingX: '20px',
						}}
					>
						{editMode ? 'Отменить' : 'Изменить'}
					</Button>
				</Stack>
			</Grid>

			<Grid item xs={12} lg={6}>
				<OnyxFormControl
					formik={props.formik}
					label='Ваша фамилия'
					attribute='surname'
					type='text'
					Loader={props.Loader}
					loadingState={props.loadingState}
					inputProps={{ disabled: !editMode, required: true }}
				/>
			</Grid>
			<Grid item xs={12} lg={6}>
				<OnyxFormControl
					formik={props.formik}
					label='Ваше имя'
					attribute='name'
					type='text'
					Loader={props.Loader}
					loadingState={props.loadingState}
					inputProps={{ disabled: !editMode, required: true }}
				/>
			</Grid>
			<Divider sx={{ width: '100%', margin: '1rem 0 .25rem' }} />

			<Grid item xs={12} lg={6}>
				<OnyxFormControl
					formik={props.formik}
					label='Занимаемая должность'
					attribute='position'
					type='text'
					Loader={props.Loader}
					loadingState={props.loadingState}
					inputProps={{ disabled: !editMode }}
				/>
			</Grid>
			<Grid item xs={12} lg={6}>
				<OnyxFormControl
					formik={props.formik}
					label='Номер телефона'
					attribute='tel'
					type='tel'
					Loader={props.Loader}
					loadingState={props.loadingState}
					inputProps={{ disabled: !editMode }}
				/>
			</Grid>

			<Grid item xs={12} lg={6}>
				<OnyxFormControl
					formik={props.formik}
					label='Название вашей компании'
					attribute='company'
					type='text'
					Loader={props.Loader}
					loadingState={props.loadingState}
					inputProps={{ disabled: !editMode }}
				/>
			</Grid>
			<Grid item xs={12} lg={6}>
				<OnyxFormControl
					formik={props.formik}
					label='Название вашего населенного пункта'
					attribute='city'
					type='text'
					Loader={props.Loader}
					loadingState={props.loadingState}
					inputProps={{ disabled: !editMode }}
				/>
			</Grid>
			<Divider sx={{ width: '100%', margin: '1rem' }} />

			<Zoom in={editMode}>
				<Stack flexDirection='row' justifyContent='center' width='100%'>
					<Button
						variant='contained'
						size='medium'
						sx={{ width: '85%' }}
						type='submit'
						disabled={props.loadingState || !editMode}
					>
						Изменить личные данные {props.Loader}
					</Button>
				</Stack>
			</Zoom>
		</Grid>
	);

	function toggleEditMode() {
		if (editMode) {
			if (!!props.onCancelEditingHandler) props.onCancelEditingHandler();
			else props.formik.resetForm();
		}
		setEditMode(prev => !prev);
	}
};

export default ProfileForm;
