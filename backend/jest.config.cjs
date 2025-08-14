/** @type {import('jest').Config} */

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/*.spec.ts'],
  clearMocks: true,

  moduleNameMapper: {
    '^@module/(.*)$': '<rootDir>/src/modules/$1',
    '^@shared/(.*)$': '<rootDir>/src/shared/$1',
    '^@error/(.*)$': '<rootDir>/src/errors/$1'
  },

  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/main.ts',
    '!src/**/module.ts',
    '!src/**/routes/*.ts'
  ],

  coverageDirectory: 'coverage'
}
