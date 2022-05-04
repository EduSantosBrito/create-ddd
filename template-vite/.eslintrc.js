const path = require("path");

module.exports = {
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: "latest",
        sourceType: "module",
    },
    env: {
        browser: true,
        es2021: true,
    },
    extends: ["eslint:recommended", "plugin:react/recommended", "plugin:react/jsx-runtime", "plugin:react-hooks/recommended"],
    rules: {
        "react/prop-types": "off",
    },
};
