module.exports = {
  root: true,
  extends: '@react-native-community',
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['airbnb-base'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'max-len': [2, 120, 4, { ignoreUrls: true }],
    'object-curly-newline': 'off',
    'no-console': 'off',
    'global-require': 'off',
    'import/no-dynamic-require': 'off',
    'import/no-unresolved': 'off',
    'no-plusplus': 'off',
  },
};
