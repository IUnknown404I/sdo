/**
 * @jest-environment jsdom
 */

import { getByText, render, waitFor } from '@testing-library/react';
import React from 'react';
import LoginForm from '../../components/pages/auth/login/LoginForm';
import { Provider } from 'react-redux';
import { store } from '../../redux/store';

describe('LoginForm ->', () => {
	const { container } = render(
		<Provider store={store}>
			<LoginForm />
		</Provider>,
	);

	it('correct renders', () => {
		waitFor(() => expect(container).toMatchSnapshot());
	});

	it('content validity check', () => {
		waitFor(() => expect(getByText(container, 'АВТОРИЗАЦИЯ')).toBeInTheDocument());
		waitFor(() => expect(getByText(container, 'Введите логин')).toBeInTheDocument());
		waitFor(() => expect(getByText(container, 'Введите пароль')).toBeInTheDocument());
		waitFor(() => expect(getByText(container, 'Забыли пароль')).toBeInTheDocument());
		waitFor(() => expect(getByText(container, 'Ещё нет аккаунта?')).toBeInTheDocument());
		waitFor(() => expect(getByText(container, 'Запомнить меня')).toBeInTheDocument());
	});
});
