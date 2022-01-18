// eslint + prettier 설정 참고 : https://pravusid.kr/javascript/2019/03/10/eslint-prettier.html

module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['react-app', 'react-app/jest', 'airbnb', 'plugin:prettier/recommended'],
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
  },
  overrides: [
    {
      files: ['**/*.stories.*'],
      rules: {
        'import/no-anonymous-default-export': 'off',
      },
    },
  ],
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/jsx-props-no-spreading': 'off',
    'import/prefer-default-export': 'off',
    'react/prop-types': 'off',
    'no-underscore-dangle': 'off',
    'no-shadow': 'warn',
    'consistent-return': 'warn',
    'no-plusplus': 'warn',
    'no-return-await': 'warn',
    'prefer-promise-reject-errors': 'warn',
    'react/require-default-props': 'warn',
    'import/no-unresolved': ['warn', { caseSensitive: false }],
    'import/no-cycle': 'warn',
    'no-unused-vars': 'warn',
  },
};
