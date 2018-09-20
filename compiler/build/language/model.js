"use strict"; const $rt = require('@origamitower/origami/runtime');
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ImportContext = void 0;

class ImportContext {
  constructor(imports) {
    if (!(arguments.length === 1)) throw new Error("ImportContext.prototype.constructor takes 1 arguments, but got " + arguments.length);
    this.__imports = imports;
  }

  get imports() {
    return this.__imports;
  }

  static unapply(object) {
    if (!(arguments.length === 1)) throw new Error("ImportContext.prototype.unapply takes 1 arguments, but got " + arguments.length);

    if (object instanceof ImportContext) {
      return [object.__imports];
    } else {
      return null;
    }
  }

  $equals(that) {
    return $rt.$$checkClassEquals(["__imports"], that);
  }

  debugRepresentation({
    depth: depth = 0,
    visited: visited = new Set()
  } = {}) {
    return $rt.$$showObject("ImportContext", this, ["__imports"], depth, visited);
  }

}

exports.ImportContext = ImportContext;
