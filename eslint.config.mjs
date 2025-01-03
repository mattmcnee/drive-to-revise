import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals"),
  {
    rules: {
      indent: ["error", 2],
      "no-tabs": "error",
      "space-infix-ops": ["error", { int32Hint: false }],
      "brace-style": ["error", "1tbs", { allowSingleLine: true }],
      quotes: ["error", "double"],
      semi: ["error", "always"],
    },
  },
];

export default eslintConfig;

