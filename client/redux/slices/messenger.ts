import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { DialogType } from '../../components/messenger/sidebarComponents/MessengerSidebar';
import { UserChatsObjectT } from '../endpoints/chatEnd';
import { RootState } from '../store';

export interface MessengerSliceI {
	chats: UserChatsObjectT;
	activeDialog: DialogType;
}

const initialMessengerSliceState: Partial<MessengerSliceI> = {};

export const messengerSlice = createSlice({
	name: 'messenger',
	initialState: initialMessengerSliceState,
	reducers: {
		setUserChats: (state, action: PayloadAction<UserChatsObjectT | undefined>) => {
			state.chats = action.payload ? JSON.parse(JSON.stringify(action.payload)) : undefined;
		},
		changeActiveSidebarDialog: (state, action: PayloadAction<DialogType | undefined>) => {
			state.activeDialog = action.payload ? JSON.parse(JSON.stringify(action.payload)) : undefined;
		},
	},
});

export const { setUserChats, changeActiveSidebarDialog } = messengerSlice.actions;
export const selectMessenger = (state: RootState): Partial<MessengerSliceI> => state.messenger;
export default messengerSlice.reducer;
