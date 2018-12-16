module.exports = {
  rootDir: '../../../',
  expand: true,
  verbose: true,
  forceExit: true,
  moduleFileExtensions: ['js', 'json', 'vue'],
  moduleNameMapper: {
    '^~/(.*)$': '<rootDir>/example/$1'
  },
  transform: {
    '^.+\\.jsx?$': '<rootDir>/node_modules/babel-jest',
    '.*\\.(vue)$': '<rootDir>/node_modules/vue-jest'
  },
  testPathIgnorePatterns: ['<rootDir>/test/unit'],
  snapshotSerializers: ['<rootDir>/node_modules/jest-serializer-vue'],
  coverageDirectory: '<rootDir>/test/utils/coverage',
  globalSetup: '<rootDir>/test/utils/e2e/setup.js',
  globalTeardown: '<rootDir>/test/utils/e2e/teardown.js',
  testEnvironment: '<rootDir>/test/utils/e2e/environment.js',
  collectCoverageFrom: ['example/**/*.{js,vue}', '!**/node_modules/**', '!**/static/**', '!**/dist/**']
}
