import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";
import { defineConfig } from "eslint/config";
import eslintPluginUnicorn from 'eslint-plugin-unicorn';
import reactHooks from 'eslint-plugin-react-hooks';
import stylistic from '@stylistic/eslint-plugin'
import depend from 'eslint-plugin-depend';
import sonarjs from 'eslint-plugin-sonarjs';
import deMorgan from 'eslint-plugin-de-morgan'
import betterStyledComponents from "eslint-plugin-better-styled-components"
import tailwind from "eslint-plugin-tailwindcss";
import functional from "eslint-plugin-functional";
import eslintPluginMath from 'eslint-plugin-math';
import importPlugin from 'eslint-plugin-import';
import splitAndSortImports from "@sngn/eslint-plugin-split-and-sort-imports";

export default defineConfig([
  tseslint.configs.stylisticTypeChecked,
  eslintPluginUnicorn.configs.all,
  reactHooks.configs['recommended-latest'],
  react.configs.flat.all,
  js.configs.all,
  stylistic.configs.all,
  sonarjs.configs.recommended,
  deMorgan.configs.recommended,
  tailwind.configs["flat/recommended"],
  functional.configs.all,
  eslintPluginMath.configs.recommended,
  importPlugin.flatConfigs.recommended,
  splitAndSortImports.configs.recommended,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: globals.browser,
    },
    plugins: {
      depend,
      "better-styled-components": betterStyledComponents,
    },
    extends: ['depend/flat/recommended'],
    rules: {
      "functional/no-let": "off",
      "unicorn/no-keyword-prefix": "off",
      "capitalized-comments": "off",
      "sonarjs/slow-regex": "off",
      "import/no-named-as-default-member": "off",
      "@stylistic/multiline-comment-style": "off",
      "no-redeclare": "off",
      "better-styled-components/sort-declarations-alphabetically": 2,
      "depend/ban-dependencies": "error",
      "unicorn/filename-case": "off",
      "max-params": "off",
      "max-lines": "off",
      "@stylistic/newline-per-chained-call": "off",
      "split-and-sort-imports/split-imports": "off",
      "no-warnings-comments": "off",
      "react/react-in-jsx-scope": "off",
      "react/jsx-filename-extension": "off",
      "max-lines-per-function": "off",
      "complexity": "off",
      "no-magic-numbers": "off",
      "functional/no-expression-statements": "off",
      "one-var": "off",
      "no-unused-vars": ["error", { "varsIgnorePattern": "^_", "argsIgnorePattern": "^_" }],
      "sonarjs/no-unused-vars": "off",
      "functional/no-mixed-types": "off",
      "react/jsx-handler-names": "off",
      "sonarjs/different-types-comparison": "off",
      "@stylistic/function-call-argument-newline": ["error", "never"],
      "@stylistic/no-confusing-arrow": "off",
      "functional/immutable-data": "off",
      "react/jsx-max-props-per-line": "off",
      "react/jsx-one-expression-per-line": "off",
      "react/jsx-no-literals": "off",
      "functional/no-conditional-statements": "off",
      "max-statements": "off",
      "consistent-return": "off",
      "functional/type-declaration-immutability": "off",
      "react/jsx-wrap-multilines": ["error", {
        "declaration": "never",
        "assignment": "never",
        "return": "never",
        "arrow": "never",
        "condition": "never",
        "logical": "never",
        "prop": "never"
      }],
      "react/jsx-indent": "off",
      "react/jsx-closing-tag-location": ["error", "line-aligned"],
      "react/jsx-newline": "off",
      "no-warning-comments": "off",
      "react/jsx-max-depth": "off",
      "react/jsx-no-bind": "off",
      "no-ternary": "off",
      "no-undefined": "off",
      "react/require-default-props": "off",
      "@stylistic/array-element-newline": ["error", "consistent"],
      "@stylistic/indent": ["error", 2],
      "indent": "off",
      "curly": ["error", "multi"],
      "@stylistic/padded-blocks": ["error", "never"],
      "@stylistic/multiline-ternary": ["error", "never"],
      "react/jsx-indent-props": "off",
      "@stylistic/quote-props": ["error", "consistent-as-needed"],
      "@stylistic/arrow-parens": ["error", "as-needed"],
      '@stylistic/jsx-one-expression-per-line': "off",
      "@stylistic/object-property-newline": "off",
      "functional/prefer-immutable-types": "off",
      "no-underscore-dangle": "off",
      "unicorn/no-array-for-each": "off",
      "import/no-unresolved": "off",
      "sonarjs/cognitive-complexity": "off",
      "@stylistic/object-curly-spacing": ["error", "always"],
      "sonarjs/todo-tag": "off",
      "functional/functional-parameters": "off",
      "functional/no-return-void": "off",
      "react/no-multi-comp": "off",
      "id-length": "off",
      "sort-imports": "off",
      "react/function-component-definition": ["off", {
        "namedComponents": "arrow-function"
      }]
    }
  },
]);