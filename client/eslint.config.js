// const react = require('eslint-plugin-react');
const reactRecommended = require('eslint-plugin-react/configs/recommended');
const globals = require('globals');

module.exports = [
	{
		"root": true,
		files: ['**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}'],
		rules: {
			// ... any rules you want
			'react/jsx-uses-react': 'error',
			'react/jsx-uses-vars': 'error',
		},
		...reactRecommended,
		languageOptions: {
			...reactRecommended.languageOptions,
			globals: {
				...globals.serviceworker,
				...globals.browser,
			},
		},
	},
];


// There is config from the old settings .eslintrc.json
// {
// 	"root": true,
// 	"env": {
// 		"browser": true,
// 		"es6": true
// 	},
// 	"extends": [
// 		"eslint:recommended",
// 		"plugin:react/recommended",
// 		"plugin:react/jsx-runtime",
// 		"prettier",
// 		"plugin:prettier/recommended",
// 		"next/core-web-vitals"
// 	],
// 	"parser": "eslint-plugin-react",
// 	"parserOptions": {
// 		"ecmaVersion": "latest",
// 		"sourceType": "module",
// 		"ecmaFeatures": {
// 			"jsx": true
// 		}
// 	},
// 	"plugins": [
// 		"react",
// 		"prettier",
// 		"react-hooks",
// 		"@typescript-eslint",
// 		"eslint-plugin-prettier"
// 	],
// 	"rules": {
// 		"react/prop-types": "off",
// 		"react/jsx-uses-react": "error",
// 		"react/jsx-uses-vars": "error",
// 		"react-hooks/rules-of-hooks": "warn",
// 		"react-hooks/exhaustive-deps": "warn",
// 		"react/jsx-filename-extension": ["warn", { "extensions": [".tsx"] }],

// 		"@typescript-eslint/no-empty-function": "off",
// 		"@typescript-eslint/ban-types": "off",
// 		"@typescript-eslint/ban-ts-comment": "off",
// 		"@typescript-eslint/no-unused-vars": "off",
// 		"@typescript-eslint/explicit-function-return-type": ["warn"],
// 		"@typescript-eslint/no-empty-interface": [
// 			"error",
// 			{
// 				"allowSingleExtends": true
// 			}
// 		],

// 		"prettier/prettier": [
// 			"error",
// 			{
// 				"parser": "typescript",
// 				"useTabs": true,
// 				"tabWidth": 2,
// 				"semi": true,
// 				"jsxSingleQuote": true,
// 				"singleQuote": true,
// 				"trailingComma": "all",
// 				"bracketSpacing": true,
// 				"bracketSameLine": false,
// 				"arrowParens": "avoid",
// 				"endOfLine": "auto",
// 				"printWidth": 120
// 			}
// 		]
// 	},

// 	"settings": {
// 		"react": {
// 		  "createClass": "createReactClass", // Regex for Component Factory to use,
// 											 // default to "createReactClass"
// 		  "pragma": "React",  // Pragma to use, default to "React"
// 		  "fragment": "Fragment",  // Fragment to use (may be a property of <pragma>), default to "Fragment"
// 		  "version": "detect", // React version. "detect" automatically picks the version you have installed.
// 							   // You can also use `16.0`, `16.3`, etc, if you want to override the detected value.
// 							   // It will default to "latest" and warn if missing, and to "detect" in the future
// 		  "flowVersion": "0.53" // Flow version
// 		},
// 		"propWrapperFunctions": [
// 			// The names of any function used to wrap propTypes, e.g. `forbidExtraProps`. If this isn't set, any propTypes wrapped in a function will be skipped.
// 			"forbidExtraProps",
// 			{"property": "freeze", "object": "Object"},
// 			{"property": "myFavoriteWrapper"},
// 			// for rules that check exact prop wrappers
// 			{"property": "forbidExtraProps", "exact": true}
// 		],
// 		"componentWrapperFunctions": [
// 			// The name of any function used to wrap components, e.g. Mobx `observer` function. If this isn't set, components wrapped by these functions will be skipped.
// 			"observer", // `property`
// 			{"property": "styled"}, // `object` is optional
// 			{"property": "observer", "object": "Mobx"},
// 			{"property": "observer", "object": "<pragma>"} // sets `object` to whatever value `settings.react.pragma` is set to
// 		],
// 		"formComponents": [
// 		  // Components used as alternatives to <form> for forms, eg. <Form endpoint={ url } />
// 		  "CustomForm",
// 		  {"name": "Form", "formAttribute": "endpoint"}
// 		],
// 		"linkComponents": [
// 		  // Components used as alternatives to <a> for linking, eg. <Link to={ url } />
// 		  "Hyperlink",
// 		  {"name": "Link", "linkAttribute": "to"}
// 		]
// 	  }
// }