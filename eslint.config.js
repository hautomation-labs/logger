import eslint from '@eslint/js';
import tsEslint from 'typescript-eslint';
import unusedImports from 'eslint-plugin-unused-imports';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import prettier from 'eslint-config-prettier';

export default [
	// Ignores
	{
		ignores: ['**/dist/', '**/node_modules/', '**/coverage/', 'eslint.config.js', '*.config.ts'],
	},

	// Base JS + TS
	eslint.configs.recommended,
	...tsEslint.configs.recommended,

	// Main configuration for TypeScript files
	{
		files: ['**/*.ts'],
		languageOptions: {
			parser: tsEslint.parser,
			ecmaVersion: 2022,
			sourceType: 'module',
			parserOptions: {
				project: ['tsconfig.json'],
			},
		},
		plugins: {
			'@typescript-eslint': tsEslint.plugin,
			'unused-imports': unusedImports,
			'simple-import-sort': simpleImportSort,
			prettier: eslintPluginPrettier,
		},
		rules: {
			// TypeScript hygiene
			'@typescript-eslint/no-unused-vars': 'off',
			'unused-imports/no-unused-imports': 'error',
			'unused-imports/no-unused-vars': [
				'warn',
				{
					vars: 'all',
					varsIgnorePattern: '^_',
					args: 'after-used',
					argsIgnorePattern: '^_',
				},
			],
			'@typescript-eslint/ban-ts-comment': ['error', { 'ts-expect-error': 'allow-with-description' }],
			'@typescript-eslint/no-explicit-any': 'warn',
			'@typescript-eslint/no-shadow': 'error',
			'@typescript-eslint/no-non-null-assertion': 'warn',
			'@typescript-eslint/no-empty-function': 'warn',
			'@typescript-eslint/no-require-imports': 'off', // Allow require for Node.js conditional imports

			// Import sorting
			'sort-imports': 'off',
			'simple-import-sort/imports': [
				'warn',
				{
					groups: [
						['^\\u0000'], // Side effects
						['^node:', '^@?\\w'], // Node builtins and external packages
						['^\\.\\.(?!/?$)', '^\\.\\./?$'], // Parent imports
						['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'], // Sibling and index imports
					],
				},
			],
			'simple-import-sort/exports': 'warn',

			// General best practices
			'no-console': 'off',
			'no-var': 'error',
			'prefer-const': 'warn',
			eqeqeq: ['error', 'smart'],
			curly: ['error', 'multi-line'],
			'no-empty': 'off',
			'no-shadow': 'off',

			// Prettier via ESLint (reads from .prettierrc)
			'prettier/prettier': 'warn',
		},
	},

	// Keep this last to disable conflicting ESLint rules
	prettier,
];
