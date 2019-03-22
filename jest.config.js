module.exports = {
  moduleFileExtensions: [
    'js',
  ],
  transform: {
    '^.+\\.jsx?$': 'babel-jest'
  },
  transformIgnorePatterns: [
    '/node_modules/'
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@tests/(.*)$': '<rootDir>/tests/$1'
  },
  testMatch: [
    '**/tests/(unit|int)/**/*.spec.(js|jsx|ts|tsx)|**/__tests__/*.(js|jsx|ts|tsx)'
  ],
  setupTestFrameworkScriptFile: '<rootDir>/tests/extend-expect.js'
}
