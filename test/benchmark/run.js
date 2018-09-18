const fs = require("fs");
const path = require("path");
const { register } = require("../../bootstrap");
const { performance } = require("perf_hooks");
const prettyBytes = require("pretty-bytes");
require("console.table");
register();

const NO_VALIDATION = {};

const WARMUP_ITERATIONS = 1000;
const HOT_ITERATIONS = 1000;

const withRoot = root => filename => path.join(root, filename);

const isDirectory = path => fs.statSync(path).isDirectory();

const notNull = x => x != null;

const merge = (a, b) => Object.assign({}, a, b);

const loadBenchs = p => {
  const name = path.basename(p);
  const mods = fs.readdirSync(p).map(x => require(path.join(p, x)));
  const benchs = mods
    .map(x => x.Benchmark)
    .filter(notNull)
    .reduce(merge, {});
  const validate =
    mods.map(x => x.validate).filter(notNull)[0] ||
    (() => {
      return NO_VALIDATION;
    });
  const setup = mods.map(x => x.setup).filter(notNull)[0] || (() => {});
  const teardown = mods.map(x => x.teardown).filter(notNull)[0] || (() => {});
  const hot_iterations =
    mods.map(x => x.hot_iterations).filter(notNull)[0] || HOT_ITERATIONS;
  const warmup_iterations =
    mods.map(x => x.warmup_iterations).filter(notNull)[0] || WARMUP_ITERATIONS;

  return {
    path: p,
    name: name,
    benchmarks: benchs,
    setup,
    teardown,
    validate,
    hot_iterations,
    warmup_iterations
  };
};

const checkBenchmark = bench => {
  try {
    if (bench.validate() === NO_VALIDATION) {
      console.warn(`[WARN] no validation defined for ${bench.name}`);
    } else {
      console.log(`Validation: OK`);
    }
  } catch (e) {
    console.error(`Validation: Errored\n${e.stack}`);
  }
};

const runBenchTest = (test, bench) => {
  const run = test.run || test;
  const warmup_iterations = bench.warmup_iterations || WARMUP_ITERATIONS;
  const hot_iterations = bench.hot_iterations || HOT_ITERATIONS;
  const memory = new Array(hot_iterations);

  console.log(`Running ${test.name}`);
  performance.clearMarks();
  performance.clearMeasures();

  bench.setup(warmup_iterations);
  performance.mark("warmup-start");
  for (let i = 0; i < warmup_iterations; ++i) {
    run(i);
  }
  performance.mark("warmup-end");
  performance.measure("warmup", "warmup-start", "warmup-end");
  bench.teardown();

  global.gc();

  bench.setup(hot_iterations);
  performance.mark("hot-start");
  for (let i = 0; i < hot_iterations; ++i) {
    performance.mark("sample-start");
    run(i);
    performance.mark("sample-end");
    performance.measure("sample", "sample-start", "sample-end");
    memory[i] = process.memoryUsage();
  }
  performance.mark("hot-end");
  performance.measure("hot", "hot-start", "hot-end");
  bench.teardown();

  return {
    name: test.name,
    warmup: performance.getEntriesByName("warmup")[0],
    hot: performance.getEntriesByName("hot")[0],
    sample: performance.getEntriesByName("sample").map(x => x.duration),
    memory: memory
  };
};

const summariseArray = array => {
  return {
    min: Math.min.apply(null, array),
    max: Math.max.apply(null, array),
    mean: array.reduce((a, b) => a + b, 0) / array.length
  };
};

const summariseMemory = memory => {
  const used = memory.map(x => x.heapUsed);
  const total = memory.map(x => x.heapTotal);
  return {
    used: summariseArray(used),
    total: summariseArray(total)
  };
};

const formatSummary = (summary, f = x => x) => {
  return `min: ${f(summary.min)}, max: ${f(summary.max)}, mean: ${f(
    summary.mean
  )}`;
};

const prettyMs = ms => `${ms}ms`;

const formatResult = result => {
  const mem = summariseMemory(result.memory);
  const samples = summariseArray(result.sample);

  return {
    name: result.name,
    mem: mem,
    samples: samples,
    formatMem: `Memory usage: \n  Heap (${formatSummary(
      mem.used,
      prettyBytes
    )})\n  Total (${formatSummary(mem.total, prettyBytes)})`,
    formatSample: `${formatSummary(samples, prettyMs)}`
  };
};

/// Main
const [kind] = process.argv.slice(2);
const benchRoot = path.join(__dirname);
const benchs = fs
  .readdirSync(benchRoot)
  .map(withRoot(benchRoot))
  .filter(isDirectory)
  .map(loadBenchs);

for (const bench of benchs) {
  console.log(`=== ${bench.name}`);
  checkBenchmark(bench);
  console.log("");
  const results = Object.values(bench.benchmarks)
    .map(x => formatResult(runBenchTest(x, bench)))
    .sort((a, b) => a.samples.mean - b.samples.mean);

  console.log("");

  switch (kind) {
    case "time":
      console.table(
        ["Benchmark", "Mean", "Min", "Max"],
        results.map(x => [
          x.name,
          prettyMs(x.samples.mean),
          prettyMs(x.samples.min),
          prettyMs(x.samples.max)
        ])
      );
      break;

    case "heap":
      for (const x of results) {
        console.log(`:: ${x.name}`);
        console.log(x.formatMem);
      }
      break;

    default:
      for (const x of results) {
        console.log(`:: ${x.name}`);
        console.log(x.formatSample);
        console.log(x.formatMem);
        console.log("");
      }
  }

  console.log("---\n");
}
