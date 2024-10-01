import axios from 'axios';
import Head from 'next/head';
import CoursesListPage from '../../components/pages/courses/CoursesListPage';
import { CoursePublicPartI } from '../../components/pages/courses/coursesTypes';
import Layout from '../../layout/Layout';

const CoursePage = (props: { coursesList: CoursePublicPartI[]; coursesCategories: string[] }) => {
	return (
		<>
			<Head>
				<title>Образовательные программы</title>
				<meta name='description' content='Список образовательных программ' />
				<meta name='robots' content='noindex, nofollow' />
			</Head>

			<Layout>
				<CoursesListPage list={props.coursesList} categories={props.coursesCategories} />
			</Layout>
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
