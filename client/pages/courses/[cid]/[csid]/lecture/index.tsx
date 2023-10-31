import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import AutoFixOffIcon from '@mui/icons-material/AutoFixOff';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import PrintIcon from '@mui/icons-material/Print';
import SecurityIcon from '@mui/icons-material/Security';
import SettingsIcon from '@mui/icons-material/Settings';
import StickyNote2Icon from '@mui/icons-material/StickyNote2';
import { Stack } from '@mui/material';
import Head from 'next/head';
import { useRouter } from 'next/router';
import OnyxSpeedDial from '../../../../../components/basics/OnyxSpeedDial';
import { OnyxTypography } from '../../../../../components/basics/OnyxTypography';
import SectionContentTextBlock from '../../../../../components/pages/courses/section-elements/EditFieldsetTextBlock/EditFieldsetTextBlock';
import SectionContentContainer from '../../../../../components/pages/courses/section-elements/SectionContentContainer/SectionContentContainer';
import SectionContentDivider from '../../../../../components/pages/courses/section-elements/SectionContentDivider/SectionContentDivider';
import SectionContentHeader from '../../../../../components/pages/courses/section-elements/SectionContentHeader/SectionContentHeader';
import { SectionContentSlideTransition } from '../../../../../components/pages/courses/section-elements/SectionItems';
import CoursesLayout from '../../../../../layout/CoursesLayout';
import { useTypedDispatch, useTypedSelector } from '../../../../../redux/hooks';
import { changeCourseViewMode } from '../../../../../redux/slices/courses';

const CourseSectionLecturePage = () => {
	const router = useRouter();
	const dispatcher = useTypedDispatch();
	const viewMode = useTypedSelector(store => store.courses.mode);
	return (
		<>
			<Head>
				<title>Лекция раздела</title>
				<meta name='description' content='Лекция раздела' />
				<meta name='robots' content='noindex, nofollow' />
			</Head>

			<CoursesLayout
				backButton
				progressValue={30}
				breadcrumbsCourseContent={[
					{
						element: `Раздел программы`,
						href: `/courses/${router.query.cid as string}/${router.query.csid as string}`,
						icon: <LightbulbIcon />,
					},
					{
						element: 'Лекция',
						icon: <StickyNote2Icon />,
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
					<SectionContentSlideTransition direction='left'>
						<SectionContentContainer>
							<SectionContentHeader text='Средства защиты органов дыхания, рук, головы, лица, органа слуха, глаз' />
							<SectionContentTextBlock>
								<OnyxTypography tpSize='1.1rem'>
									<b>Средства индивидуальной защиты (СИЗ)</b> — средства, используемые работником для
									предотвращения или уменьшения воздействия вредных и опасных производственных
									факторов, а также для защиты от загрязнения. Применяются в тех случаях,&nbsp;
									<i>
										когда безопасность работ не может быть обеспечена конструкцией оборудования,
										организацией производственных процессов, архитектурно-планировочными решениями и
										средствами коллективной защиты
									</i>
									.
								</OnyxTypography>
								<OnyxTypography tpSize='1.1rem'>
									В соответствии с Трудовым кодексом Российской Федерации и санитарным
									законодательством, на работах с вредными и (или) опасными условиями труда, а также
									на работах, выполняемых в особых температурных условиях или связанных с
									загрязнением, работникам выдаются сертифицированные средства индивидуальной защиты,
									смывающие и обеззараживающие средства в соответствии с нормами, утвержденными в
									порядке, установленном Правительством Российской Федерации.
								</OnyxTypography>
								<OnyxTypography tpSize='1.1rem'>
									Приобретение, хранение, стирка, ремонт, дезинфекция и обеззараживание средств
									индивидуальной защиты работников осуществляется за счет средств работодателя.
								</OnyxTypography>
								<OnyxTypography tpSize='1.1rem'>
									Эффективное применение средств индивидуальной защиты предопределяется правильностью
									выбора конкретной марки, поддержание в исправном состоянии и степенью обученности
									персонала правилам их использования в соответствии с инструкциями по эксплуатации.
								</OnyxTypography>
								<OnyxTypography tpSize='1.1rem'>
									Важно отметить, что на каждом предприятии, где применяются средства индивидуальной
									защиты, должен быть назначен работник, в обязанности которого входит контроль за
									правильностью хранения, эксплуатацией и своевременным использованием средств защиты.
								</OnyxTypography>
							</SectionContentTextBlock>
						</SectionContentContainer>
					</SectionContentSlideTransition>

					<SectionContentDivider sx={{ margin: '.75rem auto' }} />

					<SectionContentSlideTransition direction='left'>
						<SectionContentContainer>
							<SectionContentTextBlock>
								<OnyxTypography tpSize='1.1rem'>
									<b>Средства индивидуальной защиты (СИЗ)</b> — средства, используемые работником для
									предотвращения или уменьшения воздействия вредных и опасных производственных
									факторов, а также для защиты от загрязнения. Применяются в тех случаях,&nbsp;
									<i>
										когда безопасность работ не может быть обеспечена конструкцией оборудования,
										организацией производственных процессов, архитектурно-планировочными решениями и
										средствами коллективной защиты
									</i>
									.
								</OnyxTypography>
								<OnyxTypography tpSize='1.1rem'>
									В соответствии с Трудовым кодексом Российской Федерации и санитарным
									законодательством, на работах с вредными и (или) опасными условиями труда, а также
									на работах, выполняемых в особых температурных условиях или связанных с
									загрязнением, работникам выдаются сертифицированные средства индивидуальной защиты,
									смывающие и обеззараживающие средства в соответствии с нормами, утвержденными в
									порядке, установленном Правительством Российской Федерации.
								</OnyxTypography>
								<OnyxTypography tpSize='1.1rem'>
									Приобретение, хранение, стирка, ремонт, дезинфекция и обеззараживание средств
									индивидуальной защиты работников осуществляется за счет средств работодателя.
								</OnyxTypography>
								<OnyxTypography tpSize='1.1rem'>
									Эффективное применение средств индивидуальной защиты предопределяется правильностью
									выбора конкретной марки, поддержание в исправном состоянии и степенью обученности
									персонала правилам их использования в соответствии с инструкциями по эксплуатации.
								</OnyxTypography>
								<OnyxTypography tpSize='1.1rem'>
									Важно отметить, что на каждом предприятии, где применяются средства индивидуальной
									защиты, должен быть назначен работник, в обязанности которого входит контроль за
									правильностью хранения, эксплуатацией и своевременным использованием средств защиты.
								</OnyxTypography>
							</SectionContentTextBlock>
						</SectionContentContainer>
					</SectionContentSlideTransition>

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
								name: 'Настройки лекции',
								href: `/courses/${router.query.cid}/${router.query.csid}/lecture/config?cslid=SohvnbjSkvdPhTo`,
							},
							{
								icon: <SecurityIcon />,
								name: 'Ограничения лекции',
								href: `/courses/${router.query.cid}/${router.query.csid}/lecture/security?cslid=SohvnbjSkvdPhTo`,
							},
							{
								icon: <PrintIcon />,
								name: 'На печать',
								onClick: e => window?.print(),
							},
						]}
					/>
				</Stack>
			</CoursesLayout>
		</>
	);
};

export const getServerSideProps = async (context: any) => {
	return {
		props: {},
	};
};

export default CourseSectionLecturePage;
