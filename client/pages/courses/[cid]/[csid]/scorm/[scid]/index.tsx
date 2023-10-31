import LightbulbIcon from '@mui/icons-material/Lightbulb';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import SecurityIcon from '@mui/icons-material/Security';
import SettingsIcon from '@mui/icons-material/Settings';
import { Stack } from '@mui/material';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { LegacyRef } from 'react';
import OnyxSpeedDial from '../../../../../../components/basics/OnyxSpeedDial';
import ModernLoader from '../../../../../../components/utils/loaders/ModernLoader';
import { notification } from '../../../../../../components/utils/notifications/Notification';
import CoursesLayout from '../../../../../../layout/CoursesLayout';
import { rtkApi } from '../../../../../../redux/api';
import { useTypedSelector } from '../../../../../../redux/hooks';

/**
 * @IUnknown404I This is inner page for the SCORM-packages displaying.
 * @returns The page with iframe of the requested package, pinged and delivered from the server.
 */
const ScormPage = () => {
	const router = useRouter();
	const iframeRef = React.useRef<HTMLIFrameElement>();
	const axiosInstance = useTypedSelector(store => store.axiosInstance.instance);

	const [verified, setVerified] = React.useState<boolean>(false);
	const { data: scormData, fulfilledTimeStamp } = rtkApi.useScormDataQuery((router.query.scid as string) || '');

	// check for package existance & if package is unpacked --> unpack it before (can be unpacked on-hot also)
	React.useMemo(
		() =>
			axiosInstance
				.get(`${process.env.NEXT_PUBLIC_SERVER}/scorms/${router.query.scid}/echo`)
				.then(() => setVerified(true))
				.catch(() => errorAction('Запрашиваемый пакет не был найден в хранилище!')),
		[],
	);

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
				backButtonprops={{ href: `/courses/${router.query.cid}/${router.query.csid}` }}
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
					width='100%'
					component='section'
					direction='column'
					alignItems='center'
					justifyContent='center'
					sx={{
						minHeight: '300px',
						'> iframe': {
							width: '100%',
							minHeight: '87vh',
							borderRadius: '10px',
						},
					}}
					gap={1}
				>
					{!verified ? (
						<ModernLoader tripleLoadersMode loading />
					) : (
						<iframe
							ref={iframeRef as LegacyRef<HTMLIFrameElement>}
							style={{ border: 'unset', backgroundColor: '#eceff1' }}
							src={`${process.env.NEXT_PUBLIC_SERVER}/scorms/${router.query.scid}`}
						/>
					)}
				</Stack>

				<OnyxSpeedDial
					ariaLabel='Modify Tools'
					items={[
						{
							icon: <SettingsIcon />,
							name: 'Настройки Scorm-пакета',
							href: `/courses/${router.query.cid}/${router.query.csid}/scorm/${router.query.scid}/config`,
						},
						{
							icon: <SecurityIcon />,
							name: 'Ограничения Scorm-пакета',
							href: `/courses/${router.query.cid}/${router.query.csid}/scorm/${router.query.scid}/config/security`,
						},
					]}
				/>
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
