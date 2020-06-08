const path = require('path');

module.exports = {
  extends: ['airbnb','airbnb-base'],
  parser: 'babel-eslint',
  plugins: [
    'chai-friendly',
    'jest',
    'react-hooks'
  ],
  env: {
    browser: true,
    'jest/globals': true,
    node: true
  },
  rules: {
    'react/jsx-props-no-spreading': 0,
    'react/jsx-filename-extension': [2, {
      extensions: ['.js']
    }],
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        "js": "never",
        "jsx": "never",
      },
    ],
    'no-nested-ternary': 0,
    'react/jsx-filename-extension': [2, {
      extensions: ['.js']
    }],
    'react/jsx-sort-default-props': 2,
    'react/sort-prop-types': 2,
    'react-hooks/rules-of-hooks': 2,
    'jsx-a11y/label-has-for': 0, // temporary until airbnb remove this deprecated rule from their configuration
    'jsx-a11y/label-has-associated-control': [2, {
      assert: 'either', // Because we use custom react components the nesting option cannot be respected for all cases
    }],
    'arrow-parens': [2, 'as-needed'],
    'chai-friendly/no-unused-expressions': 2,
    'consistent-return': 0,
    'import/no-extraneous-dependencies': 0,
    'import/no-named-as-default': 0,
    'import/order': 0,
    'import/prefer-default-export': 0,
    'no-console': [2, {
      allow: ['error', 'info']
    }],
    "no-multiple-empty-lines": [2, {
      "max": 1
    }],
    'no-param-reassign': [2, {
      props: false
    }],
    'no-plusplus': 0,
    'no-shadow': 0,
    'no-unused-expressions': 0,
    'object-curly-newline': [2, {
      multiline: true,
      consistent: true
    }]
  },
  settings: {
    'import/resolver': {
      'eslint-import-resolver-lerna': {
        packages: path.resolve(__dirname, 'packages')
      },
      node: {
        extensions: ['.js', '.json']
      },
    },
  },
};
