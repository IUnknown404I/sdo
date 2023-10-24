import type { Meta, StoryObj } from '@storybook/react';
import OnyxSelect from '../../components/basics/OnyxSelect';

const meta: Meta<typeof OnyxSelect> = {
	title: 'Basics/Select',
	component: OnyxSelect,
	tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof OnyxSelect>;
export const Onyx_Select: Story = {
	args: {
		helperText: { text: 'helper text as string or button', type: 'button' },
		label: 'Onyx-Select element',
		labelPlacement: 'start',
		size: 'medium',
		listItems: ['Option 1', 'Option 2', 'Option 3', 'Option 4', 'Option 5'],
	},
};
