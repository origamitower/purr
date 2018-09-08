/**
 * True if the value is null or undefined;
 */
export function isNone(value) {
  return value == null;
}

/**
 * True if the value is not undefined.
 */
export function isDefined(value) {
  return value !== undefined;
}

/**
 * Returns the internal tag of a value.
 */
export function typeOf(value) {
  if (value === null) {
    return "null";
  } else {
    return typeof value;
  }
}

/**
 * True if the value is an object.
 */
export function isObject(value) {
  return (
    value !== null && (typeof value === "object" || typeof value === "function")
  );
}

/**
 * True if the value is an object AND not a function.
 */
export function isNonCallableObject(value) {
  return value !== null && typeof value === "object";
}

/**
 * True if the value is a function.
 */
export function isFunction(value) {
  return typeof value === "function";
}
