// jest.config.js
/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',                // use ts-jest for .ts/.tsx files
  testEnvironment: 'node',          // or 'jsdom' if you need a browser-like env
  roots: ['<rootDir>/src'],         // where Jest looks for tests + modules
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$', 
  transform: {
    '^.+\\.tsx?$': 'ts-jest',       // runs ts-jest on .ts/.tsx files
  },
  // (optional) if you use absolute imports from `src/`:
  // moduleNameMapper: {
  //   '^@/(.*)$': '<rootDir>/src/$1'
  // },
};
