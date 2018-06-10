import { assert } from "./assert";

//----------------------------------------------------------------------
//
// This source file is part of the Origami project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

/**
 * Returns Origami's real `type` for a value.
 */
export function typeOf(value: any): any {
  if (value == null) {
    return "null";
  }

  const type = typeof value;
  if (type !== "object") {
    return type;
  }

  return value["origami/type"] || Object.getPrototypeOf(value);
}

/**
 * Checks that something is an object.
 */
export function isObject(value: any): boolean {
  return value !== null && typeof value === "object";
}

/**
 * Tries to provide a textual description for an Origami type.
 */
export function describeType(type: any): string {
  if (typeof type === "string") {
    return type;
  } else {
    assert(
      isObject(type),
      `[A0001] expected internal Origami type to be a string or object.`
    );
    return (
      type["origami/type-name"] ||
      (type.constructor ? type.constructor.name : "object")
    );
  }
}

/**
 * Converts an object into a type.
 */
export function origamiType(constructor: any): any {
  switch (true) {
    case constructor === null:
      return PrimitiveType.NULL;

    case constructor === undefined:
      return PrimitiveType.UNDEFINED;

    case constructor === Boolean:
      return PrimitiveType.BOOLEAN;

    case constructor === Number:
      return PrimitiveType.NUMBER;

    case constructor === String:
      return PrimitiveType.STRING;

    default:
      return constructor;
  }
}

/**
 * All primitive types in Origami.
 */
export enum PrimitiveType {
  STRING = "string",
  NUMBER = "number",
  BOOLEAN = "boolean",
  UNDEFINED = "undefined",
  NULL = "null"
}
