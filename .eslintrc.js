module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['standard-with-typescript', 'plugin:react/recommended'],
  overrides: [
    {
      env: {
        node: true,
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react'],
  rules: {
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/semi': 'off',
    '@typescript-eslint/consistent-type-imports': 'off',
    '@typescript-eslint/comma-dangle': 'off',
    '@typescript-eslint/member-delimiter-style': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/space-before-function-paren': 'off',
    'react/react-in-jsx-scope': 'off',
    '@typescript-eslint/indent': 'off',
    'multiline-ternary': 'off',
  },
  ignorePatterns: [
    'metro.config.js',
    'postinstall.js',
    'package.json',
    'package-lock.json',
    'README.md',
    'app.json',
    'server.js',
    'assets/**',
    'expo-env.d.ts',
    'tsconfig.json',
    'types/**',
    'dist/**',
    'android/**',
    'ios/**',
  ],
};
