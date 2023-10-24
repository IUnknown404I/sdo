import type { Meta, StoryObj } from '@storybook/react';
import { OnyxTypography } from '../../components/basics/OnyxTypography';

const meta: Meta<typeof OnyxTypography> = {
	title: 'Basics/Typography',
	component: OnyxTypography,
	tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof OnyxTypography>;
export const Onyx_Typography: Story = {
	args: {
		component: 'span',
		text: 'string or ReactElement as typography-text',
		ttNode: 'Tooltip node',
		ttFollow: true,
		lkHref: 'href string',
		lkProps: { rel: 'norefferer', target: '_blank' },
		sx: { width: 'fit-content' },
	},
};
