import type { Meta, StoryObj } from '@storybook/react';
import OnyxRangeInput from '../../components/basics/OnyxRangeInput';

const meta: Meta<typeof OnyxRangeInput> = {
	title: 'Basics/Range',
	component: OnyxRangeInput,
	tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof OnyxRangeInput>;
export const Onyx_Range_Input: Story = {
	args: {
		mode: 'success',
		marks: [{ value: 25 }, { value: 50 }, { value: 75 }],
		'aria-label': 'Onyx Range label',
		valueLabelDisplay: 'auto',
		defaultValue: 32,
		max: 100,
        size: 'medium',
	},
};
