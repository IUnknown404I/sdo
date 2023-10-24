export default {
	parser: '@typescript-eslint/parser',
	parserOptions: {
		project: 'tsconfig.json',
		tsconfigRootDir: __dirname,
		sourceType: 'module',
	},

	plugins: ['@typescript-eslint/eslint-plugin'],
	extends: ['plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended', 'plugin:nestjs/recommended'],
	root: true,
	env: {
		node: true,
		jest: true,
	},
	ecmaFeatures: {
		modules: true,
	},
	ignorePatterns: ['.eslintrc.js'],

	'prettier/prettier': 'warn',
	rules: {
		'@typescript-eslint/interface-name-prefix': 'off',
		'@typescript-eslint/explicit-function-return-type': 'off',
		'@typescript-eslint/explicit-module-boundary-types': 'off',
		'@typescript-eslint/no-explicit-any': 'off',
		'@typescript-eslint/no-unused-vars': 'off',
		'react/no-unknown-property': 'off',
		'react-hooks/exhaustive-deps': 'off',
		'@next/next/no-img-element': 'off',
		'prefer-const': 'off',
	},
};
