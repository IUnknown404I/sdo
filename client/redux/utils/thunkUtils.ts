import { createAsyncThunk } from '@reduxjs/toolkit';
import { AppDispatch, ExtraArgumentsOptions, RootStoreState } from '../store';

export type AsyncThunkConfig = {
	/** return type for `thunkApi.getState` */
	state: RootStoreState;
	/** type for `thunkApi.dispatch` */
	dispatch: AppDispatch;
	/** type of the `extra` argument for the thunk middleware, which will be passed in as `thunkApi.extra` */
	extra: ExtraArgumentsOptions;

	/** type to be passed into `rejectWithValue`'s first argument that will end up on `rejectedAction.payload` */
	// rejectValue?: unknown;
	/** return type of the `serializeError` option callback */
	// serializedErrorType?: unknown;
	/** type to be returned from the `getPendingMeta` option callback & merged into `pendingAction.meta` */
	// pendingMeta?: unknown;
	/** type to be passed into the second argument of `fulfillWithValue` to finally be merged into `fulfilledAction.meta` */
	// fulfilledMeta?: unknown;
	/** type to be passed into the second argument of `rejectWithValue` to finally be merged into `rejectedAction.meta` */
	// rejectedMeta?: unknown;
};

export const createAppAsyncThunk = createAsyncThunk.withTypes<AsyncThunkConfig>();
