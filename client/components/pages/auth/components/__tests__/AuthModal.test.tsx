/**
 * @jest-environment jsdom
 */

import { render, waitFor } from '@testing-library/react';
import React from 'react';
import AuthModal, { AuthModalI } from '../AuthModal';

const getTestElement = (props: Omit<AuthModalI, 'setState' | 'children' | 'title'>) => (
	<AuthModal {...props} setState={() => {}} title='Testing-title'>
		<span id='test-span'></span>
		<span id='test-span'></span>
		<span id='test-span'></span>
	</AuthModal>
);

describe('AuthModal ->', () => {
	it('default state check:', () => {
		const { findAllByTestId } = render(getTestElement({ state: false }));
		waitFor(() => expect(findAllByTestId('test-span')).toHaveLength(0));
	});

	it('open state check:', () => {
        const { findAllByTestId, findByTestId } = render(
            getTestElement({
                state: true,
            }),
        );

		waitFor(() => {
			expect(findAllByTestId('test-span')).toHaveLength(3);
			expect(findByTestId('close-button')).toBeInTheDocument();
			expect(findByTestId('classic-footer')).toBeInTheDocument();
			expect(findByTestId('modal-description')).toBeInTheDocument();
			expect(findByTestId('modal-title')).toBeInTheDocument();
			// expect().toBeInTheDocument();
		});
	});

	it('snapshot test:', () => expect(render(getTestElement({ state: true })).container).toMatchSnapshot());
});
