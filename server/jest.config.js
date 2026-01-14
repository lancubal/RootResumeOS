module.exports = {
  testEnvironment: 'node',
  // Map uuid to the commonjs version to avoid "export" syntax errors in Jest
  moduleNameMapper: {
    '^uuid$': require.resolve('uuid')
  }
};
