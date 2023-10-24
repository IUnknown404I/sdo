import type { Meta, StoryObj } from '@storybook/react';
import OnyxImage from '../../components/basics/OnyxImage';

const meta: Meta<typeof OnyxImage> = {
	title: 'Basics/Image',
	component: OnyxImage,
	tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof OnyxImage>;
export const Onyx_Image: Story = {
	args: {
		src: '/offline.png',
		alt: 'Onyx Imge alt text',
		position: 'absolute',
		sx: { inset: '0 0' },
		unoptimized: true,
	},
};
