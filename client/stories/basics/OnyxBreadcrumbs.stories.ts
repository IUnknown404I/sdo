import type { Meta, StoryObj } from '@storybook/react';
import OnyxBreadcrumbs from '../../components/basics/OnyxBreadcrumbs';

const meta: Meta<typeof OnyxBreadcrumbs> = {
	title: 'Basics/Breadcrumbs',
	component: OnyxBreadcrumbs,
	tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof OnyxBreadcrumbs>;
export const Onyx_Breadcrumbs: Story = {
	args: {
		itemList: [
			{ element: 'crumb 1', href: 'href', icon: '[icon1]', iconPosition: 'start' },
			{ element: 'inner 1', icon: '[icon]', iconPosition: 'start' },
			{ element: 'inner 2', icon: '[icon]', iconPosition: 'start' },
			{ element: 'inner 3', icon: '[icon]', iconPosition: 'end' },
			{ element: 'crumb 2', icon: '[icon2]', iconPosition: 'end' },
			{ element: 'crumb 3', href: 'href', icon: '[icon3]' },
		],
		separator: '>',
	},
};
