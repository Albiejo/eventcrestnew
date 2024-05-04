import { browser } from "globals";
import { configs } from "typescript-eslint";
import { recommended as pluginReactConfig } from "eslint-plugin-react";

export default {
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      parser: "@typescript-eslint/parser",
      extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:react/recommended"
      ],
      plugins: ["@typescript-eslint", "react"],
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: "module"
      },
      rules: {
        // Add any additional rules here
      }
    }
  ],
  globals: {
    // Add global variables here if needed
    ...browser
  }
};
