const minimist = require('minimist');
const DetoxLifecycleReporter = require('./DetoxLifecycleReporter');
const JasmineTraceReporter = require('./JasmineTraceReporter');

class DetoxJestAdapter {
  constructor({ detox }) {
    const lifecycle = new DetoxLifecycleReporter({ detox });

    this.reporters = { lifecycle };
    this.beforeEach = lifecycle.beforeEach.bind(lifecycle);
    this.afterAll = lifecycle.afterAll.bind(lifecycle);

    this._defineProxyMethod('suiteStarted');
    this._defineProxyMethod('suiteDone');
    this._defineProxyMethod('specStarted');
    this._defineProxyMethod('specDone');
  }

  _defineProxyMethod(method) {
    this[method] = (...args) => {
      for (const reporter of Object.values(this.reporters)) {
        if (reporter[method]) {
          reporter[method](...args);
        }
      }
    };
  }

  trace(enabled = DetoxJestAdapter.isInSingleWorkerMode()) {
    if (enabled) {
      this.reporters.trace = new JasmineTraceReporter();
    } else {
      delete this.reporters.trace;
    }

    return this;
  }

  static isInSingleWorkerMode(argv = process.argv) {
    const map = minimist(argv.slice(2));

    if (map['i'] || map['runInBand']) {
      return true;
    }

    const workers = +(map['w'] || map['maxWorkers']);
    return workers < 2;
  }
}

module.exports = DetoxJestAdapter;
