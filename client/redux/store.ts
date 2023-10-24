import { combineReducers, configureStore, ThunkMiddleware } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/dist/query';
import { useDispatch } from 'react-redux';
import { reducer as formReducer } from 'redux-form';
import logger from 'redux-logger';
import createSagaMiddleware from 'redux-saga';
import thunk from 'redux-thunk';
import { checkProductionMode } from '../utils/utilityFunctions';
import { rtkApi } from './api';
import rootSaga from './sagas/rootSaga';
import { accessTokenSlice } from './slices/accessToken';
import { authSlice } from './slices/auth';
import { axiosInstanceSlice } from './slices/axiosInstance';
import { messengerSlice } from './slices/messenger';
import { userSlice } from './slices/user';
import { coursesSlice } from './slices/courses';

export const rootEndpoint = [rtkApi];

const rootReducer = combineReducers({
	form: formReducer,
	// redux
	auth: authSlice.reducer,
	user: userSlice.reducer,
	accessToken: accessTokenSlice.reducer,
	axiosInstance: axiosInstanceSlice?.reducer,
	messenger: messengerSlice.reducer,
	courses: coursesSlice.reducer,
	// api
	[rtkApi.reducerPath]: rtkApi.reducer,
	// ...rootEndpoint.reduce((accum, endpoint) => {
	// 	accum[endpoint.reducerPath as string] = endpoint.reducer;
	// 	return accum;
	// }, {} as { [key: string]: typeof rtkApi.reducer }),
});

export type ExtraArgumentsOptions = { productionMode: boolean };
const extraArgument: ExtraArgumentsOptions = {
	productionMode: checkProductionMode(),
};

const sagaMiddleware = createSagaMiddleware();
export const store = configureStore({
	reducer: rootReducer,
	middleware: getDefaultMiddleware =>
		getDefaultMiddleware({
			thunk: { extraArgument },
			serializableCheck: {
				// Ignore these action types
				// ignoredActions: ['auth/fetchAndUpdateTokens'],
				// Ignore these field paths in all actions
				// ignoredActionPaths: ['auth/fetchAndUpdateTokens'],
				// Ignore these paths in the state
				ignoredPaths: ['axiosInstance.instance'],
			},
		})
			.prepend()
			.concat(thunk)
			.concat(sagaMiddleware)
			.concat(rtkApi.middleware)
			// .concat(rootEndpoint.map(endpoint => endpoint.middleware as ThunkMiddleware))
			.concat(extraArgument.productionMode ? [] : [logger as ThunkMiddleware]),
});
// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
setupListeners(store.dispatch);
sagaMiddleware.run(rootSaga);

// Infer the `RootState` and `AppDispatch` types from the root Reducer itself
export type RootState = ReturnType<typeof rootReducer>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootStoreState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
