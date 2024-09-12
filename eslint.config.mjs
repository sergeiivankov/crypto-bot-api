import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import tsdoc from "eslint-plugin-tsdoc";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["src/**/*"],
    plugins: { tsdoc },
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "tsdoc/syntax": "warn"
    }
  },
  {
    ignores: [
      'dist/',
      'docs/',
      'examples/',
      'lib/'
    ]
  }
);