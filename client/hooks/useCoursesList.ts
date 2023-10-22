import React from 'react';
import { CoursesI } from '../components/pages/courses/CoursesListPage';

const useCoursesList = <T extends Pick<CoursesI, 'cid' | 'icon' | 'main'>>(payload: {
	list: T[];
	nameRegex?: string;
	categoryFilter?: 'Все категории' | string;
}): readonly T[] => {
	const filteredCourses = React.useMemo(() => {
		let courses = [...payload.list];

		if (!!payload.categoryFilter && payload.categoryFilter !== 'Все категории')
			courses = courses.filter(course => course.main.category === payload.categoryFilter);
		if (!!payload.nameRegex)
			courses = courses.filter(course =>
				course.main.title.toLowerCase().includes(payload.nameRegex!.toLowerCase()),
			);

		return courses;
	}, [payload]);

	return filteredCourses;
};

export default useCoursesList;
