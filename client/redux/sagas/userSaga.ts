import { ActionCreatorWithoutPayload } from '@reduxjs/toolkit';
import { put, takeLatest } from 'redux-saga/effects';
import { personal } from '../slices/user';

// export function* personalUserDataFetchSaga(action: ActionCreatorWithoutPayload<'user/personal'>) {
export function* personalUserDataFetchSaga() {
	yield put(
		personal({
			name: 'test-saga-user-personal',
			surname: 'test-saga-user-personal',
			city: 'test-saga-user-personal',
			company: 'test-saga-user-personal',
			position: 'test-saga-user-personal',
			tel: 'test-saga-user-personal',
			avatar: 'test-saga-user-personal',
		}),
	);
}

export function* watchPersonalDataFetch() {
	yield takeLatest(UserDataAction.PERS_DATA_FETCH, personalUserDataFetchSaga);
}

export enum UserDataAction {
	PERS_DATA_FETCH = 'PERS_DATA_FETCH',
};
export const userWatcherSagas: Generator[] = [
	watchPersonalDataFetch(),
]