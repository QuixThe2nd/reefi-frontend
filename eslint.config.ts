import betterStyledComponents from "eslint-plugin-better-styled-components";
import deMorgan from "eslint-plugin-de-morgan";
import { defineConfig } from "eslint/config";
import depend from "eslint-plugin-depend";
import eslintPluginMath from "eslint-plugin-math";
import eslintPluginUnicorn from "eslint-plugin-unicorn";
import eslintReact from "@eslint-react/eslint-plugin";
import functional from "eslint-plugin-functional";
import globals from "globals";
import js from "@eslint/js";
import reactHooks from "eslint-plugin-react-hooks";
import sonarjs from "eslint-plugin-sonarjs";
import splitAndSortImports from "@sngn/eslint-plugin-split-and-sort-imports";
import stylistic from "@stylistic/eslint-plugin";
import tailwind from "eslint-plugin-tailwindcss";
import tseslint from "typescript-eslint";

export default defineConfig([
  eslintPluginUnicorn.configs.all,
  reactHooks.configs["recommended-latest"],
  js.configs.all,
  stylistic.configs.all,
  sonarjs.configs.recommended,
  deMorgan.configs.recommended,
  tailwind.configs["flat/recommended"],
  eslintPluginMath.configs.recommended,
  splitAndSortImports.configs.recommended,
  tseslint.configs.stylisticTypeChecked,
  eslintReact.configs.all,
  functional.configs.all,
  {
    extends: ["depend/flat/recommended"],
    languageOptions: {
      globals: globals.browser,
      // parser: tsParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        },
        projectService: true,
        tsconfigRootDir: import.meta.dirname
      }
    },
    plugins: {
      "better-styled-components": betterStyledComponents,
      depend
    },
    rules: {
      "@eslint-react/avoid-shorthand-fragment": "off",
      "@eslint-react/naming-convention/filename": "off",
      "@stylistic/array-element-newline": ["error", "consistent"],
      "@stylistic/arrow-parens": ["error", "as-needed"],
      "@stylistic/function-call-argument-newline": ["error", "never"],
      "@stylistic/indent": ["error", 2],
      "@stylistic/jsx-one-expression-per-line": "off",
      "@stylistic/multiline-comment-style": "off",
      "@stylistic/multiline-ternary": ["error", "never"],
      "@stylistic/newline-per-chained-call": "off",
      "@stylistic/no-confusing-arrow": "off",
      "@stylistic/object-curly-spacing": ["error", "always"],
      "@stylistic/object-property-newline": "off",
      "@stylistic/padded-blocks": ["error", "never"],
      "@stylistic/quote-props": ["error", "consistent-as-needed"],
      "@typescript-eslint/consistent-indexed-object-style": "off",
      "better-styled-components/sort-declarations-alphabetically": 2,
      "capitalized-comments": "off",
      "complexity": "off",
      "consistent-return": "off",
      "curly": ["error", "multi"],
      "depend/ban-dependencies": "error",
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
      "no-unused-vars": ["error", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
      "no-warning-comments": "off",
      "no-warnings-comments": "off",
      "one-var": "off",
      "sonarjs/cognitive-complexity": "off",
      "sonarjs/different-types-comparison": "off",
      "sonarjs/no-unused-vars": "off",
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
