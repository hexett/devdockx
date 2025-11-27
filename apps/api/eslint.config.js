import { config } from '@repo/eslint-config/base';

/** @type {import("eslint").Linter.Config[]} */
const updatedConfig = config.map((conf) => ({
  ...conf,
  rules: {
    ...conf.rules,
    '@typescript-eslint/no-explicit-any': 'off',
  },
}));

export default updatedConfig;