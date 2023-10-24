import type { Meta, StoryObj } from '@storybook/react';
import OnyxAlertModal from '../../components/basics/OnyxAlertModal';

const meta: Meta<typeof OnyxAlertModal> = {
	title: 'Basics/Alert',
	component: OnyxAlertModal,
	tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof OnyxAlertModal>;

export const Onyx_Alert_Modal: Story = {
	args: {
		title: 'Onyx_Alert_Modal element',
		children: 'content of the Alert Modal Panel',
		keepMounted: false,
	},
};
