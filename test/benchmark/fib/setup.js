const randomInt = n => Math.floor(Math.random() * n);

let args = [];

function setup(iterations) {
  args = Array.from({ length: iterations }, () => 30 + randomInt(5));
}

module.exports = {
  args(i) {
    return args[i];
  },
  setup,
  warmup_iterations: 100,
  hot_iterations: 20
};
