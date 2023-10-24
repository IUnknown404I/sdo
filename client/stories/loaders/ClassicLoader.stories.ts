import type { Meta, StoryObj } from '@storybook/react';
import ClassicLoader from '../../components/utils/loaders/ClassicLoader';

const meta: Meta<typeof ClassicLoader> = {
	title: 'Loaders/Classic',
	component: ClassicLoader,
	tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof ClassicLoader>;
export const Classic_Loader: Story = {
	args: {},
};
