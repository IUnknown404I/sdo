import { useRouter } from 'next/router';
import { cleanup } from '@testing-library/react';

global.console = {
	...console,
	log: jest.fn(),
	// debug: jest.fn(),
	info: jest.fn(),
	warn: jest.fn(),
	error: jest.fn(),
};

// mock useRouter
jest.mock('next/router', () => ({
	useRouter: jest.fn(),
}));

// setup a new mocking function for push method
const pushMock = jest.fn(() => new Promise(() => true));
// mock a return value on useRouter
(useRouter as jest.Mock).mockReturnValue({
	query: {},
	route: '/login',
	asPath: 'login',
	push: pushMock,
	// push: () => new Promise(() => true),
});

afterEach(cleanup);
