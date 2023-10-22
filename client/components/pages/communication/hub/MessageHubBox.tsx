import { Box, Stack } from '@mui/material';
import { OnyxTypography } from '../../../basics/OnyxTypography';

interface MessageHubBoxProps {
	colorMode: string;
	messages: { name: string; time: string; message: string }[];
}

function MessageHubBox(props: MessageHubBoxProps) {
	const getTpColor = (nameOption: Pick<(typeof props.messages)[0], 'name'>) =>
		nameOption.name === 'Администратор'
			? props.colorMode === 'light'
				? '#cc00cc'
				: '#f984e5'
			: nameOption.name === 'Преподаватель'
			? props.colorMode === 'light'
				? 'darkorange'
				: 'orange'
			: 'secondary';

	return !!props.messages == null || props.messages.length == null ? (
		<OnyxTypography tpColor='secondary' tpSize='1rem'>
			В этом диалоге ещё не было сообщений!
		</OnyxTypography>
	) : (
		<Stack
			position='relative'
			marginTop='-1rem'
			gap={1}
			maxHeight='450px'
			height={props.messages.length > 0 ? '450px' : ''}
			paddingRight='.2rem'
			sx={{
				overflowY: 'auto',
				'&::-webkit-scrollbar': { width: '3px' },
			}}
		>
			<OnyxTypography tpColor='secondary' tpSize='.85rem' boxWrapper>
				Последние сообщения:
			</OnyxTypography>

			{props.messages.map((message, index) => (
				<Stack
					key={index}
					direction='column'
					width='100%'
					alignItems={message.name === 'Вы' ? 'flex-end' : 'flex-start'}
					justifyContent={message.name === 'Вы' ? 'flex-end' : 'flex-start'}
				>
					<Box
						sx={{
							backgroundColor:
								message.name === 'Вы'
									? theme => (theme.palette.mode === 'light' ? '#96efc9' : '#309472')
									: theme => (theme.palette.mode === 'light' ? '#c4ecff' : '#6464e1'),
							width: 'fit-content',
							minWidth: '300px',
							borderRadius: '12px',
							padding: '.5rem .75rem',
						}}
					>
						<Stack
							direction='row'
							justifyContent='space-between'
							gap={1}
							alignItems='center'
							marginBottom='.25rem'
						>
							<OnyxTypography
								tpSize='.85rem'
								sx={{
									fontStyle:
										message.name === 'Вы' || message.name === 'Администратор'
											? 'italic'
											: undefined,
								}}
								tpColor={getTpColor({ name: message.name })}
							>
								{message.name}
							</OnyxTypography>
							<OnyxTypography
								tpSize='.85rem'
								sx={{ fontStyle: 'italic' }}
								tpColor={getTpColor({ name: message.name })}
							>
								{message.time}
							</OnyxTypography>
						</Stack>
						
						<p>{message.message}</p>
					</Box>
				</Stack>
			))}
		</Stack>
	);
}

export default MessageHubBox;
