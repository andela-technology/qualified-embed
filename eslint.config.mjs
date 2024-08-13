import jsdoc from "eslint-plugin-jsdoc";

export default [
  {
    files: ["**/*.js", "**/*.cjs", "**/*.mjs"],
    ignores: [
      "dist/embed.min.js",
      "docs/**",
    ],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        browser: true,
        node: true,
      },
    },
    plugins: {
      jsdoc,
    },
    rules: {
      "jsdoc/require-jsdoc": [
        "error",
        {
          require: {
            FunctionDeclaration: true,
            MethodDefinition: true,
            ClassDeclaration: true,
            ArrowFunctionExpression: true,
            FunctionExpression: true,
          },
        },
      ],
      "jsdoc/require-param": "error",
      "jsdoc/require-returns": "error",
    },
  },
  {
    files: [".eslintrc.js", ".eslintrc.cjs"],
    languageOptions: {
      sourceType: "script",
    },
  },
];
