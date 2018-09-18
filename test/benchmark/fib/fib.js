function fib_recursive_baseline(n) {
  if (n < 2) {
    return n;
  } else {
    return fib_recursive_baseline(n - 1) + fib_recursive_baseline(n - 2);
  }
}

function fib_tail_recursive_baseline(n, acc, current) {
  if (n === 0) {
    return acc;
  } else if (n === 1) {
    return current;
  } else {
    return fib_tail_recursive_baseline(n - 1, current, acc + current);
  }
}

exports.Benchmark = { fib_recursive_baseline, fib_tail_recursive_baseline };
