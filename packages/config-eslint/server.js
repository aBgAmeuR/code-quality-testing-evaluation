const { resolve } = require('node:path');

const project = resolve(process.cwd(), 'tsconfig.json');

/*
 * This is a custom ESLint configuration for use server side
 * typescript packages.
 *
 * This config extends the Vercel Engineering Style Guide.
 * For more information, see https://github.com/vercel/style-guide
 *
 */

module.exports = {
  extends: [
    ...['@vercel/style-guide/eslint/node'].map(require.resolve),
    'eslint-config-node'
  ],
  parserOptions: {
    project
  },
  env: {
    node: true,
    es6: true
  },
  plugins: ['only-warn', 'security', 'node'],
  settings: {
    'import/resolver': {
      typescript: {
        project
      }
    }
  },
  overrides: [
    {
      files: ['**/__tests__/**/*'],
      env: {
        jest: true
      }
    }
  ],
  ignorePatterns: ['.*.js', 'node_modules/', 'dist/'],
  rules: {
    'import/prefer-default-export': 'off',
    'import/no-default-export': 'error',
    'no-invalid-this': 'off',
    'no-sync': 'off',
    'import/no-default-export': 'off',
    'arrow-body-style': 'off',
    'empty-import-meta': 'off'
  }
};
