const detox = require('../../src/index');
const DetoxJestAdapter = require('./impl/DetoxJestAdapter');

module.exports = new DetoxJestAdapter({ detox });
