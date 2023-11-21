const config = {
	root: true,
	parserOptions: {
		ecmaVersion: 2021,
		sourceType: 'module',
	},
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'next/core-web-vitals',
		'prettier', //! must be last
	],
	overrides: [
		{
			files: ['**/*.{tsx,jsx}'],
			extends: ['plugin:react/recommended', 'plugin:react-hooks/recommended'],
			parserOptions: {
				ecmaFeatures: {
					jsx: true,
				},
			},
			rules: {
				'react/display-name': 'off',
				'react/jsx-key': 'warn',
				// 'react/no-escaped-entities': 'warn',
				'react/prop-types': 'warn',
				'react/react-in-jsx-scope': 'off',
				'react-hooks/rules-of-hooks': 'warn',
				'react-hooks/exhaustive-deps': 'warn',
			},
			settings: {
				react: {
					version: 'detect',
				},
			},
		},
	],
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint'],
	rules: {
		'no-async-promise-executor': 'warn',
		'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
		'no-prototype-builtins': 'off',
		'no-useless-escape': 'off',
		'@typescript-eslint/no-unused-vars': 'warn',
	},
};

module.exports = config;
