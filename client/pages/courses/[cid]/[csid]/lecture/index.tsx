import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import AutoFixOffIcon from '@mui/icons-material/AutoFixOff';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import PrintIcon from '@mui/icons-material/Print';
import SettingsIcon from '@mui/icons-material/Settings';
import StickyNote2Icon from '@mui/icons-material/StickyNote2';
import Head from 'next/head';
import { useRouter } from 'next/router';
import OnyxSpeedDial from '../../../../../components/basics/OnyxSpeedDial';
import LecturePreviewPageComponent from '../../../../../components/pages/courses/section-elements/SectionContentLectureItem/LecturePreviewPageComponent';
import CoursesLayout from '../../../../../layout/CoursesLayout';
import { useTypedDispatch, useTypedSelector } from '../../../../../redux/hooks';
import { changeCourseViewMode } from '../../../../../redux/slices/courses';
import { SystemRolesOptions, selectUser } from '../../../../../redux/slices/user';

const CourseSectionLecturePage = () => {
	const router = useRouter();
	const dispatcher = useTypedDispatch();
	const userData = useTypedSelector(selectUser);
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
				breadcrumbs={[
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
				<LecturePreviewPageComponent />

				{SystemRolesOptions[userData._systemRole].accessLevel > 1 ? (
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
								href: `/storage/lectures/${router.query.cslid}`,
							},
							{
								icon: <PrintIcon />,
								name: 'На печать',
								onClick: e => window?.print(),
							},
						]}
					/>
				) : (
					<></>
				)}
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
