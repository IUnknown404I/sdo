/**
 * @jest-environment jsdom
 */

import { render, waitFor } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import AuthProtectWrapper from '../../layout/AuthProtectWrapper';
import MetaWrapper from '../../layout/MetaWrapper';
import { initialAccessTokenState } from '../../redux/slices/accessToken';
import { initialAuthState } from '../../redux/slices/auth';
import { initialInstanceState } from '../../redux/slices/axiosInstance';
import { initialUserState } from '../../redux/slices/user';
import { store } from '../../redux/store';
import ToggleColorMode from '../../theme/Theme';

jest.mock('next/router', () => ({
	useRouter: jest.fn(() => ({
		query: {},
		route: '/login',
		asPath: 'login',
		push: () => new Promise(() => true),
	})),
}));
const mockStore = configureMockStore([thunk]);

const expectedElement = (
	<span
		aria-label=''
		className='MuiCircularProgress-root MuiCircularProgress-indeterminate MuiCircularProgress-colorPrimary css-185k7aw-MuiCircularProgress-root'
		role='progressbar'
		style={{ width: '64px', height: '64px' }}
	>
		<svg className='MuiCircularProgress-svg css-1idz92c-MuiCircularProgress-svg' viewBox='22 22 44 44'>
			<circle
				className='MuiCircularProgress-circle MuiCircularProgress-circleIndeterminate css-176wh8e-MuiCircularProgress-circle'
				cx='44'
				cy='44'
				fill='none'
				r='20'
				stroke-width='4'
			/>
		</svg>
	</span>
);

beforeEach(() => {
	jest.mock('next/router', () => ({
		useRouter: jest.fn(() => ({
			query: {},
			asPath: 'login',
		})),
	}));
});

describe('AuthProtectWrapper ->', () => {
	it('correct renders AuthProtectWrapper:', () => {
		const { container, getByText } = render(
			<Provider store={store}>
				<ToggleColorMode>
					<MetaWrapper>
						<AuthProtectWrapper>
							<ToastContainer
								position='top-right'
								autoClose={4500}
								hideProgressBar={false}
								newestOnTop={false}
								closeOnClick
								rtl={false}
								pauseOnFocusLoss
								draggable
								pauseOnHover
								theme='light'
							/>
							<p>Test render!</p>
						</AuthProtectWrapper>
					</MetaWrapper>
				</ToggleColorMode>
			</Provider>,
		);

		waitFor(() => expect(container).toMatchSnapshot());
		waitFor(() => expect(getByText('Test render!')).not.toBeInTheDocument());
		waitFor(() => expect(expectedElement as unknown as HTMLElement).toBeInTheDocument());
	});

	it('authorized state test:', () => {
		const mockedStore = mockStore({
			instance: initialInstanceState,
			auth: {
				...initialAuthState,
				state: true,
				sessionState: 'active',
			},
			accessToken: {
				...initialAccessTokenState,
				access_token:
					'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJuYWRtaW4iLCJlbWFpbCI6IiIsImNvbXBhbnkiOiIiLCJpc0FjdGl2ZSI6dHJ1ZSwiaXNCbG9ja2VkIjpmYWxzZSwiYmxvY2tSZWFzb24iOiIiLCJsYXN0TG9naW5JbiI6IjAxLjAxLjIwMjMgMTU6NTAuMjgiLCJmYWlsZWRBdHRlbXB0cyI6MCwiY3JlYXRlZEF0IjoiMDEuMDEuMjAyMyAxNDo0Ny4zMyIsImlhdCI6MTY4NTUzOTUwOCwiZXhwIjoxOTg1NTM5Njg4fQ.UnjzG45xKdFWK6bbcd4ZKYeGPny0cD9CYbaA4HpFEhU',
				expires_in: '2033-05-31T13:30:43.978Z',
			},
			user: {
				...initialUserState,
				username: 'testone',
				email: 'testone@mail.ru',
				// privileges: ,
				company: 'test',
				createdAt: '01.01.20',
				lastModified: '01.01.23',
				lastLoginIn: '01.05.20',
				isBlocked: false,
				blockReason: '',
				isActive: true,
				failedAttempts: 0,
			},
		});

		const { container, getByText } = render(
			<Provider store={mockedStore}>
				<ToggleColorMode>
					<MetaWrapper>
						<AuthProtectWrapper>
							<ToastContainer
								position='top-right'
								autoClose={4500}
								hideProgressBar={false}
								newestOnTop={false}
								closeOnClick
								rtl={false}
								pauseOnFocusLoss
								draggable
								pauseOnHover
								theme='light'
							/>
							<p>Test render!</p>
						</AuthProtectWrapper>
					</MetaWrapper>
				</ToggleColorMode>
			</Provider>,
		);

		waitFor(() => expect(container).toMatchSnapshot());
		waitFor(() => expect(getByText('Test render!')).toBeInTheDocument());
	});
});
