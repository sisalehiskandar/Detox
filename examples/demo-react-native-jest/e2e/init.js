const config = require('../package.json').detox;
const adapter = require('detox/runners/jest/adapter').trace();

// Set the default timeout
jest.setTimeout(300000);
jasmine.getEnv().addReporter(adapter);

beforeAll(async () => {
  await detox.init(config);
});

beforeEach(async () => {
  await adapter.beforeEach(detox);
});

afterAll(async () => {
  await adapter.afterAll(detox);
  await detox.cleanup();
});
