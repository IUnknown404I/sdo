import { Stack } from '@mui/material';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { notification } from '../../../../components/utils/notifications/Notification';
import CoursesLayout from '../../../../layout/CoursesLayout';
import { useTypedSelector } from '../../../../redux/hooks';
import { checkProductionMode } from '../../../../utils/utilityFunctions';

const CoursePage = () => {
	const router = useRouter();
	const axiosInstance = useTypedSelector(store => store.axiosInstance.instance);

	if (!router.query['path']) errorAction('Не указан путь к запрашиваемому пакету!');

	axiosInstance
		.get(`${process.env.NEXT_PUBLIC_SERVER}/courses/scorm/${router.query.path}/echo`)
		.catch(() => errorAction('Запрашиваемый пакет не был найден в хранилище!'));

	return (
		<>
			<Head>
				<title>Интерактивная </title>
				<meta name='description' content='Программа обучения' />
				<meta name='robots' content='index, follow' />
			</Head>

			<CoursesLayout>
				<Stack
					component='section'
					alignItems='center'
					justifyContent='center'
					sx={{
						'> iframe': {
							width: '100%',
							minHeight: '87vh',
							borderRadius: '10px',
						},
					}}
				>
					<iframe src={`${`${process.env.NEXT_PUBLIC_SERVER}/courses/scorm/${router.query.path}`}`} />
				</Stack>
			</CoursesLayout>
		</>
	);

	function errorAction(message: string) {
		router.push(`/courses/${router.query.cid}`);
		notification({ message: message, type: 'warning', autoClose: 7000 });
	}
};

export const getServerSideProps = async (context: any) => {
	return {
		props: {},
	};
};

export default CoursePage;
