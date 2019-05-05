jest.mock('./DetoxLifecycleReporter');
jest.mock('./JasmineTraceReporter');

const DetoxJestAdapter = require('./DetoxJestAdapter');

describe('DetoxJestAdapter', () => {
  let adapter;
  let detoxInstance;

  beforeEach(() => {
    detoxInstance = {};
    adapter = new DetoxJestAdapter(detoxInstance);
  });

  it('should have lifecycle reporter by default', () => {
    expect(adapter.reporters.lifecycle).toBeDefined();
  });

  describe('lifecycle reporter', () => {
    let lifecycleReporter;

    beforeEach(() => {
      lifecycleReporter = adapter.reporters.lifecycle;
    });

    describe('proxying', () => {
      const promise = Promise.resolve();
      const summary = {};

      it('should have lifecycle reporter\'s beforeEach() method ', () => {
        lifecycleReporter.beforeEach.mockReturnValue(promise);
        expect(adapter.beforeEach()).toBe(promise);
      });

      it('should have lifecycle reporter\'s afterAll() method ', () => {
        lifecycleReporter.afterAll.mockReturnValue(promise);
        expect(adapter.afterAll()).toBe(promise);
      });

      it('should not throw if no reporter has no .suiteStart() method', () => {
        expect(() => adapter.suiteStarted({})).not.toThrow();
      });

      it('should not throw if no reporter has no .suiteDone() method', () => {
        expect(() => adapter.suiteDone({})).not.toThrow();
      });

      it('should proxy .specStarted() method to lifecycle', () => {
        adapter.specStarted(summary);
        expect(lifecycleReporter.specStarted).toHaveBeenCalledWith(summary);
      });

      it('should proxy .specDone() method to lifecycle', () => {
        adapter.specDone(summary);
        expect(lifecycleReporter.specDone).toHaveBeenCalledWith(summary);
      });
    });
  });

  describe('trace reporter', () => {
    it('should not have trace reporter by default', () => {
      expect(adapter.reporters.trace).toBeUndefined();
    });

    describe('when called .trace(true)', () => {
      it('should return itself', () => {
        expect(adapter.trace(true)).toBe(adapter);
      });

      it('should add trace reporter', () => {
        adapter.trace(true);
        expect(adapter.reporters.trace).toBeDefined();
      });
    });

    describe('when called .trace(false)', () => {
      it('should remove trace reporter', () => {
        expect(adapter.trace(true).trace(false).reporters.trace).toBeUndefined();
      });
    });

    describe('proxying', () => {
      let traceReporter;

      beforeEach(() => {
        traceReporter = adapter.trace(true).reporters.trace;
      });

      const summary = {};

      it('should proxy .suiteStarted() method to trace reporter', () => {
        adapter.suiteStarted(summary);
        expect(traceReporter.suiteStarted).toHaveBeenCalledWith(summary);
      });

      it('should proxy .suiteDone() method to trace reporter', () => {
        adapter.suiteDone(summary);
        expect(traceReporter.suiteDone).toHaveBeenCalledWith(summary);
      });

      it('should proxy .specStarted() method to trace reporter', () => {
        adapter.specStarted(summary);
        expect(traceReporter.specStarted).toHaveBeenCalledWith(summary);
      });

      it('should proxy .specDone() method to trace reporter', () => {
        adapter.specDone(summary);
        expect(traceReporter.specDone).toHaveBeenCalledWith(summary);
      });

      it('should call lifecycle reporter first', () => {
        let calls = '';

        adapter.reporters.lifecycle.specStarted.mockImplementation(() => {
          calls += "+lifecycle";
        });

        adapter.reporters.trace.specStarted.mockImplementation(() => {
          calls += "+trace";
        });

        adapter.specStarted(summary);

        expect(calls).toBe('+lifecycle+trace');
      });
    });
  });

  describe('heuristics', () => {
    describe('isInSingleWorkerMode', () => {
      let argv;

      beforeEach(() => {
        argv = ['node', 'jest'];
      });

      it('should use process.argv by default', () => {
        expect(DetoxJestAdapter.isInSingleWorkerMode()).toEqual(expect.any(Boolean));
      });

      it('should return false if no args', () => {
        expect(DetoxJestAdapter.isInSingleWorkerMode(argv)).toBe(false);
      });

      it('should return true if -i', () => {
        argv.push('-i');
        expect(DetoxJestAdapter.isInSingleWorkerMode(argv)).toBe(true);
      });

      it('should return true if --runInBand', () => {
        argv.push('--runInBand');
        expect(DetoxJestAdapter.isInSingleWorkerMode(argv)).toBe(true);
      });

      it('should return true if -w 1', () => {
        argv.push('-w');
        argv.push('1');

        expect(DetoxJestAdapter.isInSingleWorkerMode(argv)).toBe(true);
      });

      it('should return false if -w 2', () => {
        argv.push('-w');
        argv.push('2');

        expect(DetoxJestAdapter.isInSingleWorkerMode(argv)).toBe(false);
      });

      it('should return true if --maxWorkers=1', () => {
        argv.push('--maxWorkers=1');
        expect(DetoxJestAdapter.isInSingleWorkerMode(argv)).toBe(true);
      });

      it('should return false if --maxWorkers=2', () => {
        argv.push('--maxWorkers=2');
        expect(DetoxJestAdapter.isInSingleWorkerMode(argv)).toBe(false);
      });
    });

    it('should turn on trace if isInSingleWorkerMode returns true', () => {
      jest.spyOn(DetoxJestAdapter, 'isInSingleWorkerMode').mockReturnValue(true);
      expect(adapter.trace().reporters.trace).toBeDefined();
    });

    it('should turn off trace if isInSingleWorkerMode returns false', () => {
      jest.spyOn(DetoxJestAdapter, 'isInSingleWorkerMode').mockReturnValue(false);
      expect(adapter.trace().reporters.trace).toBeUndefined();
    });
  });
});
