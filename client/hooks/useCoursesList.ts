import React from 'react';
import { CourseAccessFilterType } from '../components/pages/courses/CoursesListPage';
import { CoursePublicPartI, CourseUserAccessRoleType } from '../components/pages/courses/coursesTypes';
import { CourseProgressI } from '../redux/endpoints/courseProgressEnd';
import { useTypedSelector } from '../redux/hooks';
import { SystemRolesOptions, selectUser } from '../redux/slices/user';

export type UseCoursesListI<T> = {
	list: T[];
	progressList?: CourseProgressI[];
	nameRegex?: string;
	categoryFilter?: 'Все категории' | string;
	accessFilter?: CourseAccessFilterType;
};
export type UseCourseListReturnType<T> = T & { accessible: boolean; roles?: CourseUserAccessRoleType[] };

/**
 * @IUnknown404I Hook for parsing all courses to valid list of accessible course for current user via system-role and his progresses info
 * @param list array of all courses that should be parsed;
 * @param progressList optional array of user's progresses object for the accessible courses parsing;
 * @param nameRegex optional string for name-filtering
 * @param categoryFilter optional string for category-filtering
 * @param accessFilter optional CourseAccessFilterType string for parsing by accessibility.
 * @returns array of CoursePublicPartI objects.
 */
const useCoursesList = <T extends CoursePublicPartI>(payload: UseCoursesListI<T>): UseCourseListReturnType<T>[] => {
	const userData = useTypedSelector(selectUser);
	return React.useMemo<UseCourseListReturnType<T>[]>(() => {
		let courses = [...payload.list];

		if (!!payload.accessFilter && payload.accessFilter !== 'any') {
			if (payload.accessFilter === 'access' && SystemRolesOptions[userData._systemRole].accessLevel <= 3)
				courses = !payload.progressList?.length
					? []
					: courses.filter(
							course =>
								!!payload.progressList?.find(
									progress => progress.cid === course.cid && progress.status === 'active',
								),
					  );
			if (payload.accessFilter === 'deny' && !!payload.progressList?.length)
				courses =
					SystemRolesOptions[userData._systemRole].accessLevel > 3
						? []
						: courses.filter(
								course =>
									!payload.progressList!.find(
										progress => progress.cid === course.cid && progress.status === 'active',
									),
						  );
		}
		if (!!payload.categoryFilter && payload.categoryFilter !== 'Все категории')
			courses = courses.filter(course => course.main.category === payload.categoryFilter);
		if (!!payload.nameRegex)
			courses = courses.filter(course =>
				course.main.title.toLowerCase().includes(payload.nameRegex!.toLowerCase()),
			);

		return courses.map(course => {
			const foundExactProgressesEntries = payload.progressList?.filter(
				progress => progress.cid === course.cid && progress.status === 'active',
			);
			return {
				...course,
				accessible:
					SystemRolesOptions[userData._systemRole].accessLevel > 3
						? true
						: !!foundExactProgressesEntries?.length,
				roles: !!foundExactProgressesEntries?.length
					? foundExactProgressesEntries.reduce(
							(acc, cur) => (acc.includes(cur.role) ? acc : [...acc, cur.role]),
							[] as CourseUserAccessRoleType[],
					  )
					: [],
			};
		});
	}, [payload]);
};

export default useCoursesList;
