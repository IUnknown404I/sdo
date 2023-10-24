import type { Meta, StoryObj } from '@storybook/react';
import OnyxLink from '../../components/basics/OnyxLink';

const meta: Meta<typeof OnyxLink> = {
	title: 'Basics/Link',
	component: OnyxLink,
	tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof OnyxLink>;
export const Onyx_Link: Story = {
	args: {
		children: 'text of the Link element',
		href: 'href string',
		target: '_blank',
		rel: 'norefferer',
	},
};
