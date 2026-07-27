// ESLint Flat Configuration (ESLint v9+)
// Uses the new flat config format (eslint.config.mjs) replacing the legacy .eslintrc.* files.

import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import prettier from "eslint-config-prettier/flat";

// ─── Compatibility Layer ─────────────────────────────────────
// FlatCompat converts old-style .eslintrc configs into flat config arrays,
// allowing us to use eslint-config-next's legacy config until it fully migrates.
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

// ─── ESLint Configuration ────────────────────────────────────
const eslintConfig = [
  // Ignore patterns — these files/directories will not be linted
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "out/**",
      "dist/**",
      "build/**",
      "next-env.d.ts",
      "**/*.config.*",
      "public/**",
    ],
  },

  // Next.js core web vitals config (converted from legacy via FlatCompat)
  // This includes React rules, accessibility rules, and TypeScript integration.
  ...compat.extends("next/core-web-vitals"),

  // ESLint-config-prettier — disables ESLint rules that conflict with Prettier.
  // Must be placed last to override any previously set formatting rules.
  prettier,

  // ─── Custom Rules ─────────────────────────────────────────
  // These rules supplement the Next.js base config.
  // Note: @typescript-eslint rules are inherited from next/core-web-vitals.
  {
    rules: {
      // Console: allow warn and error, warn on log
      "no-console": ["warn", { allow: ["warn", "error"] }],

      // Duplicate imports: error
      "no-duplicate-imports": "error",

      // React: prefer self-closing tags when no children
      "react/self-closing-comp": "warn",

      // React: prefer shorthand boolean attribute syntax
      "react/jsx-boolean-value": "warn",

      // Prefer const over let when variable is never reassigned
      "prefer-const": "error",

      // Disallow var
      "no-var": "error",

      // Require strict equality (=== over ==)
      eqeqeq: ["error", "always"],
    },
  },
];

export default eslintConfig;
