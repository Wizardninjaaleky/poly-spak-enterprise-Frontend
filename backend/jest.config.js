module.exports = {
  testEnvironment: 'node',
  testTimeout: 30000,
  setupFilesAfterEnv: ['./jest.setup.js'],
  verbose: true,
  coverageDirectory: './coverage',
};