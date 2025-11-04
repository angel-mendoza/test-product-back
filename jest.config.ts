import type { Config } from 'jest'

const config: Config = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/src/setup-jest.ts'],
  moduleDirectories: ['node_modules', '<rootDir>/src/'],
  testMatch: ['**/+(*.)+(spec).+(ts)'],
}

export default config
