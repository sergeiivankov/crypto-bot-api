import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import tsdoc from "eslint-plugin-tsdoc";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["src/**/*.ts"],
    plugins: { tsdoc },
    rules: { "@typescript-eslint/no-explicit-any": "off" }
  }
);