import LightbulbIcon from '@mui/icons-material/Lightbulb';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import { Stack } from '@mui/material';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { LegacyRef } from 'react';
import { notification } from '../../../../../components/utils/notifications/Notification';
import CoursesLayout from '../../../../../layout/CoursesLayout';
import { useTypedSelector } from '../../../../../redux/hooks';

/**
 * @IUnknown404I This is inner page for the SCORM-packages displaying.
 * @returns The page with iframe of the requested package, pinged and delivered from the server.
 */
const ScormPage = () => {
	const router = useRouter();
	const iframeRef = React.useRef<HTMLIFrameElement>();
	const axiosInstance = useTypedSelector(store => store.axiosInstance.instance);

	if (!router.query['path'] || !router.query.cid) errorAction('Не указан путь к запрашиваемому пакету!');

	// ping the package existance
	axiosInstance
		.get(`${process.env.NEXT_PUBLIC_SERVER}/courses/scorm/${router.query.path}/echo`)
		.catch(() => errorAction('Запрашиваемый пакет не был найден в хранилище!'));

	React.useEffect(() => {
		if (!iframeRef.current) return;
		try {
			// try-catch block used for prevent the outer-domain error
			const file = document.createElement('link');
			file.setAttribute('rel', 'stylesheet');
			file.setAttribute('type', 'text/css');
			file.setAttribute('href', 'styles/courses/iframe.css');

			iframeRef.current?.contentWindow?.document.head.appendChild(file);
		} catch (err) {}
	}, [iframeRef.current]);

	return (
		<>
			<Head>
				<title>Интерактивная презентация</title>
				<meta name='description' content='Программа обучения' />
				<meta name='robots' content='noindex, nofollow' />
			</Head>

			<CoursesLayout
				backButton
				progressValue={30}
				breadcrumbsCourseContent={[
					{
						href: `/courses/${router.query.cid}/${router.query.csid}`,
						element: 'Раздел',
						icon: <LightbulbIcon />,
					},
					{
						element: 'Интерактивная презентация',
						icon: <OndemandVideoIcon />,
					},
				]}
			>
				<Stack
					component='section'
					direction='column'
					alignItems='center'
					justifyContent='center'
					sx={{
						'> iframe': {
							width: '100%',
							minHeight: '87vh',
							borderRadius: '10px',
						},
					}}
					gap={1}
				>
					<iframe
						ref={iframeRef as LegacyRef<HTMLIFrameElement>}
						src={`${process.env.NEXT_PUBLIC_SERVER}/courses/scorm/${router.query.path}`}
						style={{ border: 'unset', backgroundColor: '#eceff1' }}
					/>
				</Stack>
			</CoursesLayout>
		</>
	);

	function errorAction(message: string) {
		router.back();
		notification({ message: message, type: 'warning', autoClose: 7000 });
	}
};

export const getServerSideProps = async (context: any) => {
	return {
		props: {},
	};
};

export default ScormPage;
