const { resolve } = require("node:path");

const project = resolve(process.cwd(), "tsconfig.json");

/*
 * This is a custom ESLint configuration for use with
 * Next.js apps.
 *
 * This config extends the Vercel Engineering Style Guide.
 * For more information, see https://github.com/vercel/style-guide
 *
 */

module.exports = {
  extends: [
    ...[
      "@vercel/style-guide/eslint/node",
      "@vercel/style-guide/eslint/browser",
      "@vercel/style-guide/eslint/react",
      "@vercel/style-guide/eslint/next",
    ].map(require.resolve),
    "plugin:tailwindcss/recommended",
    "turbo",
    "eslint-config-react-app",
    "eslint-config-prettier",
    "plugin:prettier/recommended"
  ],
  parserOptions: {
    project,
  },
  globals: {
    React: true,
    JSX: true,
  },
  plugins: ["only-warn", "react-hooks", "jsx-a11y", "prettier", "simple-import-sort"],
  settings: {
    "import/resolver": {
      typescript: {
        project,
      },
    },
    tailwindcss: {
      callees: ["cn"],
      config: "tailwind.config.ts"
    },
  },
  ignorePatterns: [".*.js", "node_modules/", "dist/"],
  // add rules configurations here
  rules: {
    'import/prefer-default-export': 'off',
    "import/no-default-export": "off",
    "prettier/prettier": [
      "error",
      {
        endOfLine: "auto",
        singleQuote: false
      }
    ],
    "sort-imports": "off",
    "tailwindcss/classnames-order": "off",
    "tailwindcss/no-custom-classname": "off",
    "@typescript-eslint/no-var-requires": "off",
    "prefer-named-capture-group": "off",
    "import/no-unresolved": "off",
    "no-nested-ternary": "off",
    "react-hooks/rules-of-hooks": "off",
    "no-useless-escape": "off",
    "react/function-component-definition": "off",
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
    "eslint-comments/require-description": "off",
    "jsx-a11y/alt-text": "warn",
    "jsx-a11y/no-autofocus": "warn",
  },
};
