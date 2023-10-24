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
const pushMock = jest.fn();
// mock a return value on useRouter
(useRouter as jest.Mock).mockReturnValue({
	query: {},
	// return mock for push method
	push: pushMock,
	// ... add the props or methods you need
});

afterEach(cleanup);
