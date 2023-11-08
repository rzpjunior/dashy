module.exports = {
  preset: '@vue/cli-plugin-unit-jest',
  "coverageDirectory": 'coverage',
  "collectCoverage": true,
  "collectCoverageFrom": ["src/components/com/*.vue"],
  testPathIgnorePatterns: ['./node_modules/'],
  // "collectCoverageFrom": ["src/**/*.vue"],
}
