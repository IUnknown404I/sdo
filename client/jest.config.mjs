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
	rootDir: './',
	setupFilesAfterEnv: ['<rootDir>/jest.setup.ts', '<rootDir>/jest-preload.ts'],
	testPathIgnorePatterns: [
		'/.next/',
		'/node_modules/',
		'/pw-tests/',
		'/pw-tests-examples/',
		'/coverage/',
		'./jest.setup.ts',
		'./jest-preload.ts',
	],
	moduleNameMapper: {
		'\\.(scss|sass|css)$': 'identity-obj-proxy',
		// axios: 'axios/dist/node/axios.cjs',
	},

	verbose: true,
	testEnvironment: 'node',
	collectCoverage: true,
	collectCoverageFrom: ['<rootDir>/**/*.{js,jsx,ts,tsx}'],
	coveragePathIgnorePatterns: [
		'<rootDir>/node_modules/',
		'<rootDir>/__mocks__/',
		'<rootDir>/__tests__/',
		'<rootDir>/.github/',
		'<rootDir>/.idea/',
		'<rootDir>/.next/',
		'<rootDir>/.storybook/',
		'<rootDir>/.swc/',
		'<rootDir>/.vscode/',

		'<rootDir>/pages/',
		'<rootDir>/gitHooks/',
		'<rootDir>/dist/',
		'<rootDir>/docker/',
		'<rootDir>/coverage/',
		'<rootDir>/playwright-report/',
		'<rootDir>/public/',
		'<rootDir>/pw-tests/',
		'<rootDir>/pw-tests-examples/',
		'<rootDir>/stories/',
		'<rootDir>/storybook-static/',
		'<rootDir>/textEditor/',
	],
	// coverageThreshold: {
	// 	global: {
	// 		lines: 90,
	// 		statements: 90,
	// 	},
	// },

	testEnvironment: 'jest-environment-jsdom',
	transformIgnorePatterns: ['/node-modules/axios'],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config);
