import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import AutoFixOffIcon from '@mui/icons-material/AutoFixOff';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import PrintIcon from '@mui/icons-material/Print';
import SettingsIcon from '@mui/icons-material/Settings';
import { Button, Stack } from '@mui/material';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';
import OnyxLink from '../../../../components/basics/OnyxLink';
import OnyxSpeedDial from '../../../../components/basics/OnyxSpeedDial';
import { OnyxTypography } from '../../../../components/basics/OnyxTypography';
import SectionContentBlock from '../../../../components/pages/courses/section-elements/SectionContentBlock';
import { SectionContentPagination } from '../../../../components/pages/courses/section-elements/SectionItems';
import ModernLoader from '../../../../components/utils/loaders/ModernLoader';
import { notification } from '../../../../components/utils/notifications/Notification';
import CoursesLayout from '../../../../layout/CoursesLayout';
import { OnyxApiErrorResponseType, rtkApi } from '../../../../redux/api';
import { useTypedDispatch, useTypedSelector } from '../../../../redux/hooks';
import { changeCourseViewMode } from '../../../../redux/slices/courses';
import { SystemRolesOptions, selectUser } from '../../../../redux/slices/user';

const CourseSectionPage = () => {
	const router = useRouter();
	const dispatcher = useTypedDispatch();

	const userData = useTypedSelector(selectUser);
	const viewMode = useTypedSelector(store => store.courses.mode);

	const { data: courseData, isLoading: isDataLoading } = rtkApi.useCourseDataQuery(
		(router.query.cid as string | undefined) || '',
	);

	const {
		data: sectionData,
		isLoading: isSectionDataLoading,
		isFetching: isSectionDataFetching,
		fulfilledTimeStamp,
		refetch,
		error,
	} = rtkApi.useCourseExactSectionQuery({
		cid: (router.query.cid as string | undefined) || '',
		csid: (router.query.csid as string | undefined) || '',
	});

	React.useEffect(() => {
		refetch();
	}, [router.query]);

	React.useEffect(() => {
		if (!!error) {
			if (!!(error as OnyxApiErrorResponseType).data?.message)
				notification({
					type: 'error',
					message: (error as OnyxApiErrorResponseType).data.message as string,
					autoClose: 7500,
				});
			router.push(`/courses/${router.query?.cid || ''}`);
		}
	}, [error]);

	React.useEffect(() => {
		if (!sectionData && !isSectionDataLoading && fulfilledTimeStamp) {
			router.push(`/courses/${router.query.cid as string}`);
			notification({
				message: 'Запрашиваемый раздел не был найден! Перенаправляем на страницу программы...',
				type: 'warning',
				autoClose: 7500,
			});
		}
	}, [isSectionDataLoading, sectionData]);

	return (
		<>
			<Head>
				<title>{sectionData?.title || 'Раздел курса'}</title>
				<meta name='description' content={sectionData?.title || 'Раздел образовательной программы обучения'} />
			</Head>

			<CoursesLayout
				courseIconUrl={courseData?.main?.previewScreenshot}
				breadcrumbs={[
					{
						element: `Раздел программы`,
						href: `/courses/${router.query.cid as string}/${router.query.csid as string}`,
						icon: <LightbulbIcon />,
					},
				]}
			>
				{!courseData || !sectionData || isDataLoading || isSectionDataFetching ? (
					<Stack width='100%' height='calc(100lvh - 300px)'>
						<ModernLoader
							loading
							centered
							tripleLoadersMode
							containerSx={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
						/>
					</Stack>
				) : (
					<Stack component='section' minHeight='calc(100vh - 175px)' width='100%' direction='column' gap={2}>
						<Stack
							aria-label='content-header'
							width='100%'
							justifyContent='space-between'
							alignItems={{ sx: 'flex-end', md: 'center' }}
							direction={{ sx: 'column-reverse', md: 'row' }}
							gap={{ sx: 0.25, md: 2 }}
						>
							<OnyxTypography
								text={`Раздел ${sectionData.orderNumber}. ${sectionData.title}`}
								tpColor='primary'
								tpSize='1.5rem'
								tpWeight='bold'
								component='h1'
								sx={{ width: { sx: '100%', md: undefined }, textAlign: { sx: 'left', md: undefined } }}
							/>

							<OnyxLink href={`/courses/${router.query.cid as string}`}>
								<Button variant='contained' size='small'>
									<KeyboardBackspaceIcon sx={{ fontSize: '1.25rem', marginRight: '.25rem' }} />
									&nbsp;Вернуться к курсу
								</Button>
							</OnyxLink>
						</Stack>

						<SectionContentBlock sectionContent={sectionData.content} sx={{ flexGrow: '1' }} />

						<SectionContentPagination courseData={courseData} sectionData={sectionData} />

						{SystemRolesOptions[userData._systemRole].accessLevel > 1 && (
							<OnyxSpeedDial
								ariaLabel='Modify Tools'
								items={[
									{
										icon: viewMode === 'observe' ? <AutoFixHighIcon /> : <AutoFixOffIcon />,
										name: viewMode === 'observe' ? 'Режим редактирования' : 'Режим просмотра',
										onClick: () =>
											dispatcher(
												changeCourseViewMode(viewMode === 'observe' ? 'editor' : 'observe'),
											),
									},
									{
										icon: <SettingsIcon />,
										name: 'Параметры раздела',
										href: `/admin-courses/${router.query.cid}/sections/${router.query.csid}`,
									},
									{
										icon: <SettingsIcon />,
										name: 'Настройки курса',
										href: `/admin-courses/${router.query.cid}`,
									},
									{
										icon: <PrintIcon />,
										name: 'На печать',
										onClick: () => window?.print(),
									},
								]}
							/>
						)}
					</Stack>
				)}
			</CoursesLayout>
		</>
	);
};

export default CourseSectionPage;
