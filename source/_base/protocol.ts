//----------------------------------------------------------------------
//
// This source file is part of the Origami project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

/**
 * Any implementation that may be provided for a protocol.
 */
export interface IProtocolImplementation<T> {
  type: any;
  methods: T;
}

/**
 * Thrown when trying to add an implementation of a type to a protocol
 * that already has one.
 */
export class DuplicatedProtocolImplementationError extends Error {
  constructor(readonly type: string, readonly protocol: string) {
    super(`An implementation for ${type} already exists in ${protocol}`);
  }
}

/**
 * Thrown when trying to use a protocol with a type that does not have
 * an implementation in the protocol.
 */
export class MissingProtocolImplementationError extends Error {
  constructor(readonly type: string, readonly protocol: string) {
    super(`No implementation of ${protocol} for ${type}`);
  }
}

/**
 * Single-dispatched protocols.
 */
export abstract class Protocol<T> {
  private dispatch_map: Map<any, T>;
  abstract name: string;

  get default_implementation(): T | null {
    return null;
  }

  constructor() {
    this.dispatch_map = new Map();
  }

  /**
   * Adds a new implementation to the dispatch map.
   */
  $addImplementation(implementation: IProtocolImplementation<T>) {
    if (this.dispatch_map.has(implementation.type)) {
      throw new DuplicatedProtocolImplementationError(
        implementation.type,
        this.name
      );
    }

    this.dispatch_map.set(implementation.type, implementation.methods);
  }

  /**
   * Removes an implementation from the dispatch map.
   */
  $removeImplementation(implementation: IProtocolImplementation<T>) {
    if (this.dispatch_map.has(implementation.type)) {
      this.dispatch_map.delete(implementation.type);
    } else {
      throw new MissingProtocolImplementationError(
        implementation.type,
        this.name
      );
    }
  }

  /**
   * Selects an implementation for the given type.
   */
  $select(type: any): T {
    const methods = this.dispatch_map.get(type);
    if (methods != null) {
      return methods;
    } else if (this.default_implementation != null) {
      return this.default_implementation;
    } else {
      throw new MissingProtocolImplementationError(type, this.name);
    }
  }
}
