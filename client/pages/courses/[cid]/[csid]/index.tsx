import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import AutoFixOffIcon from '@mui/icons-material/AutoFixOff';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import PrintIcon from '@mui/icons-material/Print';
import SaveIcon from '@mui/icons-material/Save';
import SecurityIcon from '@mui/icons-material/Security';
import SettingsIcon from '@mui/icons-material/Settings';
import { Button, Stack } from '@mui/material';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';
import OnyxLink from '../../../../components/basics/OnyxLink';
import OnyxSpeedDial from '../../../../components/basics/OnyxSpeedDial';
import { OnyxTypography } from '../../../../components/basics/OnyxTypography';
import { CourseSectionType } from '../../../../components/pages/courses/coursesTypes';
import SectionContent from '../../../../components/pages/courses/section-elements/SectionContent';
import { SectionContentPagination } from '../../../../components/pages/courses/section-elements/SectionItems';
import ModernLoader from '../../../../components/utils/loaders/ModernLoader';
import CoursesLayout from '../../../../layout/CoursesLayout';
import { rtkApi } from '../../../../redux/api';
import { useTypedDispatch, useTypedSelector } from '../../../../redux/hooks';
import { changeCourseViewMode } from '../../../../redux/slices/courses';

const CourseSectionPage = () => {
	const router = useRouter();
	const dispatcher = useTypedDispatch();
	const viewMode = useTypedSelector(store => store.courses.mode);

	const { data: courseData, isLoading: isDataLoading } = rtkApi.useCourseDataQuery(
		(router.query.cid as string | undefined) || '',
	);

	const [sectionData, setSectionData] = React.useState<CourseSectionType | undefined>(undefined);

	React.useEffect(() => {
		if (!courseData || !courseData.sections.length) return;
		setSectionData(courseData.sections.find(section => section.csid === (router.query.csid as string | undefined)));
	}, [courseData]);

	React.useEffect(() => {
		if (!!courseData && (!sectionData?.csid || (router.query.csid as string) !== sectionData?.csid))
			setSectionData(
				courseData.sections.find(section => section.csid === (router.query.csid as string | undefined)),
			);
	}, [router.query]);

	return (
		<>
			<Head>
				<title>{sectionData?.title || 'Раздел курса'}</title>
				<meta name='description' content={sectionData?.title || 'Раздел образовательной программы обучения'} />
			</Head>

			<CoursesLayout
				progressValue={30}
				courseIconUrl={courseData?.main.previewScreenshot}
				breadcrumbsCourseContent={[
					{
						element: `Раздел программы`,
						href: `/courses/${router.query.cid as string}/${router.query.csid as string}`,
						icon: <LightbulbIcon />,
					},
				]}
			>
				{!courseData || !sectionData || isDataLoading ? (
					<Stack width='100%'>
						<ModernLoader centered tripleLoadersMode loading />
					</Stack>
				) : (
					<Stack component='section' width='100%' direction='column' gap={2}>
						{/* header */}
						<Stack
							width='100%'
							justifyContent='space-between'
							alignItems={{ xs: 'flex-end', md: 'center' }}
							direction={{ xs: 'column-reverse', md: 'row' }}
							gap={{ xs: 0.25, md: 2 }}
						>
							<OnyxTypography
								text={`Раздел ${sectionData.orderNumber}. ${sectionData.title}`}
								tpColor='primary'
								tpSize='1.5rem'
								tpWeight='bold'
								component='h1'
							/>
							<OnyxLink href={`/courses/${router.query.cid as string}`}>
								<Button variant='contained' size='small'>
									<KeyboardBackspaceIcon sx={{ fontSize: '1.25rem', marginRight: '.25rem' }} />
									&nbsp;Вернуться к курсу
								</Button>
							</OnyxLink>
						</Stack>

						{/* content */}
						<SectionContent />
						{/* <SectionContentBlock
							sectionContent={
								courseData.sections.find(section => section.csid === router.query.csid)?.content || []
							}
						/> */}

						{/* sections-pagination */}
						<SectionContentPagination courseData={courseData} sectionData={sectionData} />

						<OnyxSpeedDial
							ariaLabel='Modify Tools'
							items={[
								{
									icon: viewMode === 'observe' ? <AutoFixHighIcon /> : <AutoFixOffIcon />,
									name: viewMode === 'observe' ? 'Режим редактирования' : 'Режим просмотра',
									onClick: e =>
										dispatcher(changeCourseViewMode(viewMode === 'observe' ? 'editor' : 'observe')),
								},
								{
									icon: <SettingsIcon />,
									name: 'Настройки раздела',
									href: `/courses/${router.query.cid}/${router.query.csid}/config`,
								},
								{
									icon: <SecurityIcon />,
									name: 'Ограничения раздела',
									href: `/courses/${router.query.cid}/${router.query.csid}/config/security`,
								},
								{
									icon: <SaveIcon />,
									name: 'Сохранить изменения',
								},
								{
									icon: <PrintIcon />,
									name: 'На печать',
									onClick: e => window?.print(),
								},
							]}
						/>
					</Stack>
				)}
			</CoursesLayout>
		</>
	);
};

export default CourseSectionPage;
