// Provides functions for all JavaScript operators (unsafe module!)

export function not(a) {
  return !a;
}

export function and(a, b) {
  return a && b;
}

export function or(a, b) {
  return a || b;
}

export function abstractEquals(a, b) {
  return a == b;
}

export function abstractNotEquals(a, b) {
  return a != b;
}

export function equals(a, b) {
  return a === b;
}

export function notEquals(a, b) {
  return a !== b;
}

export function greaterThan(a, b) {
  return a > b;
}

export function greaterOrEqual(a, b) {
  return a >= b;
}

export function lessThan(a, b) {
  return a < b;
}

export function lessOrEqual(a, b) {
  return a <= b;
}

export function remainder(a, b) {
  return a % b;
}

export function negate(a) {
  return -a;
}

export function plus(a, b) {
  return a + b;
}

export function minus(a, b) {
  return a - b;
}

export function multiply(a, b) {
  return a * b;
}

export function divide(a, b) {
  return a / b;
}

export function power(a, b) {
  return a ** b;
}

export function bitAnd(a, b) {
  return a & b;
}

export function bitOr(a, b) {
  return a | b;
}

export function bitXor(a, b) {
  return a ^ b;
}

export function bitNot(a) {
  return ~a;
}

export function bitShiftLeft(a, b) {
  return a << b;
}

export function bitShiftRight(a, b) {
  return a >> b;
}

export function unsignedBitShiftRight(a, b) {
  return a >>> b;
}

export function typeOf(a) {
  return typeof a;
}

export function ignore(a) {
  return undefined;
}

export function instanceOf(constructor, value) {
  return value instanceof constructor;
}
