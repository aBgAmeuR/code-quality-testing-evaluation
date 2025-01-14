const { resolve } = require("node:path");

const project = resolve(process.cwd(), "tsconfig.json");

/*
 * This is a custom ESLint configuration for use a library
 * that utilizes React.
 *
 * This config extends the Vercel Engineering Style Guide.
 * For more information, see https://github.com/vercel/style-guide
 *
 */

module.exports = {
  extends: [
    ...[
      "@vercel/style-guide/eslint/browser",
      "@vercel/style-guide/eslint/react",
    ].map(require.resolve),
    "eslint-config-react-app",
  ],
  parserOptions: {
    project,
  },
  globals: {
    JSX: true,
  },
  plugins: ["only-warn", "react-hooks", "jsx-a11y"],
  settings: {
    "import/resolver": {
      typescript: {
        project,
      },
    },
  },
  ignorePatterns: ["node_modules/", "dist/", ".eslintrc.js", "**/*.css"],
  // add rules configurations here
  rules: {
    'import/prefer-default-export': 'off',
    'import/no-default-export': 'error',
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "import/order": [
      "error",
      {
        "groups": ["builtin", "external", "internal"],
        "pathGroups": [
          {
            "pattern": "react",
            "group": "external",
            "position": "before"
          }
        ],
        "pathGroupsExcludedImportTypes": ["react"],
        "newlines-between": "always",
        "alphabetize": {
          "order": "asc",
          "caseInsensitive": true
        }
      }
    ],
    "jsx-a11y/anchor-is-valid": "warn",
    "react-hooks/rules-of-hooks": "off",
    "jsx-a11y/alt-text": "warn",
    "jsx-a11y/no-autofocus": "warn",
  },
};
