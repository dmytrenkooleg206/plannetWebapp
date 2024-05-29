module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: [
    'next',
    'next/core-web-vitals',
    'eslint:recommended',
    'airbnb',
    'airbnb-typescript',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:prettier/recommended',
  ],
  overrides: [
    {
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
      },
      plugins: ['react', '@typescript-eslint'],
      files: ['*.ts', '*.tsx'],
    },
  ],
  rules: {
    'no-param-reassign': 'off',
    "@next/next/no-img-element": "off",
    "import/no-extraneous-dependencies": "off",
    'react/react-in-jsx-scope': 'off',
    'react/jsx-no-useless-fragment': 'off',
    'react/jsx-props-no-spreading': 'off',
    'no-unused-vars': 'warn',
    'react/require-default-props': 'off',
    'import/prefer-default-export': 'off',
    'jsx-a11y/click-events-have-key-events': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-shadow': 'off',
    'object-curly-newline': 'off',
    "prettier/prettier": [
      "error",
      {
        "endOfLine": "auto"
      },
    ],
    "jsx-a11y/label-has-associated-control": 'off',
    "jsx-a11y/no-noninteractive-element-interactions" : 'off',
    "jsx-a11y/no-static-element-interactions": 'off',
    "import/no-cycle": 'off',
    "no-nested-ternary": 'off',
    "react/no-array-index-key": 'off',
    "react/no-unused-prop-types": "off",
    "no-console": 'off',
    "react/button-has-type": 'off',
    "react/no-unknown-property": 'off',
    "@next/next/no-sync-scripts": 'off'
  },
};
