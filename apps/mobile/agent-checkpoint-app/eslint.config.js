// Mobile-app specific ESLint configuration
// Extends root config with React and React Native specific rules

import rootConfig from '../../../eslint.config.js';

export default [
  ...rootConfig,
  {
    files: ['**/*.{tsx,ts,jsx,js}'],
    rules: {
      // Allow require in React Native context if needed
      '@typescript-eslint/no-require-imports': 'off',
      // React Native and Expo commonly use default exports
      'import/no-default-export': 'off',
      // Path aliases like @/ are resolved by Expo
      'import/no-unresolved': 'off',
    },
  },
];
