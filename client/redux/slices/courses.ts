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
		changeCourseViewMode: (state, action: PayloadAction<CoursesReduxI['mode']>) => {
			if (localStorage.getItem('courses-view-mode') !== action.payload)
				localStorage.setItem('courses-view-mode', action.payload);
			state.mode = action.payload;
		},
	},
});

export const { changeCourseViewMode } = coursesSlice.actions;
export const selectCourses = (state: RootState) => state.courses;
export default coursesSlice.reducer;
