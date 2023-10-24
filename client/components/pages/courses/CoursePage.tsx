import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { Box, Button, Divider, Paper, Stack } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { OnyxTypography } from '../../basics/OnyxTypography';

const CoursePageComponent = (props: { courseData: any }) => {
	const router = useRouter();
	return (
		<Stack component='article' width='100%' direction='column' gap={2}>
			<Stack width='100%' alignItems='center' justifyContent='space-between' direction='row' gap={1}>
				<Box>
					<OnyxTypography
						text={props.courseData?.main?.title || 'Заголовок программы'}
						tpColor='primary'
						tpWeight='bold'
						tpSize='1.75rem'
					/>
					<OnyxTypography
						text={`Категория: ${props.courseData?.main?.category}` || 'Категория программы'}
						tpColor='secondary'
						tpSize='1rem'
						sx={{ marginTop: '.5rem' }}
					/>
					<OnyxTypography
						text={`Тип программы: ${props.courseData?.main?.type?.toLowerCase()}` || 'Тип программы'}
						tpColor='secondary'
						tpSize='1rem'
					/>

					<OnyxTypography
						lkHref={`https://umcmrg.ru/courses/${props.courseData.cid}`}
						lkProps={{ target: '_blank' }}
						sx={{ width: 'fit-content' }}
						ttNode='Информация по курсу'
						ttPlacement='bottom'
						boxWrapper
					>
						<Button variant='outlined' sx={{ marginTop: '.75rem', whiteSpace: 'nowrap' }}>
							Титульный лист программы
							<OpenInNewIcon color='primary' sx={{ fontSize: '1rem', marginLeft: '.5rem' }} />
						</Button>
					</OnyxTypography>
				</Box>

				<Box sx={{ display: { xs: 'none', md: 'block' } }}>
					<Image
						priority={true}
						src={props.courseData?.main?.previewScreenshot || 'xxx'}
						alt='Course poster'
						width={500}
						height={300}
					/>
				</Box>
			</Stack>

			<Divider sx={{ width: '90%', margin: '1rem auto 1.75rem' }} />
			<Stack
				direction='row'
				flexWrap='wrap'
				component='section'
				alignItems='center'
				justifyContent='center'
				gap={2}
			>
				<ScormPackageCard title='Интерактивная презентация. SSoft' />
				<ScormPackageCard
					title='Интерактивная презентация. MyOffice - Таблицы'
					href={`/courses/${router.query.cid}/scorm?path=conutif/story.html`}
				/>
				<ScormPackageCard
					title='Интерактивная презентация. Диспетчерская работа'
					href={`/courses/${router.query.cid}/scorm?path=dispatcher/story.html`}
				/>
			</Stack>
		</Stack>
	);
};

function ScormPackageCard(props: { title: string | React.ReactNode; href?: string }) {
	const router = useRouter();
	return (
		<Link href={props.href || `/courses/${router.query.cid}/scorm?path=ssoft/index.html`}>
			<Paper sx={{ borderRadius: '12px', width: 'fit-content' }}>
				<Button
					// variant='outlined'
					variant='contained'
					sx={{
						width: '300px',
						height: '100%',
						minHeight: '90px',
						borderRadius: '12px',
						padding: '1rem 2rem',
					}}
				>
					{props.title}
				</Button>
			</Paper>
		</Link>
	);
}

export default CoursePageComponent;
