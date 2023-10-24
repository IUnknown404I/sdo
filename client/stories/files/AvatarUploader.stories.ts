import type { Meta, StoryObj } from '@storybook/react';
import OnyxFileDropper from '../../components/basics/fileDropper/OnyxFileDropper';

const meta: Meta<typeof OnyxFileDropper> = {
	title: 'Files/Upload',
	component: OnyxFileDropper,
	tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof OnyxFileDropper>;
export const Onyx_Avatar_Uploader: Story = {
	args: {
		fullwidth: true,
		// uploadUri: { uri: '', method: 'PUT' },
		fileType: ['image/webp', 'image/svg+xml'],
		maxSizeKb: 3 * 1024,
		callback: () => {},
		onUploadEndMerge: () => {},
	},
};
