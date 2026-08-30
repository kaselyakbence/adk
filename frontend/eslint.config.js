import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    rules: {
      // React Compiler readiness rule from the newer eslint-plugin-react-hooks;
      // not adopting the compiler in this pass, so treat as advisory for now.
      "react-hooks/set-state-in-effect": "warn",
    },
  },
  { ignores: ["build/**"] },
];

export default eslintConfig;
