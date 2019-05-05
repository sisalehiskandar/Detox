const firstTestContent = require('./firstTestContent');
const runnerConfig = `{
    "reporters": ["detox/runners/jest/reporter"],
    "setupFilesAfterEnv": ["./init.js"],
    "testEnvironment": "node",
    "verbose": true
}
`;

const initjsContent = `const detox = require('detox');
const config = require('../package.json').detox;
const adapter = require('detox/runners/jest/adapter').trace(true);

// Set the default timeout
jest.setTimeout(120000);
jasmine.getEnv().addReporter(adapter);

beforeAll(async () => {
  await detox.init(config);
});

beforeEach(async () => {
  await adapter.beforeEach();
});

afterAll(async () => {
  await adapter.afterAll();
  await detox.cleanup();
});
`;

exports.initjs = initjsContent;
exports.firstTest = firstTestContent;
exports.runnerConfig = runnerConfig;
