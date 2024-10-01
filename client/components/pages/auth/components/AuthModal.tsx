import CloseIcon from '@mui/icons-material/Close';
import { Backdrop, Fade, Modal, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import { OnyxTypography } from '../../../basics/OnyxTypography';

export interface AuthModalI {
	state: boolean;
	setState: Function;
	title: string;
	children: React.ReactElement | React.ReactElement[];
	uncontrolled?: boolean;
	disableButton?: undefined | true | { buttonText: string };
	hideButtonOnOpen?: boolean;
	disableCloseIcon?: boolean;
	disableCloseButton?: boolean;
	hideFooter?: boolean;
}

/**
 * @IUnknown404I return Auth warning modal pane.
 * @param props: A config Object:
 - uncontrolled mode:  any clicks out of modal pane wouldn't close it;
 - disableButton:      will return only ModalPane without opening button;
 - hideButtonOnOpen:   will return both button and modal with invisible mode for button while the modal is on the screen;
 - disableCloseIcon:   disabling the closing icon in the top-right corner of the modal (on the xs breakpoint will be forcibly hidden);
 - disableCloseButton: disabling the closing button in the footer (on the xs breakpoint will be forcibly displayed if footer is not disabled);
 - hideFooter:         disabling the whole footer. 
 * @returns Modal Pane as dismounted React.Element.
 */
const AuthModal = (props: AuthModalI) => {
	const handleOpen = () => props.setState(true);
	const handleClose = () => props.setState(false);

	const ModalTitle = (payload: { title: string; inlineMode?: boolean }): JSX.Element => {
		return (
			<Typography
				id='modal-title'
				variant='h5'
				fontSize='1.75rem'
				fontWeight='bold'
				component='h2'
				color='primary'
				marginTop={payload.inlineMode ? '' : '-.5rem'}
				sx={payload.inlineMode ? {} : {}}
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
				<Button onClick={handleOpen} id='button-text'>
					{props.disableButton.buttonText}
				</Button>
			)}

			<Modal
				aria-labelledby='transition-modal-title'
				aria-describedby='transition-modal-description'
				open={props.state}
				onClose={props.uncontrolled ? undefined : handleClose}
				closeAfterTransition
				BackdropComponent={Backdrop}
				BackdropProps={{
					timeout: 750,
				}}
			>
				<Fade in={props.state}>
					<Box
						sx={{
							position: 'absolute',
							top: '50%',
							left: '50%',
							transform: 'translate(-50%, -50%)',
							width: 600,
							maxWidth: '98vw',
							bgcolor: theme => (theme.palette.mode === 'light' ? 'background.paper' : '#162433'), //#0a1929
							border: theme =>
								theme.palette.mode === 'light' ? '2px solid #cecece' : '2px solid #2c394f',
							borderRadius: '10px',
							p: 4,
							display: 'flex',
							flexDirection: 'column',
							gap: '.75rem',
							'-webkit-box-shadow': '0px 0px 46px 9px rgba(130, 149, 163, 0.2)',
							'-moz-box-shadow': '0px 0px 46px 9px rgba(130, 149, 163, 0.2)',
							boxShadow: '0px 0px 46px 9px rgba(130, 149, 163, 0.2)',
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
											aria-label='close-icon'
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

						<Typography
							id='modal-description'
							sx={{
								mt: 2,
								fontSize: '1.25rem',
								color: theme => (theme.palette.mode === 'light' ? '' : 'white'),
							}}
						>
							{props.children}
						</Typography>

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
								id='close-button'
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

export default AuthModal;
