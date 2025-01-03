// Basic ESLint configuration for Next.js
// Two spaces for indentation; no tabs
// Function brackets on the same line as the function name
// Double quotes for strings
// Always use semicolons

module.exports = {
  extends: ["next/core-web-vitals"],
  rules: {
    "indent": ["error", 2],
    "no-tabs": "error", 
    "space-infix-ops": ["error", { "int32Hint": false }],
    "brace-style": ["error", "1tbs", { "allowSingleLine": true }],
    "newline-before-return": "error",
    "quotes": ["error", "double"],
    "semi": ["error", "always"]

  },
};