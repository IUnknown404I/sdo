/**
 * @jest-environment jsdom
 */

import { getByTitle, render, waitFor } from '@testing-library/react';
import React from 'react';
import AuthLayout from '../../components/pages/auth/components/AuthLayout';

jest.mock('next/router', () => ({
	useRouter: jest.fn(() => ({
		query: {},
	})),
}));

describe('AuthLayout ->', () => {
	const { container } = render(
		<AuthLayout sideImgUrl='/images/utility/loginImg.svg'>
			<span title='test-span'></span>
		</AuthLayout>,
	);

	it('correct renders', () => {
		waitFor(() => expect(container).toMatchSnapshot());
	});

	it('content validity check', () => {
		waitFor(() => expect(getByTitle(container, 'test-span')).toBeInTheDocument());
	});
});
