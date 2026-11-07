// @ts-nocheck
const eslint = require("@eslint/js");
const { defineConfig } = require("eslint/config");
const tseslint = require("@typescript-eslint/eslint-plugin");
const angular = require("@angular-eslint/eslint-plugin");
const angularTemplate = require("@angular-eslint/eslint-plugin-template");

module.exports = defineConfig([
  {
    files: ["**/*.ts"],
    extends: [
      eslint.configs && eslint.configs.recommended,
      tseslint.configs && tseslint.configs.recommended,
      tseslint.configs && tseslint.configs.stylistic,
      angular.configs && angular.configs.tsRecommended,
    ].filter(Boolean),
    processor:
      angular.processInlineTemplates || angularTemplate.processInlineTemplates,
    rules: {
      "@angular-eslint/directive-selector": [
        "error",
        {
          type: "attribute",
          prefix: "app",
          style: "camelCase",
        },
      ],
      "@angular-eslint/component-selector": [
        "error",
        {
          type: "element",
          prefix: "app",
          style: "kebab-case",
        },
      ],
    },
  },
  {
    files: ["**/*.html"],
    extends: [
      angularTemplate.configs && angularTemplate.configs.recommended,
      angularTemplate.configs && angularTemplate.configs.a11y,
    ].filter(Boolean),
    rules: {},
  },
]);
