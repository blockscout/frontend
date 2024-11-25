import type { JestConfigWithTsJest } from 'ts-jest';

/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

const config: JestConfigWithTsJest = {
  clearMocks: true,
  coverageProvider: 'v8',
  globalSetup: '<rootDir>/jest/global-setup.ts',
  moduleDirectories: [
    'node_modules',
    __dirname,
  ],
  moduleNameMapper: {
    '^jest/(.*)': '<rootDir>/jest/$1',
  },
  modulePathIgnorePatterns: [
    'node_modules_linux',
  ],
  preset: 'ts-jest',
  reporters: [ 'default', 'github-actions' ],
  setupFiles: [
    '<rootDir>/jest/setup.ts',
  ],
  testEnvironment: 'jsdom',
  transform: {
    // '^.+\\.[tj]sx?$' to process js/ts with `ts-jest`
    // '^.+\\.m?[tj]sx?$' to process js/ts/mjs/mts with `ts-jest`
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.jest.json',
      },
    ],
  },
};

export default config;
