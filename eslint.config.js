// @ts-check
import config from "@ethang/eslint-config/eslint.config.js";
import tseslint from "typescript-eslint";

export default tseslint.config(...config, {
  languageOptions: {
    parserOptions: {
      project: true,
      tsconfigRootDir: "./tsconfig.json",
    },
  },
  rules: {
    "unicorn/prefer-json-parse-buffer": "off",
    "no-console": "off",
  },
});
