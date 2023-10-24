import type { Meta, StoryObj } from '@storybook/react';
import OnyxSpeedDial from '../../components/basics/OnyxSpeedDial';

const meta: Meta<typeof OnyxSpeedDial> = {
	title: 'Basics/SpeedDial',
	component: OnyxSpeedDial,
	tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof OnyxSpeedDial>;
export const Onyx_Speed_Dial: Story = {
	args: {
		ariaLabel: 'Onyx-Speed-Dial element',
	},
};
