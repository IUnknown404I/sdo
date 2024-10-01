import WarningIcon from '@mui/icons-material/Warning';
import { SxProps, Theme } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import * as React from 'react';
import { ComponentProps } from 'react';
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
	title?: string;
	fullWidth?: boolean;
	fullScreen?: boolean;
	icon?: React.ReactNode;
	text: string | React.ReactNode | React.ReactNode[];
	onClose: (confirmResult: boolean) => void;
	stopPropagation?: boolean;
	headerSx?: SxProps<Theme>;
	textProps?: ComponentProps<typeof OnyxTypography>;
	submitButtonProps?: ComponentProps<typeof Button>;
	cancelButtonProps?: ComponentProps<typeof Button>;
	renderDeps?: any[];
}

/**
 * @IUnknown404I Dialog-Modal panel for approving any actions. The component contains passed information and triggers submit\cancel functions that will fire the "onClick" function with user's choise as boolean value.
 * @param open: the component state;
 * @param title: Header's text;
 * @param icon: optional Element as icon. Will be displayed before header's text;
 * @param text: can be string (plain text) or as any Components. This is main content of the panel;
 * @param onClose: callback for the submit\cancel events that will pass to the callback user's choise as boolean;
 * @param stopPropagation: basic event-option for Click events;
 * @param headerSx: OnyxTypography options can be passed for the header element;
 * @param textProps: if text is string (plain text), can pass OnyxTypography options for the content element;
 * @param submitButtonProps: MUI Button options can be passed for according element;
 * @param cancelButtonProps: MUI Button options can be passed for according element;
 * @param renderDeps: dependecies array for memoizing the ConfirmDialog Component;
 * @returns Component as Modal-Dialog element with passed options.
 */
const OnyxAlertConfirmDialog = (props: OnyxAlertConfirmDialogI): JSX.Element => {
	return React.useMemo(
		() => (
			<Dialog
				aria-describedby='confirm-dialog'
				fullWidth={props.fullWidth}
				fullScreen={props.fullScreen}
				open={props.open}
				TransitionComponent={Transition}
				onClose={() => props.onClose(false)}
				onClick={e => (props.stopPropagation ? e.stopPropagation() : e)}
				PaperProps={{ style: { boxShadow: '0 0 10px 2px gray' } }}
				sx={props.fullWidth ? { '> div > div': { maxWidth: 'unset' } } : undefined}
			>
				<DialogTitle
					sx={{
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'flex-start',
						alignItems: 'center',
						gap: '.5rem',
						fontWeight: 'bold',
						color: theme => theme.palette.primary.main,
						borderBottom: '1px solid lightgray',
						...props.headerSx,
					}}
				>
					{props.icon || <WarningIcon sx={{ mr: 0.5 }} />} {props.title || 'Системное оповещение'}
				</DialogTitle>

				<DialogContent>
					{typeof props.text === 'string' ? (
						<DialogContentText sx={{ paddingTop: '.75rem' }}>
							<OnyxTypography {...props.textProps}>{props.text}</OnyxTypography>
						</DialogContentText>
					) : (
						props.text
					)}
				</DialogContent>

				<DialogActions>
					<Button
						{...props.submitButtonProps}
						size={props.submitButtonProps?.size ?? 'small'}
						variant={props.submitButtonProps?.variant ?? 'outlined'}
						onClick={props.submitButtonProps?.onClick ?? (() => props.onClose(true))}
					>
						Подтвердить
					</Button>
					<Button
						{...props.cancelButtonProps}
						size={props.cancelButtonProps?.size ?? 'small'}
						variant={props.cancelButtonProps?.variant ?? 'contained'}
						onClick={props.cancelButtonProps?.onClick ?? (() => props.onClose(false))}
					>
						Отменить
					</Button>
				</DialogActions>
			</Dialog>
		),
		[props.open, ...(props.renderDeps || [])],
	);
};

export default OnyxAlertConfirmDialog;
