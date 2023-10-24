import type { Meta, StoryObj } from '@storybook/react';
import OnyxSwitch from '../../components/basics/OnyxSwitch';

const meta: Meta<typeof OnyxSwitch> = {
	title: 'Basics/Switch',
	component: OnyxSwitch,
	tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof OnyxSwitch>;
export const Onyx_Switch: Story = {
	args: {
		label: 'Onyx-Switch element',
		labelPlacement: 'start',
		size: 'medium',
        wrapped: true,
	},
};
