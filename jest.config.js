export default {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/index.js',
    '!src/config/**'
  ],
  testMatch: [
    '**/__tests__/**/*.test.js',
    'src/test/**/*.test.js',
    '**/?(*.)+(spec|test).js'
  ],
  verbose: true,
  testTimeout: 10000,
  transform: {},
};