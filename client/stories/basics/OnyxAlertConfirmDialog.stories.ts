import type { Meta, StoryObj } from '@storybook/react';
import OnyxAlertConfirmDialog from '../../components/basics/OnyxAlertConfirmDialog';

const meta: Meta<typeof OnyxAlertConfirmDialog> = {
	title: 'Basics/Confirm',
	component: OnyxAlertConfirmDialog,
	tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof OnyxAlertConfirmDialog>;
export const Onyx_Alert_Modal: Story = {
	args: {
		text: 'content of the Confirm Modal Panel',
	},
};
