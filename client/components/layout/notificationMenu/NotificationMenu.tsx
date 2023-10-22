import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import DraftsOutlinedIcon from '@mui/icons-material/DraftsOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import { Badge, Chip, ListItem, ListItemText } from '@mui/material';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { Stack } from '@mui/system';
import * as React from 'react';
import OnyxLink from '../../basics/OnyxLink';

export const NotificationMenu = () => {
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);
	
	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	return (
		<>
			<Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
				<Tooltip title='Уведомления'>
					<Badge badgeContent={12} variant={'dot'} color='error'>
						<IconButton
							onClick={handleClick}
							size='small'
							sx={{ color: 'blackText.main' }}
							aria-controls={open ? 'notification-menu' : undefined}
							aria-haspopup='true'
							aria-label='notification-menu'
							aria-expanded={open ? 'true' : undefined}
						>
							<NotificationsNoneOutlinedIcon />
						</IconButton>
					</Badge>
				</Tooltip>
			</Box>

			<Menu
				anchorEl={anchorEl}
				open={open}
				// sx={{
				// 	width: {
				// 		xs: '100%',
				// 		sm: '100%',
				// 		md: '100%',
				// 		lg: '50%',
				// 		xl: '40%',
				// 	},
				// }}
				PaperProps={{
					elevation: 0,
					sx: {
						position: 'fixed',
						top: '0',
						right: '0',
						height: '100vh',
						maxHeight: '100vh',
						overflow: 'auto',
						filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
						mt: 1.5,
						'& .IconButtom-root': {
							width: 132,
							height: 32,
							ml: -0.5,
							mr: 1,
						},
					},
				}}
				// transformOrigin={{ horizontal: 'right', vertical: 'top' }}
				// anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
			>
				<Box sx={{ position: 'relative' }}>
					<Box sx={{ padding: '20px' }}>
						<Stack spacing={3} direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
							<Stack direction={'row'} alignItems={'center'} spacing={3}>
								<Typography component={'span'} variant='body1'>
									Уведомления
								</Typography>
								<Badge badgeContent={12} color='error'></Badge>
							</Stack>

							<Box>
								<Tooltip title='Удалить все'>
									<IconButton>
										<DeleteOutlineOutlinedIcon />
									</IconButton>
								</Tooltip>
								<Tooltip title='Прочитать все'>
									<IconButton>
										<DraftsOutlinedIcon />
									</IconButton>
								</Tooltip>
								<Tooltip title='Закрыть'>
									<IconButton onClick={handleClose}>
										<CloseOutlinedIcon />
									</IconButton>
								</Tooltip>
							</Box>
						</Stack>
					</Box>
					<Divider />

					<Box>
						<OnyxLink blockElement href={'/'}>
							<MenuItem onClick={handleClose}>
								<ListItem alignItems='center'>
									<Badge
										anchorOrigin={{
											vertical: 'top',
											horizontal: 'left',
										}}
										badgeContent={1}
										variant={'dot'}
										color='error'
										sx={{ marginRight: '20px' }}
									></Badge>
									<ListItemText
										sx={{ marginRight: '20px' }}
										primary={
											<Stack
												component={'span'}
												direction={'row'}
												spacing={3}
												alignItems={'center'}
											>
												<Typography component={'span'}>Проверен отчет по заданию</Typography>
											</Stack>
										}
										secondary={
											<>
												<Stack component={'span'} sx={{ marginBottom: '10px' }} spacing={1}>
													<Typography component={'span'} noWrap variant='body2'>
														Ваш отчет по заданию «Производственная практика» был проверен.
													</Typography>
													<Typography component={'span'} variant='body2'>
														Сегодня в 09:30
													</Typography>
												</Stack>
												<Chip
													component={'span'}
													variant='outlined'
													color='info'
													size='small'
													label={'обучение'}
												/>
											</>
										}
									/>
								</ListItem>
							</MenuItem>
						</OnyxLink>
						<OnyxLink blockElement href={'/'}>
							<MenuItem onClick={handleClose}>
								<ListItem alignItems='center'>
									<Badge
										anchorOrigin={{
											vertical: 'top',
											horizontal: 'left',
										}}
										badgeContent={1}
										variant={'dot'}
										color='error'
										sx={{ marginRight: '20px' }}
									></Badge>
									<ListItemText
										sx={{ marginRight: '20px' }}
										primary={
											<>
												<Stack
													component={'span'}
													direction={'row'}
													spacing={3}
													alignItems={'center'}
												>
													<Typography component={'span'}>
														Проверен отчет по заданию
													</Typography>
												</Stack>
											</>
										}
										secondary={
											<>
												<Stack component={'span'} sx={{ marginBottom: '10px' }} spacing={1}>
													<Typography component={'span'} noWrap variant='body2'>
														Ваш отчет по заданию «Производственная практика» был проверен.
													</Typography>
													<Typography component={'span'} variant='body2'>
														Сегодня в 09:30
													</Typography>
												</Stack>
												<Chip
													component={'span'}
													variant='outlined'
													color='info'
													size='small'
													label={'обучение'}
												/>
											</>
										}
									/>
								</ListItem>
							</MenuItem>
						</OnyxLink>
						<OnyxLink blockElement href={'/'}>
							<MenuItem onClick={handleClose}>
								<ListItem alignItems='center'>
									<Badge
										anchorOrigin={{
											vertical: 'top',
											horizontal: 'left',
										}}
										badgeContent={1}
										variant={'dot'}
										color='error'
										sx={{ marginRight: '20px' }}
									></Badge>
									<ListItemText
										sx={{ marginRight: '20px' }}
										primary={
											<>
												<Stack
													component={'span'}
													direction={'row'}
													spacing={3}
													alignItems={'center'}
												>
													<Typography component={'span'}>Прямой эфир</Typography>
												</Stack>
											</>
										}
										secondary={
											<>
												<Stack component={'span'} sx={{ marginBottom: '10px' }} spacing={1}>
													<Typography component={'span'} noWrap variant='body2'>
														Начался вебинар на тему «Cовременные приборы учета газа».
													</Typography>
													<Typography component={'span'} variant='body2'>
														Сегодня в 09:30
													</Typography>
												</Stack>
												<Chip
													component={'span'}
													variant='outlined'
													color='warning'
													size='small'
													label={'вебинар'}
												/>
											</>
										}
									/>
								</ListItem>
							</MenuItem>
						</OnyxLink>
						<OnyxLink blockElement href={'/'}>
							<MenuItem onClick={handleClose}>
								<ListItem alignItems='center'>
									<Badge
										anchorOrigin={{
											vertical: 'top',
											horizontal: 'left',
										}}
										badgeContent={1}
										variant={'dot'}
										color='error'
										sx={{ marginRight: '20px' }}
									></Badge>
									<ListItemText
										sx={{ marginRight: '20px' }}
										primary={
											<>
												<Stack
													component={'span'}
													direction={'row'}
													spacing={3}
													alignItems={'center'}
												>
													<Typography component={'span'}>Успевемость обновлена</Typography>
												</Stack>
											</>
										}
										secondary={
											<>
												<Stack component={'span'} sx={{ marginBottom: '10px' }} spacing={1}>
													<Typography component={'span'} noWrap variant='body2'>
														Работы были проверены преподавателем и выставлены оценки
													</Typography>
													<Typography component={'span'} variant='body2'>
														Сегодня в 09:30
													</Typography>
												</Stack>
												<Chip
													component={'span'}
													variant='outlined'
													color='info'
													size='small'
													label={'обучение'}
												/>
											</>
										}
									/>
								</ListItem>
							</MenuItem>
						</OnyxLink>
						<OnyxLink blockElement href={'/'}>
							<MenuItem onClick={handleClose}>
								<ListItem alignItems='center'>
									<Badge
										anchorOrigin={{
											vertical: 'top',
											horizontal: 'left',
										}}
										badgeContent={1}
										variant={'dot'}
										color='secondary'
										sx={{ marginRight: '20px' }}
									></Badge>
									<ListItemText
										sx={{ marginRight: '20px' }}
										primary={
											<>
												<Stack
													component={'span'}
													direction={'row'}
													spacing={3}
													alignItems={'center'}
												>
													<Typography component={'span'} color={'secondary'}>
														Проверен отчет по заданию
													</Typography>
												</Stack>
											</>
										}
										secondary={
											<>
												<Stack component={'span'} sx={{ marginBottom: '10px' }} spacing={1}>
													<Typography
														component={'span'}
														noWrap
														variant='body2'
														color={'secondary'}
													>
														Ваш отчет по заданию «Производственная практика» был проверен.
													</Typography>
													<Typography component={'span'} variant='body2' color='secondary'>
														Сегодня в 09:30
													</Typography>
												</Stack>
												<Chip
													component={'span'}
													variant='outlined'
													color='secondary'
													size='small'
													label={'обучение'}
												/>
											</>
										}
									/>
								</ListItem>
							</MenuItem>
						</OnyxLink>
						<OnyxLink blockElement href={'/events'}>
							<MenuItem onClick={handleClose}>
								<ListItem alignItems='center'>
									<Badge
										anchorOrigin={{
											vertical: 'top',
											horizontal: 'left',
										}}
										badgeContent={1}
										variant={'dot'}
										color='error'
										sx={{ marginRight: '20px' }}
									></Badge>
									<ListItemText
										sx={{ marginRight: '20px' }}
										primary={
											<>
												<Stack
													component={'span'}
													direction={'row'}
													spacing={3}
													alignItems={'center'}
												>
													<Typography component={'span'}>Сроки обучения</Typography>
												</Stack>
											</>
										}
										secondary={
											<>
												<Stack component={'span'} sx={{ marginBottom: '10px' }} spacing={1}>
													<Typography component={'span'} noWrap variant='body2'>
														Обучение по программе «Метрология и стандартизация» завершается
														через 1 день
													</Typography>
													<Typography component={'span'} variant='body2'>
														Сегодня в 09:30
													</Typography>
												</Stack>
												<Chip
													component={'span'}
													variant='outlined'
													color='info'
													size='small'
													label={'обучение'}
												/>
											</>
										}
									/>
								</ListItem>
							</MenuItem>
						</OnyxLink>
						<OnyxLink blockElement href={'/'}>
							<MenuItem onClick={handleClose}>
								<ListItem alignItems='center'>
									<Badge
										anchorOrigin={{
											vertical: 'top',
											horizontal: 'left',
										}}
										badgeContent={1}
										variant={'dot'}
										color='error'
										sx={{ marginRight: '20px' }}
									></Badge>
									<ListItemText
										sx={{ marginRight: '20px' }}
										primary={
											<>
												<Stack
													component={'span'}
													direction={'row'}
													spacing={3}
													alignItems={'center'}
												>
													<Typography component={'span'}>
														Проверен отчет по заданию
													</Typography>
												</Stack>
											</>
										}
										secondary={
											<>
												<Stack component={'span'} sx={{ marginBottom: '10px' }} spacing={1}>
													<Typography component={'span'} noWrap variant='body2'>
														Ваш отчет по заданию «Производственная практика» был проверен.
													</Typography>
													<Typography component={'span'} variant='body2'>
														Сегодня в 09:30
													</Typography>
												</Stack>
												<Chip
													component={'span'}
													variant='outlined'
													color='info'
													size='small'
													label={'обучение'}
												/>
											</>
										}
									/>
								</ListItem>
							</MenuItem>
						</OnyxLink>
						<OnyxLink blockElement href={'/'}>
							<MenuItem onClick={handleClose}>
								<ListItem alignItems='center'>
									<Badge
										anchorOrigin={{
											vertical: 'top',
											horizontal: 'left',
										}}
										badgeContent={1}
										variant={'dot'}
										color='error'
										sx={{ marginRight: '20px' }}
									></Badge>
									<ListItemText
										sx={{ marginRight: '20px' }}
										primary={
											<>
												<Stack
													component={'span'}
													direction={'row'}
													spacing={3}
													alignItems={'center'}
												>
													<Typography component={'span'}>
														Проверен отчет по заданию
													</Typography>
												</Stack>
											</>
										}
										secondary={
											<>
												<Stack component={'span'} sx={{ marginBottom: '10px' }} spacing={1}>
													<Typography component={'span'} noWrap variant='body2'>
														Ваш отчет по заданию «Производственная практика» был проверен.
													</Typography>
													<Typography component={'span'} variant='body2'>
														Сегодня в 09:30
													</Typography>
												</Stack>
												<Chip
													component={'span'}
													variant='outlined'
													color='info'
													size='small'
													label={'обучение'}
												/>
											</>
										}
									/>
								</ListItem>
							</MenuItem>
						</OnyxLink>
					</Box>
				</Box>
			</Menu>
		</>
	);
};
