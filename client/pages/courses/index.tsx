import axios from 'axios';
import Head from 'next/head';
import CoursesListPage, { CoursesI } from '../../components/pages/courses/CoursesListPage';
import CoursesLayout from '../../layout/CoursesLayout';

const CoursePage = (props: { coursesList: Pick<CoursesI, 'cid' | 'icon' | 'main'>[]; coursesCategories: string[] }) => {
	return (
		<>
			<Head>
				<title>Образовательные программы</title>
				<meta name='description' content='Список образовательных программ' />
				<meta name='robots' content='index, follow' />
			</Head>

			<CoursesLayout>
				<CoursesListPage list={props.coursesList} categories={props.coursesCategories} />
			</CoursesLayout>
		</>
	);
};

export async function getStaticProps() {
	return {
		props: {
			coursesList: (await axios.get(`${process.env.NEXT_PUBLIC_SERVER}/courses`)).data,
			coursesCategories: (await axios.get(`${process.env.NEXT_PUBLIC_SERVER}/courses/categories`)).data,
		},
		revalidate: 30,
	};
}

export default CoursePage;
