import type { Meta, StoryObj } from '@storybook/react';
import ModernLoader from '../../components/utils/loaders/ModernLoader';

const meta: Meta<typeof ModernLoader> = {
	title: 'Loaders/Modern',
	component: ModernLoader,
	tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof ModernLoader>;
export const Modern_Loader: Story = {
	args: {
        speedMultiplier: 1,
        tripleLoadersMode: true,
        centered: true,
        loading: true,
        containerSx: { width: '100px', height: '100px' }
    },
};
