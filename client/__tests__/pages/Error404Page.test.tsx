/**
 * @jest-environment jsdom
 */

import { getByText, render, waitFor } from '@testing-library/react';
import React from 'react';
import Error404Page from '../../pages/404';

describe('Error404Page ->', () => {
    const { container } = render(<Error404Page />);

	it('correct renders', () => {
		waitFor(() => expect(container).toMatchSnapshot());
	});

	it('contains valid info', () => {
		waitFor(() => expect(getByText(container, 'СТРАНИЦА НЕ НАЙДЕНА')).toBeInTheDocument());
		waitFor(() => expect(getByText(container, 'Веб-ресурс по запрошенному адресу не найден!')).toBeInTheDocument());
    });
});
