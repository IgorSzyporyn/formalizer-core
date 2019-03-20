module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Scopes are case insensitive (rather than lower case)
    'scope-case': [0],
  },
}
