import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { DialogType } from '../../components/messenger/sidebarComponents/MessengerSidebar';
import { UserChatsObjectT } from '../endpoints/chatEnd';
import { RootState } from '../store';

export interface MessengerSliceI {
	chats: UserChatsObjectT;
	activeDialog: DialogType;
}

type xxx = Partial<MessengerSliceI['activeDialog']>;

const initialMessengerSliceState: Partial<MessengerSliceI> = {};

export const messengerSlice = createSlice({
	name: 'messenger',
	initialState: initialMessengerSliceState,
	reducers: {
		setUserChats: (state, action: PayloadAction<Partial<MessengerSliceI['chats']> | undefined>) => {
			state.chats = action.payload ? JSON.parse(JSON.stringify(action.payload)) : undefined;
		},
		changeActiveSidebarDialog: (
			state,
			action: PayloadAction<Partial<MessengerSliceI['activeDialog']> | undefined>,
		) => {
			state.activeDialog = action.payload ? JSON.parse(JSON.stringify(action.payload)) : undefined;
		},
	},
});

export const { setUserChats, changeActiveSidebarDialog } = messengerSlice.actions;
export const selectMessenger = (state: RootState): Partial<MessengerSliceI> => state.messenger;
export default messengerSlice.reducer;
