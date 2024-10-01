import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

export interface CoursesReduxI {
	mode: 'editor' | 'observe';
}

export const initialCoursesState: CoursesReduxI = {
	mode: 'observe',
};

export const coursesSlice = createSlice({
	name: 'courses',
	initialState: initialCoursesState,
	reducers: {
		*
	},
});

export const { changeCourseViewMode } = coursesSlice.actions;
export const selectCourses = (state: RootState) => state.courses;
export default coursesSlice.reducer;
