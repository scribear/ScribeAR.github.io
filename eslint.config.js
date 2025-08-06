import { globalIgnores } from 'eslint/config';
import js from '@eslint/js';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import eslintConfigPrettierFlat from 'eslint-config-prettier/flat';
import eslintReact from '@eslint-react/eslint-plugin';
import globals from 'globals';

/**
 * @see https://typescript-eslint.io/getting-started/#step-2-configuration
 * @see https://typescript-eslint.io/users/configs
 * @see https://eslint.org/docs/latest/use/configure/
 *
 * This config object configures ESLint
 * ESLint is a code linter that analyzes code before it is run
 * This helps
 * - Catch potential errors
 * - Mantain code quality
 */
export default tseslint.config([
  // Ignore files in /dist folder (build output folder)
  globalIgnores(['dist']),
  {
    // Only lint Typescript files
    files: ['**/*.{ts,tsx}'],
    extends: [
      /**
       * @see https://eslint.org/docs/latest/use/configure/configuration-files#using-predefined-configurations
       * Uses recommended ESLint rules for Javscript provided by ESLint
       */
      js.configs.recommended,

      /**
       * @see https://typescript-eslint.io/users/configs#strict-type-checked
       * Uses strict ESLint rules to prevent bugs provided by typescript-eslint
       */
      tseslint.configs.strictTypeChecked,

      /**
       * @see https://typescript-eslint.io/users/configs#stylistic-type-checked
       * Uses ESLint rules for Typescript best practices provided by typescript-eslint
       */
      tseslint.configs.stylisticTypeChecked,

      /**
       * @see https://react.dev/reference/rules/rules-of-hooks
       * @see https://react.dev/learn/react-compiler/installation#eslint-integration
       * Allows ESLint to enforce the "Rules of Hooks"
       */
      reactHooks.configs['recommended-latest'],

      /**
       * @see https://github.com/ArnaudBarre/eslint-plugin-react-refresh
       * Allows ESLint to ensure your components can be safely updated with Fast Refresh
       */
      reactRefresh.configs.vite,

      /**
       * @see https://eslint-react.xyz/docs/presets#typescript-specialized
       * Allows ESLint to enforce rules that are recommended general purpose React + React DOM projects
       */
      eslintReact.configs['recommended-type-checked'],

      /**
       * @see https://github.com/prettier/eslint-config-prettier
       * Disables ESLint rules that conflict with Prettier
       */
      eslintConfigPrettierFlat,
    ],
    languageOptions: {
      /**
       * @see https://typescript-eslint.io/getting-started/typed-linting
       * Typescript parsing is required for type checked ESLint rules
       */
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
      // Match tsconfig.json version target
      ecmaVersion: 2020,
      // Configures global variables ESLint should be aware of
      globals: {
        // Include global variables provided by browsers
        ...globals.browser,
      },
    },
    rules: {
      /**
       * @see https://typescript-eslint.io/rules/naming-convention/
       * A collection of rules for consistent identifier naming
       */
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: [
            'accessor',
            'parameter',
            'classProperty',
            'classMethod',
            'variable',
          ],
          // Prefer camelCase but allow UPPER_CASE for global variables
          format: ['camelCase', 'UPPER_CASE'],
        },
        {
          selector: ['function'],
          // React components should be PascalCase, otherwise camelCase
          format: ['PascalCase', 'camelCase'],
        },
        {
          selector: ['class', 'interface'],
          format: ['PascalCase'],
        },
        {
          selector: ['enum'],
          format: ['PascalCase'],
        },
        {
          selector: ['enumMember'],
          format: ['UPPER_CASE'],
        },
        {
          // Ensure private class attributes are identified by leading underscore
          selector: ['accessor', 'classProperty', 'classMethod'],
          modifiers: ['private'],
          format: null,
          leadingUnderscore: 'require',
          trailingUnderscore: 'forbid',
        },
        {
          // Ensure protected class attributes are identified by leading underscore
          selector: ['accessor', 'classProperty', 'classMethod'],
          modifiers: ['protected'],
          format: null,
          leadingUnderscore: 'require',
          trailingUnderscore: 'forbid',
        },
        {
          // Ensure protected class attributes do not have leading/trailing underscore
          selector: ['accessor', 'classProperty', 'classMethod'],
          modifiers: ['public'],
          format: null,
          leadingUnderscore: 'forbid',
          trailingUnderscore: 'forbid',
        },
        {
          // Ensure all other identifiers do not have leading/trailing underscore
          selector: [
            'class',
            'enum',
            'enumMember',
            'function',
            'interface',
            'objectLiteralMethod',
            'objectLiteralProperty',
            'typeAlias',
            'typeMethod',
            'typeParameter',
            'typeProperty',
            'variable',
          ],
          format: null,
          leadingUnderscore: 'forbid',
          trailingUnderscore: 'forbid',
        },
      ],
    },
  },
]);
