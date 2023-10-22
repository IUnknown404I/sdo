import Box from '@mui/material/Box';

const RightGridComponent = (props: { imgUrl?: string }) => {
	return (
		<Box
			sx={{
				position: 'relative',
				minWidth: '100%',
				height: '100%',
				display: {
					xs: 'none',
					sm: 'none',
					md: 'none',
					lg: 'flex',
				},
				flexDirection: 'column',
				justifyContent: 'center',
				alignItems: 'center',
				padding: '1rem',
				backgroundImage: 'url(/images/utility/cellsBack.svg)',
				backgroundRepeat: 'no-repeat',
				backgroundPosition: 'center',
				backgroundSize: '800%',
				img: {
					maxWidth: '80%',
					maxHeight: '80%',
				},
			}}
		>
			{props.imgUrl && <img src={props.imgUrl} alt='Side help image' width={600} height={650} />}
		</Box>
	);
};

export default RightGridComponent;
