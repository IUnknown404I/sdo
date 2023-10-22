import CloseIcon from '@mui/icons-material/Close';
import { Backdrop, Fade, Modal, SxProps, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import { OnyxTypography } from './OnyxTypography';

export interface OnyxAlertModalI {
	id?: string;
	children: (JSX.Element | string | boolean) | (string | JSX.Element | boolean)[];
	state: boolean;
	setState: Function;
	title: string;
	width?: string;
	fullWidth?: boolean;
	uncontrolled?: boolean;
	disableButton?: undefined | true | { buttonText: string };
	hideButtonOnOpen?: boolean;
	disableCloseIcon?: boolean;
	disableCloseButton?: boolean;
	hideFooter?: boolean;
	keepMounted?: boolean;
	sx?: SxProps;
}

/**
 * @IUnknown404I return modal pane for making alerts and notifications.
 * @param props: { state: boolean, setState: Function, title: string, children: JSX.Element | JSX.Element[], uncontrolled?: boolean, disableButton?: undefined | true | { buttonText: string }, hideButtonOnOpen?: boolean, disableCloseIcon?: boolean, disableCloseButton?: boolean, hideFooter?: boolean }
 - uncontrolled mode:  any clicks out of modal pane wouldn't close it;
 - disableButton:      will return only ModalPane without opening button;
 - hideButtonOnOpen:   will return both button and modal with invisible mode for button while the modal is on the screen;
 - disableCloseIcon:   disabling the closing icon in the top-right corner of the modal (on the xs breakpoint will be forcibly hidden);
 - disableCloseButton: disabling the closing button in the footer (on the xs breakpoint will be forcibly displayed if footer is not disabled);
 - hideFooter:         disabling the whole footer. 
 * @returns Modal Pane as dismounted React.Element.
 */
const OnyxAlertModal = (props: OnyxAlertModalI) => {
	const handleOpen = () => props.setState(true);
	const handleClose = () => props.setState(false);

	const ModalTitle = (payload: { title: string; inlineMode?: boolean }): JSX.Element => {
		return (
			<Typography
				variant='h5'
				fontWeight='bold'
				component='h2'
				color='primary'
				marginTop={payload.inlineMode ? '' : '-.5rem'}
				sx={{ fontSize: { xs: '1.5rem', sm: '1.75rem' } }}
			>
				{payload.title}
			</Typography>
		);
	};

	return (
		<>
			{props.disableButton === true || props.disableButton === undefined ? (
				<></>
			) : (
				<Button onClick={handleOpen} id={props.id ? `${props.id}-open-button` : undefined}>
					{props.disableButton.buttonText}
				</Button>
			)}

			<Modal
				id={props.id}
				aria-describedby='transition-modal-panel'
				open={props.state}
				onClose={props.uncontrolled ? undefined : handleClose}
				closeAfterTransition
				keepMounted={props.keepMounted}
				slots={{ backdrop: Backdrop }}
				slotProps={{ backdrop: { timeout: 750 } }}
				BackdropComponent={Backdrop}
				BackdropProps={{
					timeout: 750,
				}}
				sx={props.sx}
			>
				<Fade in={props.state}>
					<Box
						sx={{
							position: 'absolute',
							top: '50%',
							left: '50%',
							transform: 'translate(-50%, -50%)',
							width: props.fullWidth ? 'auto' : props.width || 600,
							minWidth: { xs: 'min(95vw)', sm: '' },
							maxWidth: '98vw',
							maxHeight: '98vh',
							bgcolor: theme => (theme.palette.mode === 'light' ? 'background.paper' : '#162433'), //#0a1929
							border: theme =>
								theme.palette.mode === 'light' ? '2px solid #cecece' : '2px solid #2c394f',
							borderRadius: '10px',
							padding: { xs: '2rem 1rem', sm: '2rem' },
							display: 'flex',
							flexDirection: 'column',
							gap: '.75rem',
							'-webkit-box-shadow': '0px 0px 46px 9px rgba(130, 149, 163, 0.2)',
							'-moz-box-shadow': '0px 0px 46px 9px rgba(130, 149, 163, 0.2)',
							boxShadow: '0px 0px 46px 9px rgba(130, 149, 163, 0.2)',
							overflow: 'hidden',
							overflowY: 'auto',
						}}
					>
						{props.disableCloseIcon ? (
							<>
								<ModalTitle title={props.title} />
								<Divider />
							</>
						) : (
							<>
								<Box
									sx={{
										display: 'flex',
										flexDirection: 'row',
										gap: '.5rem',
										width: '100%',
										justifyContent: 'space-between',
										alignItems: 'center',
									}}
								>
									<ModalTitle title={props.title} />
									<OnyxTypography ttNode='Закрыть окно' ttFollow={false} ttPlacement='left'>
										<CloseIcon
											aria-label='modal-close-icon'
											color='primary'
											cursor='pointer'
											sx={{
												transition: 'all .3s',
												':hover': { transform: 'scale(1.2)' },
												display: { xs: 'none', sm: 'inline-block' },
											}}
											onClick={() => {
												props.setState(false);
											}}
										/>
									</OnyxTypography>
								</Box>
								<Divider />
							</>
						)}

						<Box
							id='modal-description'
							sx={{
								boxWidth: '100%',
								boxAlign: 'center',
								fontSize: '1.25rem',
								color: theme => (theme.palette.mode === 'light' ? '' : 'white'),
							}}
						>
							{Array.isArray(props.children) ? props.children.map(el => <>{el}</>) : props.children}
						</Box>

						<Box
							id={props.hideFooter ? 'hided-footer' : 'classic-footer'}
							sx={{
								width: '100%',
								display: {
									xs: props.hideFooter ? 'none' : 'flex',
									sm: props.disableCloseButton ? 'none' : props.hideFooter ? 'none' : 'flex',
								},
								justifyContent: 'flex-end',
								margin: '.15rem 0 -.75rem',
							}}
						>
							<Button
								id='modal-close-button'
								variant='text'
								size='large'
								onClick={() => {
									props.setState(false);
								}}
							>
								Закрыть
							</Button>
						</Box>
					</Box>
				</Fade>
			</Modal>
		</>
	);
};

export default OnyxAlertModal;
