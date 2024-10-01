import LightbulbIcon from '@mui/icons-material/Lightbulb';
import SettingsIcon from '@mui/icons-material/Settings';
import StickyNote2Icon from '@mui/icons-material/StickyNote2';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { OnyxTypography } from '../../../../../components/basics/OnyxTypography';
import CoursesLayout from '../../../../../layout/CoursesLayout';

// @ts-ignore
const CustomTextEditor = dynamic(() => import('../../../../../components/editors/TextEditor'), {
	ssr: false,
});

const CourseSectionLectureConfigPage = () => {
	const router = useRouter();
	return (
		<>
			<Head>
				<title>Настройки лекции</title>
				<meta name='description' content='Настройки лекции' />
				<meta name='robots' content='noindex, nofollow' />
			</Head>

			<CoursesLayout
				backButton
				breadcrumbs={[
					{
						element: `Раздел программы`,
						href: `/courses/${router.query.cid as string}/${router.query.csid as string}`,
						icon: <LightbulbIcon />,
					},
					{
						element: 'Лекция',
						href: `/courses/${router.query.cid as string}/${
							router.query.csid as string
						}/lecture?cslid=HksoBFnsklapfIUShyhfap`,
						icon: <StickyNote2Icon />,
					},
					{
						element: 'Настройки лекции',
						icon: <SettingsIcon />,
					},
				]}
			>
				<OnyxTypography
					text='Контент лекции'
					tpSize='1.5rem'
					tpColor='primary'
					component='h2'
					sx={{ marginBottom: '.75rem' }}
				/>
				{/* @ts-ignore */}
				<CustomTextEditor content={getTestLectureText()} />
			</CoursesLayout>
		</>
	);
};

export const getServerSideProps = async (context: any) => {
	return {
		props: {},
	};
};

export default CourseSectionLectureConfigPage;

/**
 * @deprecated
 */
export function getTestLectureText(): string {
	return `
    <b>Средства индивидуальной защиты (СИЗ)</b> — средства, используемые работником для
							предотвращения или уменьшения воздействия вредных и опасных производственных факторов, а
							также для защиты от загрязнения. Применяются в тех случаях,&nbsp;
							<i>
								когда безопасность работ не может быть обеспечена конструкцией оборудования,
								организацией производственных процессов, архитектурно-планировочными решениями и
								средствами коллективной защиты
							</i>
							.</br></br>
                            В соответствии с Трудовым кодексом Российской Федерации и санитарным законодательством, на
							работах с вредными и (или) опасными условиями труда, а также на работах, выполняемых в
							особых температурных условиях или связанных с загрязнением, работникам выдаются
							сертифицированные средства индивидуальной защиты, смывающие и обеззараживающие средства в
							соответствии с нормами, утвержденными в порядке, установленном Правительством Российской
							Федерации.
                            </br></br>
                            Приобретение, хранение, стирка, ремонт, дезинфекция и обеззараживание средств индивидуальной
							защиты работников осуществляется за счет средств работодателя.
                            </br></br>
                            Эффективное применение средств индивидуальной защиты предопределяется правильностью выбора
							конкретной марки, поддержание в исправном состоянии и степенью обученности персонала
							правилам их использования в соответствии с инструкциями по эксплуатации.
                            </br></br>
                            Важно отметить, что на каждом предприятии, где применяются средства индивидуальной защиты,
							должен быть назначен работник, в обязанности которого входит контроль за правильностью
							хранения, эксплуатацией и своевременным использованием средств защиты.
    `;
}
