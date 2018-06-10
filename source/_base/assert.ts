//----------------------------------------------------------------------
//
// This source file is part of the Origami project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

/**
 * Represents any assertions that fail.
 */
export class AssertionError extends Error {
  constructor(message: string) {
    super(message);
  }
}

/**
 * Asserts that [[condition]] is true, halts with [[message]] otherwise.
 */
export function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new AssertionError(message);
  }
}
