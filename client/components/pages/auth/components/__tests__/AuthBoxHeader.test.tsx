/**
 * @jest-environment jsdom
 */

import { render, waitFor } from '@testing-library/react';
import React from 'react';
import AuthBoxHeader from '../AuthBoxHeader';

const TestElement = (
	<AuthBoxHeader>
		<span id='test-span'></span>
		<span id='test-span'></span>
		<span id='test-span'></span>
	</AuthBoxHeader>
);

describe('AuthBoxHeader ->', () => {
	it('array render check:', () => {
		const { findAllByTestId } = render(TestElement);
		waitFor(() => expect(findAllByTestId('test-1')).toHaveLength(3));
	});

	it('snapshot test:', () => {
		const { container } = render(TestElement);
        expect(container).toMatchSnapshot();
	});
});
