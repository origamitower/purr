function $equals(a: any, b: any) {
  return a === b;
}

function $not_equals(a: any, b: any) {
  return a !== b;
}

function $gt(a: any, b: any) {
  return a > b;
}

function $lt(a: any, b: any) {
  return a < b;
}

function $gte(a: any, b: any) {
  return a >= b;
}

function $lte(a: any, b: any) {
  return a <= b;
}

function $plus(a: any, b: any) {
  return a + b;
}

function $minus(a: any, b: any) {
  return a - b;
}

function $div(a: any, b: any) {
  return a / b;
}

function $mul(a: any, b: any) {
  return a * b;
}

function $or(a: any, b: any) {
  return a || b;
}

function $and(a: any, b: any) {
  return a && b;
}

function $not(a: any) {
  return !a;
}

function $fail(message) {
  return new Error(message);
}

function $get(a: any, p: any) {
  return a[p];
}

function $at(a: any, p: any) {
  return a[p];
}

function $vector(...items: any[]) {
  return items;
}

function $map(...pairs: any[]) {
  return new Map(pairs);
}

function $int(a: any) {
  return Number(a);
}

function $dec(a: any) {
  return Number(a);
}

function $putat(o: any, k: any, v: any) {
  o[k] = v;
}
// <runtime ends here>
