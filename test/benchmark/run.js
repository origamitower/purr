const fs = require("fs");
const path = require("path");
const { register } = require("../../bootstrap");
register();

const NO_VALIDATION = {};

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

  return {
    path: p,
    name: name,
    benchmarks: benchs,
    validate
  };
};

const checkBenchmark = bench => {
  try {
    if (bench.validate(bench.benchmarks) === NO_VALIDATION) {
      console.warn(`[WARN] no validation defined for ${bench.name}`);
    } else {
      console.log(`Validation: OK`);
    }
  } catch (e) {
    console.error(`Validation: Errored\n${e.stack}`);
  }
};

/// Main
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
}
