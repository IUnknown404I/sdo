/**
 * THE TESTING WILL LOGS THE ERRORS DUO PARSING STRINGS VIA "startsWith()".
 * THIS IS CAUSE THE AXIOS INSTANCE JEST-IMPORT ERROR IN NESTED ELEMENTS.
 */

import nextJest from 'next/jest.js';
// import { defaults as tsjPreset } from 'ts-jest/presets/index.js';

const createJestConfig = nextJest({
	// Provide the path to your Next.js app to load next.config.js and .env files in your test environment
	dir: './',
});

// Add any custom config to be passed to Jest
/** @type {import('jest').Config} */
const config = {
	// preset: '@shelf/jest-mongodb',
	// transform: { ...tsjPreset.transform },
	preset: 'ts-jest',
	setupFilesAfterEnv: ['<rootDir>/jest.setup.ts', '<rootDir>/jest-preload.ts'],
	testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
	moduleNameMapper: {
		'\\.(scss|sass|css)$': 'identity-obj-proxy',
	},
	verbose: true,
	testEnvironment: 'node',
	collectCoverage: true,
	moduleNameMapper: {
		axios: 'axios/dist/node/axios.cjs',
	},
	testEnvironment: 'jest-environment-jsdom',
	transformIgnorePatterns: ['/node-modules/axios'],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config);
