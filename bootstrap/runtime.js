// --- Origami runtime starts here --- \\
const $$UNBOUND = {};

function $$isPrimitive(a) {
  return (
    a === null ||
    typeof a === "boolean" ||
    typeof a === "number" ||
    typeof a === "string" ||
    typeof a === "symbol" ||
    typeof a === "undefined" ||
    typeof a === "bigint"
  );
}

function $$isOrdered(a) {
  return (
    typeof a === "number" ||
    typeof a === "string" ||
    typeof a === "bigint" ||
    typeof a === "boolean"
  );
}

function $$assert(test, message) {
  if (!test) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

function $equals(a, b) {
  if ($$isPrimitive(a)) {
    return a === b;
  } else if (Array.isArray(a)) {
    return (
      Array.isArray(b) &&
      a.length === b.length &&
      a.every((x, i) => $equals(x, b[i]))
    );
  } else {
    return a.$equals(b);
  }
}

function $notEquals(a, b) {
  if ($$isPrimitive(a)) {
    return a !== b;
  } else if (Array.isArray(a)) {
    return !$equals(a, b);
  } else {
    return a.$notEquals(b);
  }
}

function $gte(a, b) {
  if ($$isOrdered(a)) {
    $$assert(typeof a === typeof b, `A value of type ${typeof a}`);
    return a >= b;
  } else {
    return a.$gte(b);
  }
}

function $composeRight(a, b) {
  if (typeof a === "function") {
    $$assert(typeof b === "function", `A function`);
    return x => b(a(x));
  } else {
    return a.$composeRight(b);
  }
}

function $gt(a, b) {
  if ($$isOrdered(a)) {
    $$assert(typeof a === typeof b, `A value of type ${typeof a}`);
    return a > b;
  } else {
    return a.$gt(b);
  }
}

function $lte(a, b) {
  if ($$isOrdered(a)) {
    $$assert(typeof a === typeof b, `A value of type ${typeof a}`);
    return a <= b;
  } else {
    return a.$lte(b);
  }
}

function $composeLeft(a, b) {
  if (typeof a === "function") {
    $$assert(typeof b === "function", `A function`);
    return x => a(b(x));
  }
}

function $lt(a, b) {
  if ($$isOrdered(a)) {
    $$assert(typeof a === typeof b, `A value of type ${typeof a}`);
    return a < b;
  } else {
    return a.$lt(b);
  }
}

function $concat(a, b) {
  if (typeof a === "string") {
    $$assert(typeof b === "string", `A string`);
    return a + b;
  } else if (Array.isArray(a)) {
    $$assert(Array.isArray(b), `An array`);
    return a.concat(b);
  } else {
    return a.$concat(b);
  }
}

function $plus(a, b) {
  if (typeof a === "number" || typeof a === "bigint") {
    $$assert(typeof a === typeof b, `A value of type ${typeof a}`);
    return a + b;
  } else {
    return a.$plus(b);
  }
}

function $minus(a, b) {
  if (typeof a === "number" || typeof a === "bigint") {
    $$assert(typeof a === typeof b, `A value of type ${typeof a}`);
    return a - b;
  } else {
    return a.$minus(b);
  }
}

function $power(a, b) {
  if (typeof a === "number" || typeof a === "bigint") {
    $$assert(typeof a === typeof b, `A value of type ${typeof a}`);
    return a ** b;
  } else {
    return a.$power(b);
  }
}

function $multiply(a, b) {
  if (typeof a === "number" || typeof a === "bigint") {
    $$assert(typeof a === typeof b, `A value of type ${typeof a}`);
    return a * b;
  } else {
    return a.$multiply(b);
  }
}

function $divide(a, b) {
  if (typeof a === "number" || typeof a === "bigint") {
    $$assert(typeof a === typeof b, `A value of type ${typeof a}`);
    return a / b;
  } else {
    return a.$divide(b);
  }
}

function $and(a, b) {
  if (typeof a === "boolean") {
    $$assert(typeof b === "boolean", `A boolean`);
    return a && b;
  } else {
    return a.$and(b);
  }
}

function $or(a, b) {
  if (typeof a === "boolean") {
    $$assert(typeof b === "boolean", `A boolean`);
    return a || b;
  } else {
    return a.$or(b);
  }
}

function $not(a) {
  if (typeof a === "boolean") {
    return !a;
  } else {
    return a.$not();
  }
}

function $at(a, k) {
  if (typeof a === "string") {
    $$assert(
      typeof k === "number" || typeof k === "bigint",
      "Indexes must be numeric"
    );
    const codepoint = a.codePointAt(k);
    $$assert(typeof codepoint === "number", `Index out of bounds ${k}`);
    return codepoint;
  } else if (Array.isArray(a)) {
    $$assert(
      typeof k === "number" || typeof k === "bigint",
      "Indexes must be numeric"
    );
    $$assert(k >= 0 && k <= a.length && k in a, `Index out of bounds ${k}`);
    return a[k];
  } else {
    return a.$at(k);
  }
}

function $atPut(a, k, v) {
  if (Array.isArray(a)) {
    $$assert(
      typeof k === "number" || typeof k === "bigint",
      `Indexes must be numeric`
    );
    $$assert(k >= 0, `Index out of bounds ${k}`);
    a[k] = v;
  } else {
    a.$atPut(k, v);
  }
}
// --- Origami runtime ends here --- \\
