"use strict";
const $$UNBOUND = {};
exports.$$UNBOUND = $$UNBOUND;

const $$GLOBAL =
  typeof global !== "undefined"
    ? global
    : typeof window !== "undefined"
      ? window
      : this;
exports.$$GLOBAL = $$GLOBAL;

exports.$$makeParser = $$makeParser;
function $$makeParser(code, bindings) {
  const $$Ohm = require("ohm-js");
  const $$OhmToAST = require("ohm-js/extras").toAST;
  const grammar = $$Ohm.grammar(code);
  const parse = (source, rule) => {
    const match = grammar.match(source, rule);
    if (match.failed()) {
      throw new SyntaxError(match.message);
    }

    const visitor = Object.keys(bindings)
      .map(x => {
        const args = Array.from(
          { length: bindings[x].length - 1 },
          (_, i) => `$${i}`
        );
        const fn = new Function(
          "fn",
          `return function (${args.join(", ")}) { return fn(this, ${args.join(
            ", "
          )}) }`
        )((ctx, ...args) => {
          const meta = args.map(x => ({
            source: x.source,
            rule: x.ctorName
          }));
          return bindings[x](meta, ...args.map(x => x.toAST(ctx.args.mapping)));
        });
        return {
          [x]: fn
        };
      })
      .reduce((a, b) => Object.assign(a, b), {});

    return $$OhmToAST(match, visitor);
  };
  return new class Grammar {
    parse(source) {
      return parse(source);
    }

    parseFromRule(source, rule) {
      return parse(source, rule);
    }
  }();
}

exports.$$isIterable = $$isIterable;
function $$isIterable(a) {
  return a != null && typeof a[Symbol.iterator] === "function";
}

exports.$$assertIterable = $$assertIterable;
function $$assertIterable(a) {
  $$assert($$isIterable(a), `${a} is not an iterable.`);
  return a;
}

exports.$$isPrimitive = $$isPrimitive;
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

exports.$$isOrdered = $$isOrdered;
function $$isOrdered(a) {
  return (
    typeof a === "number" ||
    typeof a === "string" ||
    typeof a === "bigint" ||
    typeof a === "boolean"
  );
}

exports.$$assert = $$assert;
function $$assert(test, message) {
  if (!test) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

exports.$$checkClassEquals = $$checkClassEquals;
function $$checkClassEquals(fields, self, that) {
  return (
    !$$isPrimitive(that) &&
    self.constructor === that.constructor &&
    fields.every(k => $equals(self[k], that[k]))
  );
}

const pad = n => " ".repeat(n * 2);

exports.$$showObject = $$showObject;
function $$showObject(name, obj, fields, depth, visited) {
  const fix = n => n.replace(/^__/, "");
  return [
    `${name} {`,
    fields
      .map(
        x => `${pad(depth + 1)}${fix(x)}: ${$mshow(obj[x], depth + 2, visited)}`
      )
      .join(",\n"),
    `${pad(depth)}}`
  ].join("\n");
}

function $mshow(value, depth, visited) {
  if (visited.has(value)) {
    return "[Circular]";
  } else {
    return $show(value, depth, visited);
  }
}

exports.$show = $show;
function $show(value, depth = 0, visited = new Set()) {
  visited.add(value);

  if (value === null) {
    return "null";
  }
  if (value === undefined) {
    return "undefined";
  }
  if (
    typeof value === "number" ||
    typeof value === "boolean" ||
    typeof value === "bigint" ||
    typeof value === "symbol"
  ) {
    return String(value);
  }
  if (typeof value === "string") {
    return JSON.stringify(value);
  }
  if (typeof value === "function") {
    return `[Function: ${value.name || "(anonymous)"}]`;
  }
  if (Array.isArray(value)) {
    return [
      "[",
      value
        .map(x => `${pad(depth + 1)}${$mshow(x, depth + 2, visited)}`)
        .join(",\n"),
      `${pad(depth)}]`
    ].join("\n");
  }
  if (value.debugRepresentation) {
    return value.debugRepresentation({ depth: depth + 2, visited: visited });
  }
  const name = value.constructor ? `${value.constructor.name} ` : "";
  return [
    `${name}{`,
    Reflect.ownKeys(value)
      .map(
        k => `${pad(depth + 1)}${k}: ${$mshow(value[k], depth + 2, visited)}`
      )
      .join(",\n"),
    `${pad(depth)}}`
  ];
}

exports.$equals = $equals;
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

exports.$notEquals = $notEquals;
function $notEquals(a, b) {
  if ($$isPrimitive(a)) {
    return a !== b;
  } else if (Array.isArray(a)) {
    return !$equals(a, b);
  } else {
    return a.$notEquals(b);
  }
}

exports.$gte = $gte;
function $gte(a, b) {
  if ($$isOrdered(a)) {
    $$assert(typeof a === typeof b, `A value of type ${typeof a}`);
    return a >= b;
  } else {
    return a.$gte(b);
  }
}

exports.$composeRight = $composeRight;
function $composeRight(a, b) {
  if (typeof a === "function") {
    $$assert(typeof b === "function", `A function`);
    return x => b(a(x));
  } else {
    return a.$composeRight(b);
  }
}

exports.$gt = $gt;
function $gt(a, b) {
  if ($$isOrdered(a)) {
    $$assert(typeof a === typeof b, `A value of type ${typeof a}`);
    return a > b;
  } else {
    return a.$gt(b);
  }
}

exports.$lte = $lte;
function $lte(a, b) {
  if ($$isOrdered(a)) {
    $$assert(typeof a === typeof b, `A value of type ${typeof a}`);
    return a <= b;
  } else {
    return a.$lte(b);
  }
}

exports.$composeLeft = $composeLeft;
function $composeLeft(a, b) {
  if (typeof a === "function") {
    $$assert(typeof b === "function", `A function`);
    return x => a(b(x));
  }
}

exports.$lt = $lt;
function $lt(a, b) {
  if ($$isOrdered(a)) {
    $$assert(typeof a === typeof b, `A value of type ${typeof a}`);
    return a < b;
  } else {
    return a.$lt(b);
  }
}

exports.$concat = $concat;
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

exports.$plus = $plus;
function $plus(a, b) {
  if (typeof a === "number" || typeof a === "bigint") {
    $$assert(typeof a === typeof b, `A value of type ${typeof a}`);
    return a + b;
  } else {
    return a.$plus(b);
  }
}

exports.$minus = $minus;
function $minus(a, b) {
  if (typeof a === "number" || typeof a === "bigint") {
    $$assert(typeof a === typeof b, `A value of type ${typeof a}`);
    return a - b;
  } else {
    return a.$minus(b);
  }
}

exports.$power = $power;
function $power(a, b) {
  if (typeof a === "number" || typeof a === "bigint") {
    $$assert(typeof a === typeof b, `A value of type ${typeof a}`);
    return a ** b;
  } else {
    return a.$power(b);
  }
}

exports.$multiply = $multiply;
function $multiply(a, b) {
  if (typeof a === "number" || typeof a === "bigint") {
    $$assert(typeof a === typeof b, `A value of type ${typeof a}`);
    return a * b;
  } else {
    return a.$multiply(b);
  }
}

exports.$divide = $divide;
function $divide(a, b) {
  if (typeof a === "number" || typeof a === "bigint") {
    $$assert(typeof a === typeof b, `A value of type ${typeof a}`);
    return a / b;
  } else {
    return a.$divide(b);
  }
}

exports.$and = $and;
function $and(a, b) {
  if (typeof a === "boolean") {
    $$assert(typeof b === "boolean", `A boolean`);
    return a && b;
  } else {
    return a.$and(b);
  }
}

exports.$or = $or;
function $or(a, b) {
  if (typeof a === "boolean") {
    $$assert(typeof b === "boolean", `A boolean`);
    return a || b;
  } else {
    return a.$or(b);
  }
}

exports.$not = $not;
function $not(a) {
  if (typeof a === "boolean") {
    return !a;
  } else {
    return a.$not();
  }
}

exports.$at = $at;
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

exports.$atPut = $atPut;
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

exports.$has = $has;
function $has(v, obj) {
  if (Array.isArray(obj)) {
    return obj.includes(v);
  } else {
    return obj.$has(v);
  }
}
