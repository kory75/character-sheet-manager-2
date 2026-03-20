import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testMatch: ['**/src/**/*.spec.ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  transform: {
    '^.+\\.ts$': ['ts-jest', { tsconfig: 'tsconfig.spec.json' }],
  },
  moduleNameMapper: {
    '^@app/(.*)$': '<rootDir>/src/app/$1',
    '^@games/(.*)$': '<rootDir>/src/app/games/$1',
    '^@shared/(.*)$': '<rootDir>/src/app/shared/$1',
    '^@core/(.*)$': '<rootDir>/src/app/core/$1',
  },
  coverageDirectory: 'coverage/jest',
  collectCoverageFrom: ['src/app/**/*.ts', '!src/app/**/*.routes.ts'],
};

export default config;
