import { configs } from "eslint-plugin-react-hooks";
import { createTypeScriptImportResolver } from "eslint-import-resolver-typescript";
import deMorgan from "eslint-plugin-de-morgan";
import depend from "eslint-plugin-depend";
import eslint from "@eslint/js";
import eslintPluginMath from "eslint-plugin-math";
import eslintPluginUnicorn from "eslint-plugin-unicorn";
import eslintReact from "@eslint-react/eslint-plugin";
import functional from "eslint-plugin-functional";
import github from "eslint-plugin-github";
import { globalIgnores } from "eslint/config";
import globals from "globals";
import { importX } from "eslint-plugin-import-x";
import preferArrayFunc from "eslint-plugin-prefer-arrow-functions";
import react from "eslint-plugin-react";
import sonarjs from "eslint-plugin-sonarjs";
import splitAndSortImports from "@sngn/eslint-plugin-split-and-sort-imports";
import stylistic from "@stylistic/eslint-plugin";
import tailwind from "eslint-plugin-tailwindcss";
import tseslint from "typescript-eslint";
import zod from "eslint-plugin-zod";

export default tseslint.config([
  globalIgnores(["dist/"]),
  eslintPluginUnicorn.configs.all,
  configs["recommended-latest"],
  eslint.configs.all,
  stylistic.configs.all,
  sonarjs.configs.recommended,
  deMorgan.configs.recommended,
  tailwind.configs["flat/recommended"],
  eslintPluginMath.configs.recommended,
  splitAndSortImports.configs.recommended,
  // tseslint.configs.stylisticTypeChecked,
  // tseslint.configs.strictTypeChecked,
  eslintReact.configs.all,
  functional.configs.all,
  react.configs.flat["all"],
  importX.flatConfigs.recommended,
  importX.flatConfigs.react,
  importX.flatConfigs.typescript,
  github.getFlatConfigs().browser,
  github.getFlatConfigs().recommended,
  github.getFlatConfigs().react,
  ...github.getFlatConfigs().typescript,
  {
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        },
        projectService: true,
        tsconfigRootDir: import.meta.dirname
      }
    },
    plugins: { depend, zod, react, "prefer-arrow-functions": preferArrayFunc },
    settings: {
      "import-x/resolver-next": [
        createTypeScriptImportResolver({
          alwaysTryTypes: true,
          bun: true
        })
      ]
    },
    rules: {
      "@eslint-react/avoid-shorthand-fragment": "off",
      "@eslint-react/naming-convention/filename": "off",
      "@stylistic/array-element-newline": ["error", "consistent"],
      "prettier/prettier": "off",
      "functional/no-try-statements": "off",
      "react/function-component-definition": "off",
      "react/jsx-closing-tag-location": "off",
      "prefer-arrow-functions/prefer-arrow-functions": "error",
      "react/forbid-component-props": "off",
      "depend/ban-dependencies": "off",
      "i18n-text/no-en": "off",
      "react/require-default-props": "off",
      "prefer-arrow-callback": "error",
      "react/no-multi-comp": "off",
      "comma-dangle": ["error", "never"],
      "no-inline-comments": "off",
      "@typescript-eslint/consistent-type-imports": "error",
      "react/jsx-no-literals": "off",
      "react/jsx-max-props-per-line": "off",
      "react/jsx-props-no-spreading": "off",
      "github/array-foreach": "off",
      "react/jsx-max-depth": "off",
      "react/jsx-no-bind": "off",
      "dot-notation": "off",
      "@eslint-react/jsx-no-iife": "off",
      "react/button-has-type": "off",
      "github/filenames-match-regex": "off",
      "@eslint-react/no-complex-conditional-rendering": "off",
      "@eslint-react/prefer-react-namespace-import": "off",
      "@stylistic/arrow-parens": ["error", "as-needed"],
      "@stylistic/function-call-argument-newline": ["error", "never"],
      "@stylistic/brace-style": ["error", "1tbs", { allowSingleLine: true }],
      "@stylistic/operator-linebreak": ["error", "none"],
      "@stylistic/implicit-arrow-linebreak": ["error", "beside"],
      "@stylistic/indent": ["error", 2],
      "@stylistic/jsx-one-expression-per-line": "off",
      "@stylistic/jsx-newline": ["error", { prevent: true }],
      "github/a11y-no-title-attribute": "off",
      "import-x/no-named-as-default-member": "off",
      "@stylistic/jsx-wrap-multilines": "off",
      "github/no-then": "off",
      "react/jsx-indent": "off",
      "react/jsx-filename-extension": "off",
      "react/jsx-one-expression-per-line": "off",
      "react/react-in-jsx-scope": "off",
      "react/jsx-newline": ["error", { prevent: true }],
      "@stylistic/jsx-first-prop-new-line": ["error", "never"],
      "no-duplicate-imports": "error",
      "react/jsx-wrap-multilines": [
        "error", {
          declaration: "never",
          assignment: "never",
          return: "never",
          arrow: "never",
          condition: "never",
          logical: "never",
          prop: "never"
        }
      ],
      "tailwindcss/classnames-order": "off",
      "unicorn/no-useless-undefined": "off",
      "functional/no-loop-statements": "off",
      "no-plusplus": "off",
      "@eslint-react/dom/no-dangerously-set-innerhtml": "off",
      "@typescript-eslint/no-confusing-void-expression": "off",
      "sort-keys": "off",
      "@typescript-eslint/no-unnecessary-condition": "error",
      "init-declarations": "off",
      "@eslint-react/avoid-shorthand-boolean": "off",
      "tailwindcss/no-custom-classname": "off",
      "@stylistic/multiline-comment-style": "off",
      "@stylistic/multiline-ternary": ["error", "never"],
      "@stylistic/newline-per-chained-call": "off",
      "@stylistic/lines-between-class-members": "off",
      "@stylistic/no-confusing-arrow": "off",
      "sonarjs/no-nested-functions": "off",
      "@stylistic/object-curly-spacing": ["error", "always"],
      "@stylistic/object-property-newline": "off",
      "@stylistic/padded-blocks": ["error", "never"],
      "@stylistic/quote-props": ["error", "consistent-as-needed"],
      "@typescript-eslint/consistent-indexed-object-style": "off",
      "capitalized-comments": "off",
      "complexity": "off",
      "@typescript-eslint/restrict-template-expressions": "off",
      "@typescript-eslint/no-floating-promises": "off",
      "@typescript-eslint/no-misused-promises": "off",
      "consistent-return": "off",
      "curly": ["error", "multi"],
      "functional/functional-parameters": "off",
      "functional/immutable-data": "off",
      "functional/no-conditional-statements": "off",
      "functional/no-expression-statements": "off",
      "functional/no-let": "off",
      "functional/no-mixed-types": "off",
      "functional/no-return-void": "off",
      "functional/no-throw-statements": "off",
      "functional/prefer-immutable-types": "off",
      "functional/type-declaration-immutability": "off",
      "id-length": "off",
      "import/no-named-as-default-member": "off",
      "import/no-unresolved": "off",
      "indent": "off",
      "max-lines": "off",
      "max-lines-per-function": "off",
      "max-params": "off",
      "max-statements": "off",
      "new-cap": "off",
      "no-magic-numbers": "off",
      "no-redeclare": "off",
      "no-ternary": "off",
      "no-undefined": "off",
      "no-underscore-dangle": "off",
      "no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }
      ],
      "no-warning-comments": "off",
      "no-warnings-comments": "off",
      "one-var": "off",
      "sonarjs/cognitive-complexity": "off",
      "sonarjs/different-types-comparison": "off",
      "sonarjs/no-unused-vars": "off",
      "unicorn/prevent-abbreviations": "off",
      "sonarjs/slow-regex": "off",
      "sonarjs/todo-tag": "off",
      "sort-imports": "off",
      "split-and-sort-imports/split-imports": "off",
      "unicorn/filename-case": "off",
      "unicorn/no-array-for-each": "off",
      "unicorn/no-keyword-prefix": "off",
      "unicorn/prefer-global-this": "off"
    }
  }
]);
