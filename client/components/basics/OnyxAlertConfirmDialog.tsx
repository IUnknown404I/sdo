import WarningIcon from '@mui/icons-material/Warning';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import * as React from 'react';
import { OnyxTypography } from './OnyxTypography';

const Transition = React.forwardRef(function Transition(
	props: TransitionProps & {
		children: React.ReactElement<any, any>;
	},
	ref: React.Ref<unknown>,
) {
	return <Slide direction='up' ref={ref} {...props} />;
});

interface OnyxAlertConfirmDialogI {
	open: boolean;
	onClose: Function;
	text: string | JSX.Element;
}

const OnyxAlertConfirmDialog = (props: OnyxAlertConfirmDialogI) => {
	const handleClose = (agree?: boolean) => {
		agree ? props.onClose(true) : props.onClose();
	};

	return (
		<Dialog
			open={props.open}
			TransitionComponent={Transition}
			onClose={() => {
				handleClose();
			}}
			PaperProps={{ style: { boxShadow: '0 0 10px 2px gray' } }}
			aria-describedby='alert-dialog-panel'
		>
			<DialogTitle
				sx={{
					fontWeight: 'bold',
					color: 'utility.$mrg_lightblue',
					borderBottom: '1px solid lightgray',
				}}
			>
				<WarningIcon sx={{ mr: 0.5 }} /> Системное оповещение
			</DialogTitle>
			<DialogContent>
				<DialogContentText sx={{ paddingTop: '.75rem' }}>
					<OnyxTypography>{props.text}</OnyxTypography>
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button
					size='small'
					variant='outlined'
					onClick={() => {
						handleClose(true);
					}}
				>
					Подтвердить
				</Button>
				<Button
					size='small'
					variant='contained'
					onClick={() => {
						handleClose();
					}}
				>
					Отменить
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default OnyxAlertConfirmDialog;