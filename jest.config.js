const { resolve } = require('path')
const root = resolve(__dirname)

module.exports = {
  rootDir: root,
  preset: 'ts-jest',
  testEnvironment: 'node',
  clearMocks: true,
  moduleDirectories: ['node_modules', 'src'],
  setupFiles: ['<rootDir>/src/config/env.ts'],
  setupFilesAfterEnv: ['<rootDir>/jest-setup.ts'],
  moduleNameMapper: {
    '_config/(.*)': '<rootDir>/src/config/$1',
    '_account/(.*)': '<rootDir>/src/api/account/$1',
    '_core/(.*)': '<rootDir>/src/api/core/$1',
    '_transaction/(.*)': '<rootDir>/src/api/transaction/$1',
    '_interfaces/(.*)': '<rootDir>/src/interfaces/$1',
    _interfaces: '<rootDir>/src/interfaces',
    '_cli/(.*)': '<rootDir>/src/cli/$1',
    '_src/(.*)': '<rootDir>/src/$1',
  },
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
  coveragePathIgnorePatterns: [
    '<rootDir>/src/interfaces/*',
    '<rootDir>/src/config/database/*',
    '<rootDir>/src/@types/*',
  ],
}
