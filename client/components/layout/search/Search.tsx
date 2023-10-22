import ArrowOutwardOutlinedIcon from '@mui/icons-material/ArrowOutwardOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import SearchIcon from '@mui/icons-material/Search';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import SupportOutlinedIcon from '@mui/icons-material/SupportOutlined';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';
import {
	Box,
	Grid,
	IconButton,
	List,
	ListItem,
	ListItemButton,
	ListItemText,
	Stack,
	Tooltip,
	Typography,
} from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import InputBase from '@mui/material/InputBase';
import Paper from '@mui/material/Paper';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useState } from 'react';
import OnyxLink from '../../basics/OnyxLink';

export const Search = () => {
	const [open, setOpen] = useState(false);
	const theme = useTheme();
	const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	return (
		<>
			<Box>
				<Tooltip title='Поиск'>
					<IconButton sx={{ color: 'blackText.main' }} aria-label='search' onClick={handleClickOpen}>
						<SearchOutlinedIcon />
					</IconButton>
				</Tooltip>
			</Box>
			<Dialog maxWidth='lg' open={open} onClose={handleClose} aria-labelledby='responsive-dialog-title'>
				<DialogTitle id='responsive-dialog-title'>
					<Paper
						component='form'
						sx={{
							p: '2px 4px',
							display: 'flex',
							alignItems: 'center',
							width: {
								xs: '100%',
								md: '100%',
								lg: '100%',
								xl: '100%',
							},
						}}
					>
						<InputBase
							sx={{ ml: 1, flex: 1 }}
							placeholder='Поиск...'
							inputProps={{ 'aria-label': 'Поиск...' }}
						/>
						<IconButton type='button' sx={{ p: '10px' }} aria-label='search'>
							<SearchIcon />
						</IconButton>
						<Divider sx={{ height: 28, m: 0.5 }} orientation='vertical' />
						<IconButton color='primary' sx={{ p: '10px' }} aria-label='close' onClick={handleClose}>
							<CloseOutlinedIcon />
						</IconButton>
					</Paper>
				</DialogTitle>
				<DialogContent>
					<DialogContentText component={'span'} color={'black.main'}>
						<Typography color={'black.main'} variant='body1'>
							Последние запросы
						</Typography>
						<Stack sx={{ marginBottom: '10px' }}>
							<Stack component={'span'} sx={{ marginBottom: '40px' }}>
								<List dense sx={{ marginBottom: '10px' }}>
									<OnyxLink href={'/'} blockElement>
										<ListItem alignItems='center'>
											<ListItemButton>
												<ListItemText
													sx={{
														marginRight: '20px',
														color: 'primary.main',
													}}
													primary={
														<>
															<Stack
																component={'span'}
																direction={'row'}
																spacing={3}
																justifyContent={'space-between'}
																alignItems={'center'}
															>
																<Typography component={'span'}>
																	Курсы по метрологии
																</Typography>
																<HistoryOutlinedIcon />
															</Stack>
														</>
													}
												/>
											</ListItemButton>
										</ListItem>
									</OnyxLink>
									<OnyxLink href={'/'} blockElement>
										<ListItem alignItems='center'>
											<ListItemButton>
												<ListItemText
													sx={{
														marginRight: '20px',
														color: 'primary.main',
													}}
													primary={
														<>
															<Stack
																component={'span'}
																direction={'row'}
																spacing={3}
																justifyContent={'space-between'}
																alignItems={'center'}
															>
																<Typography component={'span'}>Успеваемость</Typography>
																<HistoryOutlinedIcon />
															</Stack>
														</>
													}
												/>
											</ListItemButton>
										</ListItem>
									</OnyxLink>
									<OnyxLink href={'/'} blockElement>
										<ListItem alignItems='center'>
											<ListItemButton>
												<ListItemText
													sx={{
														marginRight: '20px',
														color: 'primary.main',
													}}
													primary={
														<>
															<Stack
																component={'span'}
																direction={'row'}
																spacing={3}
																justifyContent={'space-between'}
																alignItems={'center'}
															>
																<Typography component={'span'}>
																	Как сбросить пароль
																</Typography>
																<HistoryOutlinedIcon />
															</Stack>
														</>
													}
												/>
											</ListItemButton>
										</ListItem>
									</OnyxLink>
								</List>
								<Divider sx={{ marginY: '5px' }} />
							</Stack>
							<Grid container>
								<Grid item xs={12} md={12} lg={12} xl={6}>
									<Typography variant='body1'>Справка</Typography>
									<List dense sx={{ marginBottom: '10px' }}>
										<OnyxLink href={'/'} blockElement>
											<ListItem alignItems='center'>
												<ListItemButton>
													<ListItemText
														sx={{
															marginRight: '20px',
															color: 'primary.main',
														}}
														primary={
															<>
																<Stack
																	component={'span'}
																	direction={'row'}
																	spacing={3}
																	justifyContent={'flex-start'}
																	alignItems={'center'}
																>
																	<HelpOutlineOutlinedIcon />
																	<Typography component={'span'}>
																		Как пересдать тестирование?
																	</Typography>
																</Stack>
															</>
														}
													/>
												</ListItemButton>
											</ListItem>
										</OnyxLink>
										<OnyxLink href={'/'} blockElement>
											<ListItem alignItems='center'>
												<ListItemButton>
													<ListItemText
														sx={{
															marginRight: '20px',
															color: 'primary.main',
														}}
														primary={
															<>
																<Stack
																	component={'span'}
																	direction={'row'}
																	spacing={3}
																	justifyContent={'flex-start'}
																	alignItems={'center'}
																>
																	<HelpOutlineOutlinedIcon />
																	<Typography component={'span'}>
																		Как связаться с преподавателем?
																	</Typography>
																</Stack>
															</>
														}
													/>
												</ListItemButton>
											</ListItem>
										</OnyxLink>
										<OnyxLink href={'/'} blockElement>
											<ListItem alignItems='center'>
												<ListItemButton>
													<ListItemText
														sx={{
															marginRight: '20px',
															color: 'primary.main',
														}}
														primary={
															<>
																<Stack
																	component={'span'}
																	direction={'row'}
																	spacing={3}
																	justifyContent={'flex-start'}
																	alignItems={'center'}
																>
																	<HelpOutlineOutlinedIcon />
																	<Typography component={'span'}>
																		Что если не открывается страница?
																	</Typography>
																</Stack>
															</>
														}
													/>
												</ListItemButton>
											</ListItem>
										</OnyxLink>
									</List>
								</Grid>
								<Grid item xs={12} md={12} lg={12} xl={6}>
									<Typography variant='body1'>Чаще всего ищут</Typography>
									<List dense sx={{ marginBottom: '10px' }}>
										<OnyxLink href={'/'} blockElement>
											<ListItem alignItems='center'>
												<ListItemButton>
													<ListItemText
														sx={{
															marginRight: '20px',
															color: 'primary.main',
														}}
														primary={
															<>
																<Stack
																	component={'span'}
																	direction={'row'}
																	spacing={3}
																	justifyContent={'space-between'}
																	alignItems={'center'}
																>
																	<Typography component={'span'}>
																		Как пересдать тестирование
																	</Typography>
																	<TrendingUpOutlinedIcon />
																</Stack>
															</>
														}
													/>
												</ListItemButton>
											</ListItem>
										</OnyxLink>
										<OnyxLink href={'/'} blockElement>
											<ListItem alignItems='center'>
												<ListItemButton>
													<ListItemText
														sx={{
															marginRight: '20px',
															color: 'primary.main',
														}}
														primary={
															<>
																<Stack
																	component={'span'}
																	direction={'row'}
																	spacing={3}
																	justifyContent={'space-between'}
																	alignItems={'center'}
																>
																	<Typography component={'span'}>
																		Как сменить email
																	</Typography>
																	<TrendingUpOutlinedIcon />
																</Stack>
															</>
														}
													/>
												</ListItemButton>
											</ListItem>
										</OnyxLink>
										<OnyxLink href={'/'} blockElement>
											<ListItem alignItems='center'>
												<ListItemButton>
													<ListItemText
														sx={{
															marginRight: '20px',
															color: 'primary.main',
														}}
														primary={
															<>
																<Stack
																	component={'span'}
																	direction={'row'}
																	spacing={3}
																	justifyContent={'space-between'}
																	alignItems={'center'}
																>
																	<Typography component={'span'}>
																		Как сбросить пароль
																	</Typography>
																	<TrendingUpOutlinedIcon />
																</Stack>
															</>
														}
													/>
												</ListItemButton>
											</ListItem>
										</OnyxLink>
									</List>
								</Grid>
								<Grid item xs={12} md={12} lg={12} xl={12}>
									<OnyxLink href={'/'} blockElement>
										<ListItem alignItems='center'>
											<ListItemButton>
												<ListItemText
													sx={{
														marginRight: '20px',
														color: 'primary.main',
													}}
													primary={
														<>
															<Stack
																component={'span'}
																direction={'row'}
																spacing={3}
																justifyContent={'space-between'}
																alignItems={'center'}
															>
																<SupportOutlinedIcon />
																<Typography component={'span'}>
																	Перейти в справочный центр
																</Typography>
																<ArrowOutwardOutlinedIcon />
															</Stack>
														</>
													}
												/>
											</ListItemButton>
										</ListItem>
									</OnyxLink>
								</Grid>
							</Grid>
						</Stack>
					</DialogContentText>
				</DialogContent>
			</Dialog>
		</>
	);
};
