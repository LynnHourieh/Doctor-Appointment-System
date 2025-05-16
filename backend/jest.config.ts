import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/tests'],
    testMatch: ['<rootDir>/tests/**/*.ts'],
    verbose: true,                        // Enables verbose output during testing
    collectCoverageFrom: ['src/**/*.ts'], // Specifies the files to collect coverage from
    collectCoverage: true,                // Enables code coverage collection
    coverageDirectory: 'coverage',        // Specifies the directory to output coverage files
    coverageThreshold: {
        global: {
            functions: 100,
            statements: 100,
        },
    },
    coverageReporters: ["text", "lcov"],
}
export default config;