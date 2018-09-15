"use strict"; const $rt = require('@origamitower/origami/runtime');
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Alternate = exports.ImportBinding = exports.FunctionKind = exports.Argument = exports.Parameters = exports.ModuleDeclaration = exports.MemberDeclaration = exports.MemberKind = exports.ArrayPattern = exports.Pattern = exports.MatchCase = exports.FunctionBody = exports.SequenceItem = exports.Sign = exports.MacroLiteral = exports.Literal = exports.Expression = exports.Statement = exports.Definition = exports.Arguments = exports.NamedParameter = exports.MacroPair = exports.PairPattern = exports.Pair = exports.Decorator = exports.Metadata = exports.Superclass = exports.ClassMember = exports.ClassField = exports.Class = exports.FunctionSignature = exports.Header = exports.Program = void 0;

class Program {
  constructor(header, definitions) {
    if (!(arguments.length === 2)) throw new Error("Program.prototype.constructor takes 2 arguments, but got " + arguments.length);
    this.__header = header;
    this.__definitions = definitions;
  }

  get header() {
    return this.__header;
  }

  get definitions() {
    return this.__definitions;
  }

  static unapply(object) {
    if (!(arguments.length === 1)) throw new Error("Program.prototype.unapply takes 1 arguments, but got " + arguments.length);

    if (object instanceof Program) {
      return [object.__header, object.__definitions];
    } else {
      return null;
    }
  }

  $equals(that) {
    return $rt.$$checkClassEquals(["__header", "__definitions"]);
  }

  debugRepresentation({
    depth: depth = 0,
    visited: visited = new Set()
  } = {}) {
    return $rt.$$showObject("Program", this, ["__header", "__definitions"], depth, visited);
  }

}

exports.Program = Program;

class Header {
  constructor(name, value) {
    if (!(arguments.length === 2)) throw new Error("Header.prototype.constructor takes 2 arguments, but got " + arguments.length);
    this.__name = name;
    this.__value = value;
  }

  get name() {
    return this.__name;
  }

  get value() {
    return this.__value;
  }

  static unapply(object) {
    if (!(arguments.length === 1)) throw new Error("Header.prototype.unapply takes 1 arguments, but got " + arguments.length);

    if (object instanceof Header) {
      return [object.__name, object.__value];
    } else {
      return null;
    }
  }

  $equals(that) {
    return $rt.$$checkClassEquals(["__name", "__value"]);
  }

  debugRepresentation({
    depth: depth = 0,
    visited: visited = new Set()
  } = {}) {
    return $rt.$$showObject("Header", this, ["__name", "__value"], depth, visited);
  }

}

exports.Header = Header;

class FunctionSignature {
  constructor(kind, name, parameters) {
    if (!(arguments.length === 3)) throw new Error("FunctionSignature.prototype.constructor takes 3 arguments, but got " + arguments.length);
    this.__kind = kind;
    this.__name = name;
    this.__parameters = parameters;
  }

  get kind() {
    return this.__kind;
  }

  get name() {
    return this.__name;
  }

  get parameters() {
    return this.__parameters;
  }

  static unapply(object) {
    if (!(arguments.length === 1)) throw new Error("FunctionSignature.prototype.unapply takes 1 arguments, but got " + arguments.length);

    if (object instanceof FunctionSignature) {
      return [object.__kind, object.__name, object.__parameters];
    } else {
      return null;
    }
  }

  $equals(that) {
    return $rt.$$checkClassEquals(["__kind", "__name", "__parameters"]);
  }

  debugRepresentation({
    depth: depth = 0,
    visited: visited = new Set()
  } = {}) {
    return $rt.$$showObject("FunctionSignature", this, ["__kind", "__name", "__parameters"], depth, visited);
  }

}

exports.FunctionSignature = FunctionSignature;

class Class {
  constructor(name, parameters, superclass, fields, ctor, members) {
    if (!(arguments.length === 6)) throw new Error("Class.prototype.constructor takes 6 arguments, but got " + arguments.length);
    this.__name = name;
    this.__parameters = parameters;
    this.__superclass = superclass;
    this.__fields = fields;
    this.__ctor = ctor;
    this.__members = members;
  }

  get name() {
    return this.__name;
  }

  get parameters() {
    return this.__parameters;
  }

  get superclass() {
    return this.__superclass;
  }

  get fields() {
    return this.__fields;
  }

  get ctor() {
    return this.__ctor;
  }

  get members() {
    return this.__members;
  }

  static unapply(object) {
    if (!(arguments.length === 1)) throw new Error("Class.prototype.unapply takes 1 arguments, but got " + arguments.length);

    if (object instanceof Class) {
      return [object.__name, object.__parameters, object.__superclass, object.__fields, object.__ctor, object.__members];
    } else {
      return null;
    }
  }

  $equals(that) {
    return $rt.$$checkClassEquals(["__name", "__parameters", "__superclass", "__fields", "__ctor", "__members"]);
  }

  debugRepresentation({
    depth: depth = 0,
    visited: visited = new Set()
  } = {}) {
    return $rt.$$showObject("Class", this, ["__name", "__parameters", "__superclass", "__fields", "__ctor", "__members"], depth, visited);
  }

}

exports.Class = Class;

class ClassField {
  constructor(meta, name, initializer) {
    if (!(arguments.length === 3)) throw new Error("ClassField.prototype.constructor takes 3 arguments, but got " + arguments.length);
    this.__meta = meta;
    this.__name = name;
    this.__initializer = initializer;
  }

  get meta() {
    return this.__meta;
  }

  get name() {
    return this.__name;
  }

  get initializer() {
    return this.__initializer;
  }

  static unapply(object) {
    if (!(arguments.length === 1)) throw new Error("ClassField.prototype.unapply takes 1 arguments, but got " + arguments.length);

    if (object instanceof ClassField) {
      return [object.__meta, object.__name, object.__initializer];
    } else {
      return null;
    }
  }

  $equals(that) {
    return $rt.$$checkClassEquals(["__meta", "__name", "__initializer"]);
  }

  debugRepresentation({
    depth: depth = 0,
    visited: visited = new Set()
  } = {}) {
    return $rt.$$showObject("ClassField", this, ["__meta", "__name", "__initializer"], depth, visited);
  }

}

exports.ClassField = ClassField;

class ClassMember {
  constructor(meta, kind, declaration) {
    if (!(arguments.length === 3)) throw new Error("ClassMember.prototype.constructor takes 3 arguments, but got " + arguments.length);
    this.__meta = meta;
    this.__kind = kind;
    this.__declaration = declaration;
  }

  get meta() {
    return this.__meta;
  }

  get kind() {
    return this.__kind;
  }

  get declaration() {
    return this.__declaration;
  }

  static unapply(object) {
    if (!(arguments.length === 1)) throw new Error("ClassMember.prototype.unapply takes 1 arguments, but got " + arguments.length);

    if (object instanceof ClassMember) {
      return [object.__meta, object.__kind, object.__declaration];
    } else {
      return null;
    }
  }

  $equals(that) {
    return $rt.$$checkClassEquals(["__meta", "__kind", "__declaration"]);
  }

  debugRepresentation({
    depth: depth = 0,
    visited: visited = new Set()
  } = {}) {
    return $rt.$$showObject("ClassMember", this, ["__meta", "__kind", "__declaration"], depth, visited);
  }

}

exports.ClassMember = ClassMember;

class Superclass {
  constructor(object, args) {
    if (!(arguments.length === 2)) throw new Error("Superclass.prototype.constructor takes 2 arguments, but got " + arguments.length);
    this.__object = object;
    this.__args = args;
  }

  get object() {
    return this.__object;
  }

  get args() {
    return this.__args;
  }

  static unapply(object) {
    if (!(arguments.length === 1)) throw new Error("Superclass.prototype.unapply takes 1 arguments, but got " + arguments.length);

    if (object instanceof Superclass) {
      return [object.__object, object.__args];
    } else {
      return null;
    }
  }

  $equals(that) {
    return $rt.$$checkClassEquals(["__object", "__args"]);
  }

  debugRepresentation({
    depth: depth = 0,
    visited: visited = new Set()
  } = {}) {
    return $rt.$$showObject("Superclass", this, ["__object", "__args"], depth, visited);
  }

}

exports.Superclass = Superclass;

class Metadata {
  constructor(documentation, decorators) {
    if (!(arguments.length === 2)) throw new Error("Metadata.prototype.constructor takes 2 arguments, but got " + arguments.length);
    this.__documentation = documentation;
    this.__decorators = decorators;
  }

  get documentation() {
    return this.__documentation;
  }

  get decorators() {
    return this.__decorators;
  }

  static unapply(object) {
    if (!(arguments.length === 1)) throw new Error("Metadata.prototype.unapply takes 1 arguments, but got " + arguments.length);

    if (object instanceof Metadata) {
      return [object.__documentation, object.__decorators];
    } else {
      return null;
    }
  }

  $equals(that) {
    return $rt.$$checkClassEquals(["__documentation", "__decorators"]);
  }

  debugRepresentation({
    depth: depth = 0,
    visited: visited = new Set()
  } = {}) {
    return $rt.$$showObject("Metadata", this, ["__documentation", "__decorators"], depth, visited);
  }

}

exports.Metadata = Metadata;

class Decorator {
  constructor(name, args) {
    if (!(arguments.length === 2)) throw new Error("Decorator.prototype.constructor takes 2 arguments, but got " + arguments.length);
    this.__name = name;
    this.__args = args;
  }

  get name() {
    return this.__name;
  }

  get args() {
    return this.__args;
  }

  static unapply(object) {
    if (!(arguments.length === 1)) throw new Error("Decorator.prototype.unapply takes 1 arguments, but got " + arguments.length);

    if (object instanceof Decorator) {
      return [object.__name, object.__args];
    } else {
      return null;
    }
  }

  $equals(that) {
    return $rt.$$checkClassEquals(["__name", "__args"]);
  }

  debugRepresentation({
    depth: depth = 0,
    visited: visited = new Set()
  } = {}) {
    return $rt.$$showObject("Decorator", this, ["__name", "__args"], depth, visited);
  }

}

exports.Decorator = Decorator;

class Pair {
  constructor(key, value) {
    if (!(arguments.length === 2)) throw new Error("Pair.prototype.constructor takes 2 arguments, but got " + arguments.length);
    this.__key = key;
    this.__value = value;
  }

  get key() {
    return this.__key;
  }

  get value() {
    return this.__value;
  }

  static unapply(object) {
    if (!(arguments.length === 1)) throw new Error("Pair.prototype.unapply takes 1 arguments, but got " + arguments.length);

    if (object instanceof Pair) {
      return [object.__key, object.__value];
    } else {
      return null;
    }
  }

  $equals(that) {
    return $rt.$$checkClassEquals(["__key", "__value"]);
  }

  debugRepresentation({
    depth: depth = 0,
    visited: visited = new Set()
  } = {}) {
    return $rt.$$showObject("Pair", this, ["__key", "__value"], depth, visited);
  }

}

exports.Pair = Pair;

class PairPattern {
  constructor(name, pattern) {
    if (!(arguments.length === 2)) throw new Error("PairPattern.prototype.constructor takes 2 arguments, but got " + arguments.length);
    this.__name = name;
    this.__pattern = pattern;
  }

  get name() {
    return this.__name;
  }

  get pattern() {
    return this.__pattern;
  }

  static unapply(object) {
    if (!(arguments.length === 1)) throw new Error("PairPattern.prototype.unapply takes 1 arguments, but got " + arguments.length);

    if (object instanceof PairPattern) {
      return [object.__name, object.__pattern];
    } else {
      return null;
    }
  }

  $equals(that) {
    return $rt.$$checkClassEquals(["__name", "__pattern"]);
  }

  debugRepresentation({
    depth: depth = 0,
    visited: visited = new Set()
  } = {}) {
    return $rt.$$showObject("PairPattern", this, ["__name", "__pattern"], depth, visited);
  }

}

exports.PairPattern = PairPattern;

class MacroPair {
  constructor(name, value) {
    if (!(arguments.length === 2)) throw new Error("MacroPair.prototype.constructor takes 2 arguments, but got " + arguments.length);
    this.__name = name;
    this.__value = value;
  }

  get name() {
    return this.__name;
  }

  get value() {
    return this.__value;
  }

  static unapply(object) {
    if (!(arguments.length === 1)) throw new Error("MacroPair.prototype.unapply takes 1 arguments, but got " + arguments.length);

    if (object instanceof MacroPair) {
      return [object.__name, object.__value];
    } else {
      return null;
    }
  }

  $equals(that) {
    return $rt.$$checkClassEquals(["__name", "__value"]);
  }

  debugRepresentation({
    depth: depth = 0,
    visited: visited = new Set()
  } = {}) {
    return $rt.$$showObject("MacroPair", this, ["__name", "__value"], depth, visited);
  }

}

exports.MacroPair = MacroPair;

class NamedParameter {
  constructor(name, local, initializer) {
    if (!(arguments.length === 3)) throw new Error("NamedParameter.prototype.constructor takes 3 arguments, but got " + arguments.length);
    this.__name = name;
    this.__local = local;
    this.__initializer = initializer;
  }

  get name() {
    return this.__name;
  }

  get local() {
    return this.__local;
  }

  get initializer() {
    return this.__initializer;
  }

  static unapply(object) {
    if (!(arguments.length === 1)) throw new Error("NamedParameter.prototype.unapply takes 1 arguments, but got " + arguments.length);

    if (object instanceof NamedParameter) {
      return [object.__name, object.__local, object.__initializer];
    } else {
      return null;
    }
  }

  $equals(that) {
    return $rt.$$checkClassEquals(["__name", "__local", "__initializer"]);
  }

  debugRepresentation({
    depth: depth = 0,
    visited: visited = new Set()
  } = {}) {
    return $rt.$$showObject("NamedParameter", this, ["__name", "__local", "__initializer"], depth, visited);
  }

}

exports.NamedParameter = NamedParameter;

class Arguments {
  constructor(positional, named) {
    if (!(arguments.length === 2)) throw new Error("Arguments.prototype.constructor takes 2 arguments, but got " + arguments.length);
    this.__positional = positional;
    this.__named = named;
  }

  get positional() {
    return this.__positional;
  }

  get named() {
    return this.__named;
  }

  static unapply(object) {
    if (!(arguments.length === 1)) throw new Error("Arguments.prototype.unapply takes 1 arguments, but got " + arguments.length);

    if (object instanceof Arguments) {
      return [object.__positional, object.__named];
    } else {
      return null;
    }
  }

  $equals(that) {
    return $rt.$$checkClassEquals(["__positional", "__named"]);
  }

  debugRepresentation({
    depth: depth = 0,
    visited: visited = new Set()
  } = {}) {
    return $rt.$$showObject("Arguments", this, ["__positional", "__named"], depth, visited);
  }

}

exports.Arguments = Arguments;

const Definition = (() => {
  const $exports = {};

  class Import {
    constructor(id, alias, bindings) {
      if (!(arguments.length === 3)) throw new Error("Import.prototype.constructor takes 3 arguments, but got " + arguments.length);
      this.__id = id;
      this.__alias = alias;
      this.__bindings = bindings;
    }

    get id() {
      return this.__id;
    }

    get alias() {
      return this.__alias;
    }

    get bindings() {
      return this.__bindings;
    }

    static unapply(object) {
      if (!(arguments.length === 1)) throw new Error("Import.prototype.unapply takes 1 arguments, but got " + arguments.length);

      if (object instanceof Import) {
        return [object.__id, object.__alias, object.__bindings];
      } else {
        return null;
      }
    }

    $equals(that) {
      return $rt.$$checkClassEquals(["__id", "__alias", "__bindings"]);
    }

    debugRepresentation({
      depth: depth = 0,
      visited: visited = new Set()
    } = {}) {
      return $rt.$$showObject("Import", this, ["__id", "__alias", "__bindings"], depth, visited);
    }

  }

  $exports.Import = Import;

  class ImportEffect {
    constructor(id) {
      if (!(arguments.length === 1)) throw new Error("ImportEffect.prototype.constructor takes 1 arguments, but got " + arguments.length);
      this.__id = id;
    }

    get id() {
      return this.__id;
    }

    static unapply(object) {
      if (!(arguments.length === 1)) throw new Error("ImportEffect.prototype.unapply takes 1 arguments, but got " + arguments.length);

      if (object instanceof ImportEffect) {
        return [object.__id];
      } else {
        return null;
      }
    }

    $equals(that) {
      return $rt.$$checkClassEquals(["__id"]);
    }

    debugRepresentation({
      depth: depth = 0,
      visited: visited = new Set()
    } = {}) {
      return $rt.$$showObject("ImportEffect", this, ["__id"], depth, visited);
    }

  }

  $exports.ImportEffect = ImportEffect;

  class ImportCore {
    constructor(name, alias, binidngs) {
      if (!(arguments.length === 3)) throw new Error("ImportCore.prototype.constructor takes 3 arguments, but got " + arguments.length);
      this.__name = name;
      this.__alias = alias;
      this.__binidngs = binidngs;
    }

    get name() {
      return this.__name;
    }

    get alias() {
      return this.__alias;
    }

    get binidngs() {
      return this.__binidngs;
    }

    static unapply(object) {
      if (!(arguments.length === 1)) throw new Error("ImportCore.prototype.unapply takes 1 arguments, but got " + arguments.length);

      if (object instanceof ImportCore) {
        return [object.__name, object.__alias, object.__binidngs];
      } else {
        return null;
      }
    }

    $equals(that) {
      return $rt.$$checkClassEquals(["__name", "__alias", "__binidngs"]);
    }

    debugRepresentation({
      depth: depth = 0,
      visited: visited = new Set()
    } = {}) {
      return $rt.$$showObject("ImportCore", this, ["__name", "__alias", "__binidngs"], depth, visited);
    }

  }

  $exports.ImportCore = ImportCore;

  class ExportLocal {
    constructor(name, alias) {
      if (!(arguments.length === 2)) throw new Error("ExportLocal.prototype.constructor takes 2 arguments, but got " + arguments.length);
      this.__name = name;
      this.__alias = alias;
    }

    get name() {
      return this.__name;
    }

    get alias() {
      return this.__alias;
    }

    static unapply(object) {
      if (!(arguments.length === 1)) throw new Error("ExportLocal.prototype.unapply takes 1 arguments, but got " + arguments.length);

      if (object instanceof ExportLocal) {
        return [object.__name, object.__alias];
      } else {
        return null;
      }
    }

    $equals(that) {
      return $rt.$$checkClassEquals(["__name", "__alias"]);
    }

    debugRepresentation({
      depth: depth = 0,
      visited: visited = new Set()
    } = {}) {
      return $rt.$$showObject("ExportLocal", this, ["__name", "__alias"], depth, visited);
    }

  }

  $exports.ExportLocal = ExportLocal;

  class Function {
    constructor(meta, signature, body) {
      if (!(arguments.length === 3)) throw new Error("Function.prototype.constructor takes 3 arguments, but got " + arguments.length);
      this.__meta = meta;
      this.__signature = signature;
      this.__body = body;
    }

    get meta() {
      return this.__meta;
    }

    get signature() {
      return this.__signature;
    }

    get body() {
      return this.__body;
    }

    static unapply(object) {
      if (!(arguments.length === 1)) throw new Error("Function.prototype.unapply takes 1 arguments, but got " + arguments.length);

      if (object instanceof Function) {
        return [object.__meta, object.__signature, object.__body];
      } else {
        return null;
      }
    }

    $equals(that) {
      return $rt.$$checkClassEquals(["__meta", "__signature", "__body"]);
    }

    debugRepresentation({
      depth: depth = 0,
      visited: visited = new Set()
    } = {}) {
      return $rt.$$showObject("Function", this, ["__meta", "__signature", "__body"], depth, visited);
    }

  }

  $exports.Function = Function;

  class Module {
    constructor(meta, name, declarations) {
      if (!(arguments.length === 3)) throw new Error("Module.prototype.constructor takes 3 arguments, but got " + arguments.length);
      this.__meta = meta;
      this.__name = name;
      this.__declarations = declarations;
    }

    get meta() {
      return this.__meta;
    }

    get name() {
      return this.__name;
    }

    get declarations() {
      return this.__declarations;
    }

    static unapply(object) {
      if (!(arguments.length === 1)) throw new Error("Module.prototype.unapply takes 1 arguments, but got " + arguments.length);

      if (object instanceof Module) {
        return [object.__meta, object.__name, object.__declarations];
      } else {
        return null;
      }
    }

    $equals(that) {
      return $rt.$$checkClassEquals(["__meta", "__name", "__declarations"]);
    }

    debugRepresentation({
      depth: depth = 0,
      visited: visited = new Set()
    } = {}) {
      return $rt.$$showObject("Module", this, ["__meta", "__name", "__declarations"], depth, visited);
    }

  }

  $exports.Module = Module;

  class DataClass {
    constructor(meta, classDefinition) {
      if (!(arguments.length === 2)) throw new Error("DataClass.prototype.constructor takes 2 arguments, but got " + arguments.length);
      this.__meta = meta;
      this.__classDefinition = classDefinition;
    }

    get meta() {
      return this.__meta;
    }

    get classDefinition() {
      return this.__classDefinition;
    }

    static unapply(object) {
      if (!(arguments.length === 1)) throw new Error("DataClass.prototype.unapply takes 1 arguments, but got " + arguments.length);

      if (object instanceof DataClass) {
        return [object.__meta, object.__classDefinition];
      } else {
        return null;
      }
    }

    $equals(that) {
      return $rt.$$checkClassEquals(["__meta", "__classDefinition"]);
    }

    debugRepresentation({
      depth: depth = 0,
      visited: visited = new Set()
    } = {}) {
      return $rt.$$showObject("DataClass", this, ["__meta", "__classDefinition"], depth, visited);
    }

  }

  $exports.DataClass = DataClass;

  class Class {
    constructor(meta, classDefinition) {
      if (!(arguments.length === 2)) throw new Error("Class.prototype.constructor takes 2 arguments, but got " + arguments.length);
      this.__meta = meta;
      this.__classDefinition = classDefinition;
    }

    get meta() {
      return this.__meta;
    }

    get classDefinition() {
      return this.__classDefinition;
    }

    static unapply(object) {
      if (!(arguments.length === 1)) throw new Error("Class.prototype.unapply takes 1 arguments, but got " + arguments.length);

      if (object instanceof Class) {
        return [object.__meta, object.__classDefinition];
      } else {
        return null;
      }
    }

    $equals(that) {
      return $rt.$$checkClassEquals(["__meta", "__classDefinition"]);
    }

    debugRepresentation({
      depth: depth = 0,
      visited: visited = new Set()
    } = {}) {
      return $rt.$$showObject("Class", this, ["__meta", "__classDefinition"], depth, visited);
    }

  }

  $exports.Class = Class;
  return $exports;
})();

exports.Definition = Definition;

const Statement = (() => {
  const $exports = {};

  class Let {
    constructor(name, initializer) {
      if (!(arguments.length === 2)) throw new Error("Let.prototype.constructor takes 2 arguments, but got " + arguments.length);
      this.__name = name;
      this.__initializer = initializer;
    }

    get name() {
      return this.__name;
    }

    get initializer() {
      return this.__initializer;
    }

    static unapply(object) {
      if (!(arguments.length === 1)) throw new Error("Let.prototype.unapply takes 1 arguments, but got " + arguments.length);

      if (object instanceof Let) {
        return [object.__name, object.__initializer];
      } else {
        return null;
      }
    }

    $equals(that) {
      return $rt.$$checkClassEquals(["__name", "__initializer"]);
    }

    debugRepresentation({
      depth: depth = 0,
      visited: visited = new Set()
    } = {}) {
      return $rt.$$showObject("Let", this, ["__name", "__initializer"], depth, visited);
    }

  }

  $exports.Let = Let;

  class LetMutable {
    constructor(name, initializer) {
      if (!(arguments.length === 2)) throw new Error("LetMutable.prototype.constructor takes 2 arguments, but got " + arguments.length);
      this.__name = name;
      this.__initializer = initializer;
    }

    get name() {
      return this.__name;
    }

    get initializer() {
      return this.__initializer;
    }

    static unapply(object) {
      if (!(arguments.length === 1)) throw new Error("LetMutable.prototype.unapply takes 1 arguments, but got " + arguments.length);

      if (object instanceof LetMutable) {
        return [object.__name, object.__initializer];
      } else {
        return null;
      }
    }

    $equals(that) {
      return $rt.$$checkClassEquals(["__name", "__initializer"]);
    }

    debugRepresentation({
      depth: depth = 0,
      visited: visited = new Set()
    } = {}) {
      return $rt.$$showObject("LetMutable", this, ["__name", "__initializer"], depth, visited);
    }

  }

  $exports.LetMutable = LetMutable;

  class LetMatch {
    constructor(pattern, initializer) {
      if (!(arguments.length === 2)) throw new Error("LetMatch.prototype.constructor takes 2 arguments, but got " + arguments.length);
      this.__pattern = pattern;
      this.__initializer = initializer;
    }

    get pattern() {
      return this.__pattern;
    }

    get initializer() {
      return this.__initializer;
    }

    static unapply(object) {
      if (!(arguments.length === 1)) throw new Error("LetMatch.prototype.unapply takes 1 arguments, but got " + arguments.length);

      if (object instanceof LetMatch) {
        return [object.__pattern, object.__initializer];
      } else {
        return null;
      }
    }

    $equals(that) {
      return $rt.$$checkClassEquals(["__pattern", "__initializer"]);
    }

    debugRepresentation({
      depth: depth = 0,
      visited: visited = new Set()
    } = {}) {
      return $rt.$$showObject("LetMatch", this, ["__pattern", "__initializer"], depth, visited);
    }

  }

  $exports.LetMatch = LetMatch;

  class Assert {
    constructor(expression) {
      if (!(arguments.length === 1)) throw new Error("Assert.prototype.constructor takes 1 arguments, but got " + arguments.length);
      this.__expression = expression;
    }

    get expression() {
      return this.__expression;
    }

    static unapply(object) {
      if (!(arguments.length === 1)) throw new Error("Assert.prototype.unapply takes 1 arguments, but got " + arguments.length);

      if (object instanceof Assert) {
        return [object.__expression];
      } else {
        return null;
      }
    }

    $equals(that) {
      return $rt.$$checkClassEquals(["__expression"]);
    }

    debugRepresentation({
      depth: depth = 0,
      visited: visited = new Set()
    } = {}) {
      return $rt.$$showObject("Assert", this, ["__expression"], depth, visited);
    }

  }

  $exports.Assert = Assert;

  class Foreach {
    constructor(name, expression, body) {
      if (!(arguments.length === 3)) throw new Error("Foreach.prototype.constructor takes 3 arguments, but got " + arguments.length);
      this.__name = name;
      this.__expression = expression;
      this.__body = body;
    }

    get name() {
      return this.__name;
    }

    get expression() {
      return this.__expression;
    }

    get body() {
      return this.__body;
    }

    static unapply(object) {
      if (!(arguments.length === 1)) throw new Error("Foreach.prototype.unapply takes 1 arguments, but got " + arguments.length);

      if (object instanceof Foreach) {
        return [object.__name, object.__expression, object.__body];
      } else {
        return null;
      }
    }

    $equals(that) {
      return $rt.$$checkClassEquals(["__name", "__expression", "__body"]);
    }

    debugRepresentation({
      depth: depth = 0,
      visited: visited = new Set()
    } = {}) {
      return $rt.$$showObject("Foreach", this, ["__name", "__expression", "__body"], depth, visited);
    }

  }

  $exports.Foreach = Foreach;

  class While {
    constructor(predicate, body) {
      if (!(arguments.length === 2)) throw new Error("While.prototype.constructor takes 2 arguments, but got " + arguments.length);
      this.__predicate = predicate;
      this.__body = body;
    }

    get predicate() {
      return this.__predicate;
    }

    get body() {
      return this.__body;
    }

    static unapply(object) {
      if (!(arguments.length === 1)) throw new Error("While.prototype.unapply takes 1 arguments, but got " + arguments.length);

      if (object instanceof While) {
        return [object.__predicate, object.__body];
      } else {
        return null;
      }
    }

    $equals(that) {
      return $rt.$$checkClassEquals(["__predicate", "__body"]);
    }

    debugRepresentation({
      depth: depth = 0,
      visited: visited = new Set()
    } = {}) {
      return $rt.$$showObject("While", this, ["__predicate", "__body"], depth, visited);
    }

  }

  $exports.While = While;

  class Until {
    constructor(predicate, body) {
      if (!(arguments.length === 2)) throw new Error("Until.prototype.constructor takes 2 arguments, but got " + arguments.length);
      this.__predicate = predicate;
      this.__body = body;
    }

    get predicate() {
      return this.__predicate;
    }

    get body() {
      return this.__body;
    }

    static unapply(object) {
      if (!(arguments.length === 1)) throw new Error("Until.prototype.unapply takes 1 arguments, but got " + arguments.length);

      if (object instanceof Until) {
        return [object.__predicate, object.__body];
      } else {
        return null;
      }
    }

    $equals(that) {
      return $rt.$$checkClassEquals(["__predicate", "__body"]);
    }

    debugRepresentation({
      depth: depth = 0,
      visited: visited = new Set()
    } = {}) {
      return $rt.$$showObject("Until", this, ["__predicate", "__body"], depth, visited);
    }

  }

  $exports.Until = Until;

  class For {
    constructor(name, start, end, step, body) {
      if (!(arguments.length === 5)) throw new Error("For.prototype.constructor takes 5 arguments, but got " + arguments.length);
      this.__name = name;
      this.__start = start;
      this.__end = end;
      this.__step = step;
      this.__body = body;
    }

    get name() {
      return this.__name;
    }

    get start() {
      return this.__start;
    }

    get end() {
      return this.__end;
    }

    get step() {
      return this.__step;
    }

    get body() {
      return this.__body;
    }

    static unapply(object) {
      if (!(arguments.length === 1)) throw new Error("For.prototype.unapply takes 1 arguments, but got " + arguments.length);

      if (object instanceof For) {
        return [object.__name, object.__start, object.__end, object.__step, object.__body];
      } else {
        return null;
      }
    }

    $equals(that) {
      return $rt.$$checkClassEquals(["__name", "__start", "__end", "__step", "__body"]);
    }

    debugRepresentation({
      depth: depth = 0,
      visited: visited = new Set()
    } = {}) {
      return $rt.$$showObject("For", this, ["__name", "__start", "__end", "__step", "__body"], depth, visited);
    }

  }

  $exports.For = For;

  class Repeat {
    constructor(body) {
      if (!(arguments.length === 1)) throw new Error("Repeat.prototype.constructor takes 1 arguments, but got " + arguments.length);
      this.__body = body;
    }

    get body() {
      return this.__body;
    }

    static unapply(object) {
      if (!(arguments.length === 1)) throw new Error("Repeat.prototype.unapply takes 1 arguments, but got " + arguments.length);

      if (object instanceof Repeat) {
        return [object.__body];
      } else {
        return null;
      }
    }

    $equals(that) {
      return $rt.$$checkClassEquals(["__body"]);
    }

    debugRepresentation({
      depth: depth = 0,
      visited: visited = new Set()
    } = {}) {
      return $rt.$$showObject("Repeat", this, ["__body"], depth, visited);
    }

  }

  $exports.Repeat = Repeat;

  class IfElse {
    constructor(test, consequent, alternate) {
      if (!(arguments.length === 3)) throw new Error("IfElse.prototype.constructor takes 3 arguments, but got " + arguments.length);
      this.__test = test;
      this.__consequent = consequent;
      this.__alternate = alternate;
    }

    get test() {
      return this.__test;
    }

    get consequent() {
      return this.__consequent;
    }

    get alternate() {
      return this.__alternate;
    }

    static unapply(object) {
      if (!(arguments.length === 1)) throw new Error("IfElse.prototype.unapply takes 1 arguments, but got " + arguments.length);

      if (object instanceof IfElse) {
        return [object.__test, object.__consequent, object.__alternate];
      } else {
        return null;
      }
    }

    $equals(that) {
      return $rt.$$checkClassEquals(["__test", "__consequent", "__alternate"]);
    }

    debugRepresentation({
      depth: depth = 0,
      visited: visited = new Set()
    } = {}) {
      return $rt.$$showObject("IfElse", this, ["__test", "__consequent", "__alternate"], depth, visited);
    }

  }

  $exports.IfElse = IfElse;

  class If {
    constructor(test, consequent) {
      if (!(arguments.length === 2)) throw new Error("If.prototype.constructor takes 2 arguments, but got " + arguments.length);
      this.__test = test;
      this.__consequent = consequent;
    }

    get test() {
      return this.__test;
    }

    get consequent() {
      return this.__consequent;
    }

    static unapply(object) {
      if (!(arguments.length === 1)) throw new Error("If.prototype.unapply takes 1 arguments, but got " + arguments.length);

      if (object instanceof If) {
        return [object.__test, object.__consequent];
      } else {
        return null;
      }
    }

    $equals(that) {
      return $rt.$$checkClassEquals(["__test", "__consequent"]);
    }

    debugRepresentation({
      depth: depth = 0,
      visited: visited = new Set()
    } = {}) {
      return $rt.$$showObject("If", this, ["__test", "__consequent"], depth, visited);
    }

  }

  $exports.If = If;

  class Match {
    constructor(expression, cases) {
      if (!(arguments.length === 2)) throw new Error("Match.prototype.constructor takes 2 arguments, but got " + arguments.length);
      this.__expression = expression;
      this.__cases = cases;
    }

    get expression() {
      return this.__expression;
    }

    get cases() {
      return this.__cases;
    }

    static unapply(object) {
      if (!(arguments.length === 1)) throw new Error("Match.prototype.unapply takes 1 arguments, but got " + arguments.length);

      if (object instanceof Match) {
        return [object.__expression, object.__cases];
      } else {
        return null;
      }
    }

    $equals(that) {
      return $rt.$$checkClassEquals(["__expression", "__cases"]);
    }

    debugRepresentation({
      depth: depth = 0,
      visited: visited = new Set()
    } = {}) {
      return $rt.$$showObject("Match", this, ["__expression", "__cases"], depth, visited);
    }

  }

  $exports.Match = Match;

  class Expression {
    constructor(expression) {
      if (!(arguments.length === 1)) throw new Error("Expression.prototype.constructor takes 1 arguments, but got " + arguments.length);
      this.__expression = expression;
    }

    get expression() {
      return this.__expression;
    }

    static unapply(object) {
      if (!(arguments.length === 1)) throw new Error("Expression.prototype.unapply takes 1 arguments, but got " + arguments.length);

      if (object instanceof Expression) {
        return [object.__expression];
      } else {
        return null;
      }
    }

    $equals(that) {
      return $rt.$$checkClassEquals(["__expression"]);
    }

    debugRepresentation({
      depth: depth = 0,
      visited: visited = new Set()
    } = {}) {
      return $rt.$$showObject("Expression", this, ["__expression"], depth, visited);
    }

  }

  $exports.Expression = Expression;

  class Decorated {
    constructor(decorator, statement) {
      if (!(arguments.length === 2)) throw new Error("Decorated.prototype.constructor takes 2 arguments, but got " + arguments.length);
      this.__decorator = decorator;
      this.__statement = statement;
    }

    get decorator() {
      return this.__decorator;
    }

    get statement() {
      return this.__statement;
    }

    static unapply(object) {
      if (!(arguments.length === 1)) throw new Error("Decorated.prototype.unapply takes 1 arguments, but got " + arguments.length);

      if (object instanceof Decorated) {
        return [object.__decorator, object.__statement];
      } else {
        return null;
      }
    }

    $equals(that) {
      return $rt.$$checkClassEquals(["__decorator", "__statement"]);
    }

    debugRepresentation({
      depth: depth = 0,
      visited: visited = new Set()
    } = {}) {
      return $rt.$$showObject("Decorated", this, ["__decorator", "__statement"], depth, visited);
    }

  }

  $exports.Decorated = Decorated;
  return $exports;
})();

exports.Statement = Statement;

const Expression = (() => {
  const $exports = {};

  class IfThenElse {
    constructor(test, consequent, alternate) {
      if (!(arguments.length === 3)) throw new Error("IfThenElse.prototype.constructor takes 3 arguments, but got " + arguments.length);
      this.__test = test;
      this.__consequent = consequent;
      this.__alternate = alternate;
    }

    get test() {
      return this.__test;
    }

    get consequent() {
      return this.__consequent;
    }

    get alternate() {
      return this.__alternate;
    }

    static unapply(object) {
      if (!(arguments.length === 1)) throw new Error("IfThenElse.prototype.unapply takes 1 arguments, but got " + arguments.length);

      if (object instanceof IfThenElse) {
        return [object.__test, object.__consequent, object.__alternate];
      } else {
        return null;
      }
    }

    $equals(that) {
      return $rt.$$checkClassEquals(["__test", "__consequent", "__alternate"]);
    }

    debugRepresentation({
      depth: depth = 0,
      visited: visited = new Set()
    } = {}) {
      return $rt.$$showObject("IfThenElse", this, ["__test", "__consequent", "__alternate"], depth, visited);
    }

  }

  $exports.IfThenElse = IfThenElse;

  class Pipe {
    constructor(left, right) {
      if (!(arguments.length === 2)) throw new Error("Pipe.prototype.constructor takes 2 arguments, but got " + arguments.length);
      this.__left = left;
      this.__right = right;
    }

    get left() {
      return this.__left;
    }

    get right() {
      return this.__right;
    }

    static unapply(object) {
      if (!(arguments.length === 1)) throw new Error("Pipe.prototype.unapply takes 1 arguments, but got " + arguments.length);

      if (object instanceof Pipe) {
        return [object.__left, object.__right];
      } else {
        return null;
      }
    }

    $equals(that) {
      return $rt.$$checkClassEquals(["__left", "__right"]);
    }

    debugRepresentation({
      depth: depth = 0,
      visited: visited = new Set()
    } = {}) {
      return $rt.$$showObject("Pipe", this, ["__left", "__right"], depth, visited);
    }

  }

  $exports.Pipe = Pipe;

  class Await {
    constructor(expression) {
      if (!(arguments.length === 1)) throw new Error("Await.prototype.constructor takes 1 arguments, but got " + arguments.length);
      this.__expression = expression;
    }

    get expression() {
      return this.__expression;
    }

    static unapply(object) {
      if (!(arguments.length === 1)) throw new Error("Await.prototype.unapply takes 1 arguments, but got " + arguments.length);

      if (object instanceof Await) {
        return [object.__expression];
      } else {
        return null;
      }
    }

    $equals(that) {
      return $rt.$$checkClassEquals(["__expression"]);
    }

    debugRepresentation({
      depth: depth = 0,
      visited: visited = new Set()
    } = {}) {
      return $rt.$$showObject("Await", this, ["__expression"], depth, visited);
    }

  }

  $exports.Await = Await;

  class YieldAll {
    constructor(expression) {
      if (!(arguments.length === 1)) throw new Error("YieldAll.prototype.constructor takes 1 arguments, but got " + arguments.length);
      this.__expression = expression;
    }

    get expression() {
      return this.__expression;
    }

    static unapply(object) {
      if (!(arguments.length === 1)) throw new Error("YieldAll.prototype.unapply takes 1 arguments, but got " + arguments.length);

      if (object instanceof YieldAll) {
        return [object.__expression];
      } else {
        return null;
      }
    }

    $equals(that) {
      return $rt.$$checkClassEquals(["__expression"]);
    }

    debugRepresentation({
      depth: depth = 0,
      visited: visited = new Set()
    } = {}) {
      return $rt.$$showObject("YieldAll", this, ["__expression"], depth, visited);
    }

  }

  $exports.YieldAll = YieldAll;

  class Yield {
    constructor(expression) {
      if (!(arguments.length === 1)) throw new Error("Yield.prototype.constructor takes 1 arguments, but got " + arguments.length);
      this.__expression = expression;
    }

    get expression() {
      return this.__expression;
    }

    static unapply(object) {
      if (!(arguments.length === 1)) throw new Error("Yield.prototype.unapply takes 1 arguments, but got " + arguments.length);

      if (object instanceof Yield) {
        return [object.__expression];
      } else {
        return null;
      }
    }

    $equals(that) {
      return $rt.$$checkClassEquals(["__expression"]);
    }

    debugRepresentation({
      depth: depth = 0,
      visited: visited = new Set()
    } = {}) {
      return $rt.$$showObject("Yield", this, ["__expression"], depth, visited);
    }

  }

  $exports.Yield = Yield;

  class Binary {
    constructor(operator, left, right) {
      if (!(arguments.length === 3)) throw new Error("Binary.prototype.constructor takes 3 arguments, but got " + arguments.length);
      this.__operator = operator;
      this.__left = left;
      this.__right = right;
    }

    get operator() {
      return this.__operator;
    }

    get left() {
      return this.__left;
    }

    get right() {
      return this.__right;
    }

    static unapply(object) {
      if (!(arguments.length === 1)) throw new Error("Binary.prototype.unapply takes 1 arguments, but got " + arguments.length);

      if (object instanceof Binary) {
        return [object.__operator, object.__left, object.__right];
      } else {
        return null;
      }
    }

    $equals(that) {
      return $rt.$$checkClassEquals(["__operator", "__left", "__right"]);
    }

    debugRepresentation({
      depth: depth = 0,
      visited: visited = new Set()
    } = {}) {
      return $rt.$$showObject("Binary", this, ["__operator", "__left", "__right"], depth, visited);
    }

  }

  $exports.Binary = Binary;

  class In {
    constructor(object, value) {
      if (!(arguments.length === 2)) throw new Error("In.prototype.constructor takes 2 arguments, but got " + arguments.length);
      this.__object = object;
      this.__value = value;
    }

    get object() {
      return this.__object;
    }

    get value() {
      return this.__value;
    }

    static unapply(object) {
      if (!(arguments.length === 1)) throw new Error("In.prototype.unapply takes 1 arguments, but got " + arguments.length);

      if (object instanceof In) {
        return [object.__object, object.__value];
      } else {
        return null;
      }
    }

    $equals(that) {
      return $rt.$$checkClassEquals(["__object", "__value"]);
    }

    debugRepresentation({
      depth: depth = 0,
      visited: visited = new Set()
    } = {}) {
      return $rt.$$showObject("In", this, ["__object", "__value"], depth, visited);
    }

  }

  $exports.In = In;

  class Unary {
    constructor(operator, expression) {
      if (!(arguments.length === 2)) throw new Error("Unary.prototype.constructor takes 2 arguments, but got " + arguments.length);
      this.__operator = operator;
      this.__expression = expression;
    }

    get operator() {
      return this.__operator;
    }

    get expression() {
      return this.__expression;
    }

    static unapply(object) {
      if (!(arguments.length === 1)) throw new Error("Unary.prototype.unapply takes 1 arguments, but got " + arguments.length);

      if (object instanceof Unary) {
        return [object.__operator, object.__expression];
      } else {
        return null;
      }
    }

    $equals(that) {
      return $rt.$$checkClassEquals(["__operator", "__expression"]);
    }

    debugRepresentation({
      depth: depth = 0,
      visited: visited = new Set()
    } = {}) {
      return $rt.$$showObject("Unary", this, ["__operator", "__expression"], depth, visited);
    }

  }

  $exports.Unary = Unary;

  class Call {
    constructor(callee, args) {
      if (!(arguments.length === 2)) throw new Error("Call.prototype.constructor takes 2 arguments, but got " + arguments.length);
      this.__callee = callee;
      this.__args = args;
    }

    get callee() {
      return this.__callee;
    }

    get args() {
      return this.__args;
    }

    static unapply(object) {
      if (!(arguments.length === 1)) throw new Error("Call.prototype.unapply takes 1 arguments, but got " + arguments.length);

      if (object instanceof Call) {
        return [object.__callee, object.__args];
      } else {
        return null;
      }
    }

    $equals(that) {
      return $rt.$$checkClassEquals(["__callee", "__args"]);
    }

    debugRepresentation({
      depth: depth = 0,
      visited: visited = new Set()
    } = {}) {
      return $rt.$$showObject("Call", this, ["__callee", "__args"], depth, visited);
    }

  }

  $exports.Call = Call;

  class MethodCall {
    constructor(object, message, args) {
      if (!(arguments.length === 3)) throw new Error("MethodCall.prototype.constructor takes 3 arguments, but got " + arguments.length);
      this.__object = object;
      this.__message = message;
      this.__args = args;
    }

    get object() {
      return this.__object;
    }

    get message() {
      return this.__message;
    }

    get args() {
      return this.__args;
    }

    static unapply(object) {
      if (!(arguments.length === 1)) throw new Error("MethodCall.prototype.unapply takes 1 arguments, but got " + arguments.length);

      if (object instanceof MethodCall) {
        return [object.__object, object.__message, object.__args];
      } else {
        return null;
      }
    }

    $equals(that) {
      return $rt.$$checkClassEquals(["__object", "__message", "__args"]);
    }

    debugRepresentation({
      depth: depth = 0,
      visited: visited = new Set()
    } = {}) {
      return $rt.$$showObject("MethodCall", this, ["__object", "__message", "__args"], depth, visited);
    }

  }

  $exports.MethodCall = MethodCall;

  class Set {
    constructor(object, property, value) {
      if (!(arguments.length === 3)) throw new Error("Set.prototype.constructor takes 3 arguments, but got " + arguments.length);
      this.__object = object;
      this.__property = property;
      this.__value = value;
    }

    get object() {
      return this.__object;
    }

    get property() {
      return this.__property;
    }

    get value() {
      return this.__value;
    }

    static unapply(object) {
      if (!(arguments.length === 1)) throw new Error("Set.prototype.unapply takes 1 arguments, but got " + arguments.length);

      if (object instanceof Set) {
        return [object.__object, object.__property, object.__value];
      } else {
        return null;
      }
    }

    $equals(that) {
      return $rt.$$checkClassEquals(["__object", "__property", "__value"]);
    }

    debugRepresentation({
      depth: depth = 0,
      visited: visited = new Set()
    } = {}) {
      return $rt.$$showObject("Set", this, ["__object", "__property", "__value"], depth, visited);
    }

  }

  $exports.Set = Set;

  class Get {
    constructor(object, property) {
      if (!(arguments.length === 2)) throw new Error("Get.prototype.constructor takes 2 arguments, but got " + arguments.length);
      this.__object = object;
      this.__property = property;
    }

    get object() {
      return this.__object;
    }

    get property() {
      return this.__property;
    }

    static unapply(object) {
      if (!(arguments.length === 1)) throw new Error("Get.prototype.unapply takes 1 arguments, but got " + arguments.length);

      if (object instanceof Get) {
        return [object.__object, object.__property];
      } else {
        return null;
      }
    }

    $equals(that) {
      return $rt.$$checkClassEquals(["__object", "__property"]);
    }

    debugRepresentation({
      depth: depth = 0,
      visited: visited = new Set()
    } = {}) {
      return $rt.$$showObject("Get", this, ["__object", "__property"], depth, visited);
    }

  }

  $exports.Get = Get;

  class At {
    constructor(object, key) {
      if (!(arguments.length === 2)) throw new Error("At.prototype.constructor takes 2 arguments, but got " + arguments.length);
      this.__object = object;
      this.__key = key;
    }

    get object() {
      return this.__object;
    }

    get key() {
      return this.__key;
    }

    static unapply(object) {
      if (!(arguments.length === 1)) throw new Error("At.prototype.unapply takes 1 arguments, but got " + arguments.length);

      if (object instanceof At) {
        return [object.__object, object.__key];
      } else {
        return null;
      }
    }

    $equals(that) {
      return $rt.$$checkClassEquals(["__object", "__key"]);
    }

    debugRepresentation({
      depth: depth = 0,
      visited: visited = new Set()
    } = {}) {
      return $rt.$$showObject("At", this, ["__object", "__key"], depth, visited);
    }

  }

  $exports.At = At;

  class AtPut {
    constructor(object, key, value) {
      if (!(arguments.length === 3)) throw new Error("AtPut.prototype.constructor takes 3 arguments, but got " + arguments.length);
      this.__object = object;
      this.__key = key;
      this.__value = value;
    }

    get object() {
      return this.__object;
    }

    get key() {
      return this.__key;
    }

    get value() {
      return this.__value;
    }

    static unapply(object) {
      if (!(arguments.length === 1)) throw new Error("AtPut.prototype.unapply takes 1 arguments, but got " + arguments.length);

      if (object instanceof AtPut) {
        return [object.__object, object.__key, object.__value];
      } else {
        return null;
      }
    }

    $equals(that) {
      return $rt.$$checkClassEquals(["__object", "__key", "__value"]);
    }

    debugRepresentation({
      depth: depth = 0,
      visited: visited = new Set()
    } = {}) {
      return $rt.$$showObject("AtPut", this, ["__object", "__key", "__value"], depth, visited);
    }

  }

  $exports.AtPut = AtPut;

  class Assign {
    constructor(name, value) {
      if (!(arguments.length === 2)) throw new Error("Assign.prototype.constructor takes 2 arguments, but got " + arguments.length);
      this.__name = name;
      this.__value = value;
    }

    get name() {
      return this.__name;
    }

    get value() {
      return this.__value;
    }

    static unapply(object) {
      if (!(arguments.length === 1)) throw new Error("Assign.prototype.unapply takes 1 arguments, but got " + arguments.length);

      if (object instanceof Assign) {
        return [object.__name, object.__value];
      } else {
        return null;
      }
    }

    $equals(that) {
      return $rt.$$checkClassEquals(["__name", "__value"]);
    }

    debugRepresentation({
      depth: depth = 0,
      visited: visited = new Set()
    } = {}) {
      return $rt.$$showObject("Assign", this, ["__name", "__value"], depth, visited);
    }

  }

  $exports.Assign = Assign;

  class New {
    constructor(object, args) {
      if (!(arguments.length === 2)) throw new Error("New.prototype.constructor takes 2 arguments, but got " + arguments.length);
      this.__object = object;
      this.__args = args;
    }

    get object() {
      return this.__object;
    }

    get args() {
      return this.__args;
    }

    static unapply(object) {
      if (!(arguments.length === 1)) throw new Error("New.prototype.unapply takes 1 arguments, but got " + arguments.length);

      if (object instanceof New) {
        return [object.__object, object.__args];
      } else {
        return null;
      }
    }

    $equals(that) {
      return $rt.$$checkClassEquals(["__object", "__args"]);
    }

    debugRepresentation({
      depth: depth = 0,
      visited: visited = new Set()
    } = {}) {
      return $rt.$$showObject("New", this, ["__object", "__args"], depth, visited);
    }

  }

  $exports.New = New;

  class Variable {
    constructor(name) {
      if (!(arguments.length === 1)) throw new Error("Variable.prototype.constructor takes 1 arguments, but got " + arguments.length);
      this.__name = name;
    }

    get name() {
      return this.__name;
    }

    static unapply(object) {
      if (!(arguments.length === 1)) throw new Error("Variable.prototype.unapply takes 1 arguments, but got " + arguments.length);

      if (object instanceof Variable) {
        return [object.__name];
      } else {
        return null;
      }
    }

    $equals(that) {
      return $rt.$$checkClassEquals(["__name"]);
    }

    debugRepresentation({
      depth: depth = 0,
      visited: visited = new Set()
    } = {}) {
      return $rt.$$showObject("Variable", this, ["__name"], depth, visited);
    }

  }

  $exports.Variable = Variable;

  class Super {
    constructor() {
      if (!(arguments.length === 0)) throw new Error("Super.prototype.constructor takes 0 arguments, but got " + arguments.length);
    }

    static unapply(object) {
      if (!(arguments.length === 1)) throw new Error("Super.prototype.unapply takes 1 arguments, but got " + arguments.length);

      if (object instanceof Super) {
        return [];
      } else {
        return null;
      }
    }

    $equals(that) {
      return $rt.$$checkClassEquals([]);
    }

    debugRepresentation({
      depth: depth = 0,
      visited: visited = new Set()
    } = {}) {
      return $rt.$$showObject("Super", this, [], depth, visited);
    }

  }

  $exports.Super = Super;

  class Literal {
    constructor(literal) {
      if (!(arguments.length === 1)) throw new Error("Literal.prototype.constructor takes 1 arguments, but got " + arguments.length);
      this.__literal = literal;
    }

    get literal() {
      return this.__literal;
    }

    static unapply(object) {
      if (!(arguments.length === 1)) throw new Error("Literal.prototype.unapply takes 1 arguments, but got " + arguments.length);

      if (object instanceof Literal) {
        return [object.__literal];
      } else {
        return null;
      }
    }

    $equals(that) {
      return $rt.$$checkClassEquals(["__literal"]);
    }

    debugRepresentation({
      depth: depth = 0,
      visited: visited = new Set()
    } = {}) {
      return $rt.$$showObject("Literal", this, ["__literal"], depth, visited);
    }

  }

  $exports.Literal = Literal;

  class Hole {
    constructor() {
      if (!(arguments.length === 0)) throw new Error("Hole.prototype.constructor takes 0 arguments, but got " + arguments.length);
    }

    static unapply(object) {
      if (!(arguments.length === 1)) throw new Error("Hole.prototype.unapply takes 1 arguments, but got " + arguments.length);

      if (object instanceof Hole) {
        return [];
      } else {
        return null;
      }
    }

    $equals(that) {
      return $rt.$$checkClassEquals([]);
    }

    debugRepresentation({
      depth: depth = 0,
      visited: visited = new Set()
    } = {}) {
      return $rt.$$showObject("Hole", this, [], depth, visited);
    }

  }

  $exports.Hole = Hole;

  class Array {
    constructor(items) {
      if (!(arguments.length === 1)) throw new Error("Array.prototype.constructor takes 1 arguments, but got " + arguments.length);
      this.__items = items;
    }

    get items() {
      return this.__items;
    }

    static unapply(object) {
      if (!(arguments.length === 1)) throw new Error("Array.prototype.unapply takes 1 arguments, but got " + arguments.length);

      if (object instanceof Array) {
        return [object.__items];
      } else {
        return null;
      }
    }

    $equals(that) {
      return $rt.$$checkClassEquals(["__items"]);
    }

    debugRepresentation({
      depth: depth = 0,
      visited: visited = new Set()
    } = {}) {
      return $rt.$$showObject("Array", this, ["__items"], depth, visited);
    }

  }

  $exports.Array = Array;

  class Object {
    constructor(pairs) {
      if (!(arguments.length === 1)) throw new Error("Object.prototype.constructor takes 1 arguments, but got " + arguments.length);
      this.__pairs = pairs;
    }

    get pairs() {
      return this.__pairs;
    }

    static unapply(object) {
      if (!(arguments.length === 1)) throw new Error("Object.prototype.unapply takes 1 arguments, but got " + arguments.length);

      if (object instanceof Object) {
        return [object.__pairs];
      } else {
        return null;
      }
    }

    $equals(that) {
      return $rt.$$checkClassEquals(["__pairs"]);
    }

    debugRepresentation({
      depth: depth = 0,
      visited: visited = new Set()
    } = {}) {
      return $rt.$$showObject("Object", this, ["__pairs"], depth, visited);
    }

  }

  $exports.Object = Object;

  class Function {
    constructor(kind, parameters, body) {
      if (!(arguments.length === 3)) throw new Error("Function.prototype.constructor takes 3 arguments, but got " + arguments.length);
      this.__kind = kind;
      this.__parameters = parameters;
      this.__body = body;
    }

    get kind() {
      return this.__kind;
    }

    get parameters() {
      return this.__parameters;
    }

    get body() {
      return this.__body;
    }

    static unapply(object) {
      if (!(arguments.length === 1)) throw new Error("Function.prototype.unapply takes 1 arguments, but got " + arguments.length);

      if (object instanceof Function) {
        return [object.__kind, object.__parameters, object.__body];
      } else {
        return null;
      }
    }

    $equals(that) {
      return $rt.$$checkClassEquals(["__kind", "__parameters", "__body"]);
    }

    debugRepresentation({
      depth: depth = 0,
      visited: visited = new Set()
    } = {}) {
      return $rt.$$showObject("Function", this, ["__kind", "__parameters", "__body"], depth, visited);
    }

  }

  $exports.Function = Function;

  class Class {
    constructor(classDefinition) {
      if (!(arguments.length === 1)) throw new Error("Class.prototype.constructor takes 1 arguments, but got " + arguments.length);
      this.__classDefinition = classDefinition;
    }

    get classDefinition() {
      return this.__classDefinition;
    }

    static unapply(object) {
      if (!(arguments.length === 1)) throw new Error("Class.prototype.unapply takes 1 arguments, but got " + arguments.length);

      if (object instanceof Class) {
        return [object.__classDefinition];
      } else {
        return null;
      }
    }

    $equals(that) {
      return $rt.$$checkClassEquals(["__classDefinition"]);
    }

    debugRepresentation({
      depth: depth = 0,
      visited: visited = new Set()
    } = {}) {
      return $rt.$$showObject("Class", this, ["__classDefinition"], depth, visited);
    }

  }

  $exports.Class = Class;

  class Decorated {
    constructor(decorator, expression) {
      if (!(arguments.length === 2)) throw new Error("Decorated.prototype.constructor takes 2 arguments, but got " + arguments.length);
      this.__decorator = decorator;
      this.__expression = expression;
    }

    get decorator() {
      return this.__decorator;
    }

    get expression() {
      return this.__expression;
    }

    static unapply(object) {
      if (!(arguments.length === 1)) throw new Error("Decorated.prototype.unapply takes 1 arguments, but got " + arguments.length);

      if (object instanceof Decorated) {
        return [object.__decorator, object.__expression];
      } else {
        return null;
      }
    }

    $equals(that) {
      return $rt.$$checkClassEquals(["__decorator", "__expression"]);
    }

    debugRepresentation({
      depth: depth = 0,
      visited: visited = new Set()
    } = {}) {
      return $rt.$$showObject("Decorated", this, ["__decorator", "__expression"], depth, visited);
    }

  }

  $exports.Decorated = Decorated;
  return $exports;
})();

exports.Expression = Expression;

const Literal = (() => {
  const $exports = {};

  class String {
    constructor(value) {
      if (!(arguments.length === 1)) throw new Error("String.prototype.constructor takes 1 arguments, but got " + arguments.length);
      this.__value = value;
    }

    get value() {
      return this.__value;
    }

    static unapply(object) {
      if (!(arguments.length === 1)) throw new Error("String.prototype.unapply takes 1 arguments, but got " + arguments.length);

      if (object instanceof String) {
        return [object.__value];
      } else {
        return null;
      }
    }

    $equals(that) {
      return $rt.$$checkClassEquals(["__value"]);
    }

    debugRepresentation({
      depth: depth = 0,
      visited: visited = new Set()
    } = {}) {
      return $rt.$$showObject("String", this, ["__value"], depth, visited);
    }

  }

  $exports.String = String;

  class Boolean {
    constructor(value) {
      if (!(arguments.length === 1)) throw new Error("Boolean.prototype.constructor takes 1 arguments, but got " + arguments.length);
      this.__value = value;
    }

    get value() {
      return this.__value;
    }

    static unapply(object) {
      if (!(arguments.length === 1)) throw new Error("Boolean.prototype.unapply takes 1 arguments, but got " + arguments.length);

      if (object instanceof Boolean) {
        return [object.__value];
      } else {
        return null;
      }
    }

    $equals(that) {
      return $rt.$$checkClassEquals(["__value"]);
    }

    debugRepresentation({
      depth: depth = 0,
      visited: visited = new Set()
    } = {}) {
      return $rt.$$showObject("Boolean", this, ["__value"], depth, visited);
    }

  }

  $exports.Boolean = Boolean;

  class Decimal {
    constructor(sign, integer, decimal) {
      if (!(arguments.length === 3)) throw new Error("Decimal.prototype.constructor takes 3 arguments, but got " + arguments.length);
      this.__sign = sign;
      this.__integer = integer;
      this.__decimal = decimal;
    }

    get sign() {
      return this.__sign;
    }

    get integer() {
      return this.__integer;
    }

    get decimal() {
      return this.__decimal;
    }

    static unapply(object) {
      if (!(arguments.length === 1)) throw new Error("Decimal.prototype.unapply takes 1 arguments, but got " + arguments.length);

      if (object instanceof Decimal) {
        return [object.__sign, object.__integer, object.__decimal];
      } else {
        return null;
      }
    }

    $equals(that) {
      return $rt.$$checkClassEquals(["__sign", "__integer", "__decimal"]);
    }

    debugRepresentation({
      depth: depth = 0,
      visited: visited = new Set()
    } = {}) {
      return $rt.$$showObject("Decimal", this, ["__sign", "__integer", "__decimal"], depth, visited);
    }

  }

  $exports.Decimal = Decimal;

  class Integer {
    constructor(sign, digits) {
      if (!(arguments.length === 2)) throw new Error("Integer.prototype.constructor takes 2 arguments, but got " + arguments.length);
      this.__sign = sign;
      this.__digits = digits;
    }

    get sign() {
      return this.__sign;
    }

    get digits() {
      return this.__digits;
    }

    static unapply(object) {
      if (!(arguments.length === 1)) throw new Error("Integer.prototype.unapply takes 1 arguments, but got " + arguments.length);

      if (object instanceof Integer) {
        return [object.__sign, object.__digits];
      } else {
        return null;
      }
    }

    $equals(that) {
      return $rt.$$checkClassEquals(["__sign", "__digits"]);
    }

    debugRepresentation({
      depth: depth = 0,
      visited: visited = new Set()
    } = {}) {
      return $rt.$$showObject("Integer", this, ["__sign", "__digits"], depth, visited);
    }

  }

  $exports.Integer = Integer;

  class Null {
    constructor() {
      if (!(arguments.length === 0)) throw new Error("Null.prototype.constructor takes 0 arguments, but got " + arguments.length);
    }

    static unapply(object) {
      if (!(arguments.length === 1)) throw new Error("Null.prototype.unapply takes 1 arguments, but got " + arguments.length);

      if (object instanceof Null) {
        return [];
      } else {
        return null;
      }
    }

    $equals(that) {
      return $rt.$$checkClassEquals([]);
    }

    debugRepresentation({
      depth: depth = 0,
      visited: visited = new Set()
    } = {}) {
      return $rt.$$showObject("Null", this, [], depth, visited);
    }

  }

  $exports.Null = Null;
  return $exports;
})();

exports.Literal = Literal;

const MacroLiteral = (() => {
  const $exports = {};

  class Literal {
    constructor(literal) {
      if (!(arguments.length === 1)) throw new Error("Literal.prototype.constructor takes 1 arguments, but got " + arguments.length);
      this.__literal = literal;
    }

    get literal() {
      return this.__literal;
    }

    static unapply(object) {
      if (!(arguments.length === 1)) throw new Error("Literal.prototype.unapply takes 1 arguments, but got " + arguments.length);

      if (object instanceof Literal) {
        return [object.__literal];
      } else {
        return null;
      }
    }

    $equals(that) {
      return $rt.$$checkClassEquals(["__literal"]);
    }

    debugRepresentation({
      depth: depth = 0,
      visited: visited = new Set()
    } = {}) {
      return $rt.$$showObject("Literal", this, ["__literal"], depth, visited);
    }

  }

  $exports.Literal = Literal;

  class Array {
    constructor(items) {
      if (!(arguments.length === 1)) throw new Error("Array.prototype.constructor takes 1 arguments, but got " + arguments.length);
      this.__items = items;
    }

    get items() {
      return this.__items;
    }

    static unapply(object) {
      if (!(arguments.length === 1)) throw new Error("Array.prototype.unapply takes 1 arguments, but got " + arguments.length);

      if (object instanceof Array) {
        return [object.__items];
      } else {
        return null;
      }
    }

    $equals(that) {
      return $rt.$$checkClassEquals(["__items"]);
    }

    debugRepresentation({
      depth: depth = 0,
      visited: visited = new Set()
    } = {}) {
      return $rt.$$showObject("Array", this, ["__items"], depth, visited);
    }

  }

  $exports.Array = Array;

  class Object {
    constructor(pairs) {
      if (!(arguments.length === 1)) throw new Error("Object.prototype.constructor takes 1 arguments, but got " + arguments.length);
      this.__pairs = pairs;
    }

    get pairs() {
      return this.__pairs;
    }

    static unapply(object) {
      if (!(arguments.length === 1)) throw new Error("Object.prototype.unapply takes 1 arguments, but got " + arguments.length);

      if (object instanceof Object) {
        return [object.__pairs];
      } else {
        return null;
      }
    }

    $equals(that) {
      return $rt.$$checkClassEquals(["__pairs"]);
    }

    debugRepresentation({
      depth: depth = 0,
      visited: visited = new Set()
    } = {}) {
      return $rt.$$showObject("Object", this, ["__pairs"], depth, visited);
    }

  }

  $exports.Object = Object;
  return $exports;
})();

exports.MacroLiteral = MacroLiteral;

const Sign = (() => {
  const $exports = {};

  class Positive {
    constructor() {
      if (!(arguments.length === 0)) throw new Error("Positive.prototype.constructor takes 0 arguments, but got " + arguments.length);
    }

    static unapply(object) {
      if (!(arguments.length === 1)) throw new Error("Positive.prototype.unapply takes 1 arguments, but got " + arguments.length);

      if (object instanceof Positive) {
        return [];
      } else {
        return null;
      }
    }

    $equals(that) {
      return $rt.$$checkClassEquals([]);
    }

    debugRepresentation({
      depth: depth = 0,
      visited: visited = new Set()
    } = {}) {
      return $rt.$$showObject("Positive", this, [], depth, visited);
    }

  }

  $exports.Positive = Positive;

  class Negative {
    constructor() {
      if (!(arguments.length === 0)) throw new Error("Negative.prototype.constructor takes 0 arguments, but got " + arguments.length);
    }

    static unapply(object) {
      if (!(arguments.length === 1)) throw new Error("Negative.prototype.unapply takes 1 arguments, but got " + arguments.length);

      if (object instanceof Negative) {
        return [];
      } else {
        return null;
      }
    }

    $equals(that) {
      return $rt.$$checkClassEquals([]);
    }

    debugRepresentation({
      depth: depth = 0,
      visited: visited = new Set()
    } = {}) {
      return $rt.$$showObject("Negative", this, [], depth, visited);
    }

  }

  $exports.Negative = Negative;

  class Unsigned {
    constructor() {
      if (!(arguments.length === 0)) throw new Error("Unsigned.prototype.constructor takes 0 arguments, but got " + arguments.length);
    }

    static unapply(object) {
      if (!(arguments.length === 1)) throw new Error("Unsigned.prototype.unapply takes 1 arguments, but got " + arguments.length);

      if (object instanceof Unsigned) {
        return [];
      } else {
        return null;
      }
    }

    $equals(that) {
      return $rt.$$checkClassEquals([]);
    }

    debugRepresentation({
      depth: depth = 0,
      visited: visited = new Set()
    } = {}) {
      return $rt.$$showObject("Unsigned", this, [], depth, visited);
    }

  }

  $exports.Unsigned = Unsigned;
  return $exports;
})();

exports.Sign = Sign;

const SequenceItem = (() => {
  const $exports = {};

  class Spread {
    constructor(expression) {
      if (!(arguments.length === 1)) throw new Error("Spread.prototype.constructor takes 1 arguments, but got " + arguments.length);
      this.__expression = expression;
    }

    get expression() {
      return this.__expression;
    }

    static unapply(object) {
      if (!(arguments.length === 1)) throw new Error("Spread.prototype.unapply takes 1 arguments, but got " + arguments.length);

      if (object instanceof Spread) {
        return [object.__expression];
      } else {
        return null;
      }
    }

    $equals(that) {
      return $rt.$$checkClassEquals(["__expression"]);
    }

    debugRepresentation({
      depth: depth = 0,
      visited: visited = new Set()
    } = {}) {
      return $rt.$$showObject("Spread", this, ["__expression"], depth, visited);
    }

  }

  $exports.Spread = Spread;

  class Element {
    constructor(expression) {
      if (!(arguments.length === 1)) throw new Error("Element.prototype.constructor takes 1 arguments, but got " + arguments.length);
      this.__expression = expression;
    }

    get expression() {
      return this.__expression;
    }

    static unapply(object) {
      if (!(arguments.length === 1)) throw new Error("Element.prototype.unapply takes 1 arguments, but got " + arguments.length);

      if (object instanceof Element) {
        return [object.__expression];
      } else {
        return null;
      }
    }

    $equals(that) {
      return $rt.$$checkClassEquals(["__expression"]);
    }

    debugRepresentation({
      depth: depth = 0,
      visited: visited = new Set()
    } = {}) {
      return $rt.$$showObject("Element", this, ["__expression"], depth, visited);
    }

  }

  $exports.Element = Element;
  return $exports;
})();

exports.SequenceItem = SequenceItem;

const FunctionBody = (() => {
  const $exports = {};

  class Expression {
    constructor(expression) {
      if (!(arguments.length === 1)) throw new Error("Expression.prototype.constructor takes 1 arguments, but got " + arguments.length);
      this.__expression = expression;
    }

    get expression() {
      return this.__expression;
    }

    static unapply(object) {
      if (!(arguments.length === 1)) throw new Error("Expression.prototype.unapply takes 1 arguments, but got " + arguments.length);

      if (object instanceof Expression) {
        return [object.__expression];
      } else {
        return null;
      }
    }

    $equals(that) {
      return $rt.$$checkClassEquals(["__expression"]);
    }

    debugRepresentation({
      depth: depth = 0,
      visited: visited = new Set()
    } = {}) {
      return $rt.$$showObject("Expression", this, ["__expression"], depth, visited);
    }

  }

  $exports.Expression = Expression;

  class Block {
    constructor(statements) {
      if (!(arguments.length === 1)) throw new Error("Block.prototype.constructor takes 1 arguments, but got " + arguments.length);
      this.__statements = statements;
    }

    get statements() {
      return this.__statements;
    }

    static unapply(object) {
      if (!(arguments.length === 1)) throw new Error("Block.prototype.unapply takes 1 arguments, but got " + arguments.length);

      if (object instanceof Block) {
        return [object.__statements];
      } else {
        return null;
      }
    }

    $equals(that) {
      return $rt.$$checkClassEquals(["__statements"]);
    }

    debugRepresentation({
      depth: depth = 0,
      visited: visited = new Set()
    } = {}) {
      return $rt.$$showObject("Block", this, ["__statements"], depth, visited);
    }

  }

  $exports.Block = Block;
  return $exports;
})();

exports.FunctionBody = FunctionBody;

const MatchCase = (() => {
  const $exports = {};

  class When {
    constructor(pattern, predicate, body) {
      if (!(arguments.length === 3)) throw new Error("When.prototype.constructor takes 3 arguments, but got " + arguments.length);
      this.__pattern = pattern;
      this.__predicate = predicate;
      this.__body = body;
    }

    get pattern() {
      return this.__pattern;
    }

    get predicate() {
      return this.__predicate;
    }

    get body() {
      return this.__body;
    }

    static unapply(object) {
      if (!(arguments.length === 1)) throw new Error("When.prototype.unapply takes 1 arguments, but got " + arguments.length);

      if (object instanceof When) {
        return [object.__pattern, object.__predicate, object.__body];
      } else {
        return null;
      }
    }

    $equals(that) {
      return $rt.$$checkClassEquals(["__pattern", "__predicate", "__body"]);
    }

    debugRepresentation({
      depth: depth = 0,
      visited: visited = new Set()
    } = {}) {
      return $rt.$$showObject("When", this, ["__pattern", "__predicate", "__body"], depth, visited);
    }

  }

  $exports.When = When;

  class Case {
    constructor(pattern, body) {
      if (!(arguments.length === 2)) throw new Error("Case.prototype.constructor takes 2 arguments, but got " + arguments.length);
      this.__pattern = pattern;
      this.__body = body;
    }

    get pattern() {
      return this.__pattern;
    }

    get body() {
      return this.__body;
    }

    static unapply(object) {
      if (!(arguments.length === 1)) throw new Error("Case.prototype.unapply takes 1 arguments, but got " + arguments.length);

      if (object instanceof Case) {
        return [object.__pattern, object.__body];
      } else {
        return null;
      }
    }

    $equals(that) {
      return $rt.$$checkClassEquals(["__pattern", "__body"]);
    }

    debugRepresentation({
      depth: depth = 0,
      visited: visited = new Set()
    } = {}) {
      return $rt.$$showObject("Case", this, ["__pattern", "__body"], depth, visited);
    }

  }

  $exports.Case = Case;

  class Default {
    constructor(body) {
      if (!(arguments.length === 1)) throw new Error("Default.prototype.constructor takes 1 arguments, but got " + arguments.length);
      this.__body = body;
    }

    get body() {
      return this.__body;
    }

    static unapply(object) {
      if (!(arguments.length === 1)) throw new Error("Default.prototype.unapply takes 1 arguments, but got " + arguments.length);

      if (object instanceof Default) {
        return [object.__body];
      } else {
        return null;
      }
    }

    $equals(that) {
      return $rt.$$checkClassEquals(["__body"]);
    }

    debugRepresentation({
      depth: depth = 0,
      visited: visited = new Set()
    } = {}) {
      return $rt.$$showObject("Default", this, ["__body"], depth, visited);
    }

  }

  $exports.Default = Default;
  return $exports;
})();

exports.MatchCase = MatchCase;

const Pattern = (() => {
  const $exports = {};

  class Literal {
    constructor(literal) {
      if (!(arguments.length === 1)) throw new Error("Literal.prototype.constructor takes 1 arguments, but got " + arguments.length);
      this.__literal = literal;
    }

    get literal() {
      return this.__literal;
    }

    static unapply(object) {
      if (!(arguments.length === 1)) throw new Error("Literal.prototype.unapply takes 1 arguments, but got " + arguments.length);

      if (object instanceof Literal) {
        return [object.__literal];
      } else {
        return null;
      }
    }

    $equals(that) {
      return $rt.$$checkClassEquals(["__literal"]);
    }

    debugRepresentation({
      depth: depth = 0,
      visited: visited = new Set()
    } = {}) {
      return $rt.$$showObject("Literal", this, ["__literal"], depth, visited);
    }

  }

  $exports.Literal = Literal;

  class Array {
    constructor(items) {
      if (!(arguments.length === 1)) throw new Error("Array.prototype.constructor takes 1 arguments, but got " + arguments.length);
      this.__items = items;
    }

    get items() {
      return this.__items;
    }

    static unapply(object) {
      if (!(arguments.length === 1)) throw new Error("Array.prototype.unapply takes 1 arguments, but got " + arguments.length);

      if (object instanceof Array) {
        return [object.__items];
      } else {
        return null;
      }
    }

    $equals(that) {
      return $rt.$$checkClassEquals(["__items"]);
    }

    debugRepresentation({
      depth: depth = 0,
      visited: visited = new Set()
    } = {}) {
      return $rt.$$showObject("Array", this, ["__items"], depth, visited);
    }

  }

  $exports.Array = Array;

  class Object {
    constructor(pairs) {
      if (!(arguments.length === 1)) throw new Error("Object.prototype.constructor takes 1 arguments, but got " + arguments.length);
      this.__pairs = pairs;
    }

    get pairs() {
      return this.__pairs;
    }

    static unapply(object) {
      if (!(arguments.length === 1)) throw new Error("Object.prototype.unapply takes 1 arguments, but got " + arguments.length);

      if (object instanceof Object) {
        return [object.__pairs];
      } else {
        return null;
      }
    }

    $equals(that) {
      return $rt.$$checkClassEquals(["__pairs"]);
    }

    debugRepresentation({
      depth: depth = 0,
      visited: visited = new Set()
    } = {}) {
      return $rt.$$showObject("Object", this, ["__pairs"], depth, visited);
    }

  }

  $exports.Object = Object;

  class Extractor {
    constructor(object, patterns) {
      if (!(arguments.length === 2)) throw new Error("Extractor.prototype.constructor takes 2 arguments, but got " + arguments.length);
      this.__object = object;
      this.__patterns = patterns;
    }

    get object() {
      return this.__object;
    }

    get patterns() {
      return this.__patterns;
    }

    static unapply(object) {
      if (!(arguments.length === 1)) throw new Error("Extractor.prototype.unapply takes 1 arguments, but got " + arguments.length);

      if (object instanceof Extractor) {
        return [object.__object, object.__patterns];
      } else {
        return null;
      }
    }

    $equals(that) {
      return $rt.$$checkClassEquals(["__object", "__patterns"]);
    }

    debugRepresentation({
      depth: depth = 0,
      visited: visited = new Set()
    } = {}) {
      return $rt.$$showObject("Extractor", this, ["__object", "__patterns"], depth, visited);
    }

  }

  $exports.Extractor = Extractor;

  class Bind {
    constructor(name) {
      if (!(arguments.length === 1)) throw new Error("Bind.prototype.constructor takes 1 arguments, but got " + arguments.length);
      this.__name = name;
    }

    get name() {
      return this.__name;
    }

    static unapply(object) {
      if (!(arguments.length === 1)) throw new Error("Bind.prototype.unapply takes 1 arguments, but got " + arguments.length);

      if (object instanceof Bind) {
        return [object.__name];
      } else {
        return null;
      }
    }

    $equals(that) {
      return $rt.$$checkClassEquals(["__name"]);
    }

    debugRepresentation({
      depth: depth = 0,
      visited: visited = new Set()
    } = {}) {
      return $rt.$$showObject("Bind", this, ["__name"], depth, visited);
    }

  }

  $exports.Bind = Bind;
  return $exports;
})();

exports.Pattern = Pattern;

const ArrayPattern = (() => {
  const $exports = {};

  class Spread {
    constructor(items, spread) {
      if (!(arguments.length === 2)) throw new Error("Spread.prototype.constructor takes 2 arguments, but got " + arguments.length);
      this.__items = items;
      this.__spread = spread;
    }

    get items() {
      return this.__items;
    }

    get spread() {
      return this.__spread;
    }

    static unapply(object) {
      if (!(arguments.length === 1)) throw new Error("Spread.prototype.unapply takes 1 arguments, but got " + arguments.length);

      if (object instanceof Spread) {
        return [object.__items, object.__spread];
      } else {
        return null;
      }
    }

    $equals(that) {
      return $rt.$$checkClassEquals(["__items", "__spread"]);
    }

    debugRepresentation({
      depth: depth = 0,
      visited: visited = new Set()
    } = {}) {
      return $rt.$$showObject("Spread", this, ["__items", "__spread"], depth, visited);
    }

  }

  $exports.Spread = Spread;

  class Fixed {
    constructor(items) {
      if (!(arguments.length === 1)) throw new Error("Fixed.prototype.constructor takes 1 arguments, but got " + arguments.length);
      this.__items = items;
    }

    get items() {
      return this.__items;
    }

    static unapply(object) {
      if (!(arguments.length === 1)) throw new Error("Fixed.prototype.unapply takes 1 arguments, but got " + arguments.length);

      if (object instanceof Fixed) {
        return [object.__items];
      } else {
        return null;
      }
    }

    $equals(that) {
      return $rt.$$checkClassEquals(["__items"]);
    }

    debugRepresentation({
      depth: depth = 0,
      visited: visited = new Set()
    } = {}) {
      return $rt.$$showObject("Fixed", this, ["__items"], depth, visited);
    }

  }

  $exports.Fixed = Fixed;
  return $exports;
})();

exports.ArrayPattern = ArrayPattern;

const MemberKind = (() => {
  const $exports = {};

  class Static {
    constructor() {
      if (!(arguments.length === 0)) throw new Error("Static.prototype.constructor takes 0 arguments, but got " + arguments.length);
    }

    static unapply(object) {
      if (!(arguments.length === 1)) throw new Error("Static.prototype.unapply takes 1 arguments, but got " + arguments.length);

      if (object instanceof Static) {
        return [];
      } else {
        return null;
      }
    }

    $equals(that) {
      return $rt.$$checkClassEquals([]);
    }

    debugRepresentation({
      depth: depth = 0,
      visited: visited = new Set()
    } = {}) {
      return $rt.$$showObject("Static", this, [], depth, visited);
    }

  }

  $exports.Static = Static;

  class Instance {
    constructor() {
      if (!(arguments.length === 0)) throw new Error("Instance.prototype.constructor takes 0 arguments, but got " + arguments.length);
    }

    static unapply(object) {
      if (!(arguments.length === 1)) throw new Error("Instance.prototype.unapply takes 1 arguments, but got " + arguments.length);

      if (object instanceof Instance) {
        return [];
      } else {
        return null;
      }
    }

    $equals(that) {
      return $rt.$$checkClassEquals([]);
    }

    debugRepresentation({
      depth: depth = 0,
      visited: visited = new Set()
    } = {}) {
      return $rt.$$showObject("Instance", this, [], depth, visited);
    }

  }

  $exports.Instance = Instance;
  return $exports;
})();

exports.MemberKind = MemberKind;

const MemberDeclaration = (() => {
  const $exports = {};

  class Method {
    constructor(kind, self, name, parameters, body) {
      if (!(arguments.length === 5)) throw new Error("Method.prototype.constructor takes 5 arguments, but got " + arguments.length);
      this.__kind = kind;
      this.__self = self;
      this.__name = name;
      this.__parameters = parameters;
      this.__body = body;
    }

    get kind() {
      return this.__kind;
    }

    get self() {
      return this.__self;
    }

    get name() {
      return this.__name;
    }

    get parameters() {
      return this.__parameters;
    }

    get body() {
      return this.__body;
    }

    static unapply(object) {
      if (!(arguments.length === 1)) throw new Error("Method.prototype.unapply takes 1 arguments, but got " + arguments.length);

      if (object instanceof Method) {
        return [object.__kind, object.__self, object.__name, object.__parameters, object.__body];
      } else {
        return null;
      }
    }

    $equals(that) {
      return $rt.$$checkClassEquals(["__kind", "__self", "__name", "__parameters", "__body"]);
    }

    debugRepresentation({
      depth: depth = 0,
      visited: visited = new Set()
    } = {}) {
      return $rt.$$showObject("Method", this, ["__kind", "__self", "__name", "__parameters", "__body"], depth, visited);
    }

  }

  $exports.Method = Method;

  class Setter {
    constructor(self, name, parameter, body) {
      if (!(arguments.length === 4)) throw new Error("Setter.prototype.constructor takes 4 arguments, but got " + arguments.length);
      this.__self = self;
      this.__name = name;
      this.__parameter = parameter;
      this.__body = body;
    }

    get self() {
      return this.__self;
    }

    get name() {
      return this.__name;
    }

    get parameter() {
      return this.__parameter;
    }

    get body() {
      return this.__body;
    }

    static unapply(object) {
      if (!(arguments.length === 1)) throw new Error("Setter.prototype.unapply takes 1 arguments, but got " + arguments.length);

      if (object instanceof Setter) {
        return [object.__self, object.__name, object.__parameter, object.__body];
      } else {
        return null;
      }
    }

    $equals(that) {
      return $rt.$$checkClassEquals(["__self", "__name", "__parameter", "__body"]);
    }

    debugRepresentation({
      depth: depth = 0,
      visited: visited = new Set()
    } = {}) {
      return $rt.$$showObject("Setter", this, ["__self", "__name", "__parameter", "__body"], depth, visited);
    }

  }

  $exports.Setter = Setter;

  class Getter {
    constructor(self, name, body) {
      if (!(arguments.length === 3)) throw new Error("Getter.prototype.constructor takes 3 arguments, but got " + arguments.length);
      this.__self = self;
      this.__name = name;
      this.__body = body;
    }

    get self() {
      return this.__self;
    }

    get name() {
      return this.__name;
    }

    get body() {
      return this.__body;
    }

    static unapply(object) {
      if (!(arguments.length === 1)) throw new Error("Getter.prototype.unapply takes 1 arguments, but got " + arguments.length);

      if (object instanceof Getter) {
        return [object.__self, object.__name, object.__body];
      } else {
        return null;
      }
    }

    $equals(that) {
      return $rt.$$checkClassEquals(["__self", "__name", "__body"]);
    }

    debugRepresentation({
      depth: depth = 0,
      visited: visited = new Set()
    } = {}) {
      return $rt.$$showObject("Getter", this, ["__self", "__name", "__body"], depth, visited);
    }

  }

  $exports.Getter = Getter;

  class AtPut {
    constructor(self, key, value, body) {
      if (!(arguments.length === 4)) throw new Error("AtPut.prototype.constructor takes 4 arguments, but got " + arguments.length);
      this.__self = self;
      this.__key = key;
      this.__value = value;
      this.__body = body;
    }

    get self() {
      return this.__self;
    }

    get key() {
      return this.__key;
    }

    get value() {
      return this.__value;
    }

    get body() {
      return this.__body;
    }

    static unapply(object) {
      if (!(arguments.length === 1)) throw new Error("AtPut.prototype.unapply takes 1 arguments, but got " + arguments.length);

      if (object instanceof AtPut) {
        return [object.__self, object.__key, object.__value, object.__body];
      } else {
        return null;
      }
    }

    $equals(that) {
      return $rt.$$checkClassEquals(["__self", "__key", "__value", "__body"]);
    }

    debugRepresentation({
      depth: depth = 0,
      visited: visited = new Set()
    } = {}) {
      return $rt.$$showObject("AtPut", this, ["__self", "__key", "__value", "__body"], depth, visited);
    }

  }

  $exports.AtPut = AtPut;

  class At {
    constructor(self, key, body) {
      if (!(arguments.length === 3)) throw new Error("At.prototype.constructor takes 3 arguments, but got " + arguments.length);
      this.__self = self;
      this.__key = key;
      this.__body = body;
    }

    get self() {
      return this.__self;
    }

    get key() {
      return this.__key;
    }

    get body() {
      return this.__body;
    }

    static unapply(object) {
      if (!(arguments.length === 1)) throw new Error("At.prototype.unapply takes 1 arguments, but got " + arguments.length);

      if (object instanceof At) {
        return [object.__self, object.__key, object.__body];
      } else {
        return null;
      }
    }

    $equals(that) {
      return $rt.$$checkClassEquals(["__self", "__key", "__body"]);
    }

    debugRepresentation({
      depth: depth = 0,
      visited: visited = new Set()
    } = {}) {
      return $rt.$$showObject("At", this, ["__self", "__key", "__body"], depth, visited);
    }

  }

  $exports.At = At;

  class In {
    constructor(self, value, body) {
      if (!(arguments.length === 3)) throw new Error("In.prototype.constructor takes 3 arguments, but got " + arguments.length);
      this.__self = self;
      this.__value = value;
      this.__body = body;
    }

    get self() {
      return this.__self;
    }

    get value() {
      return this.__value;
    }

    get body() {
      return this.__body;
    }

    static unapply(object) {
      if (!(arguments.length === 1)) throw new Error("In.prototype.unapply takes 1 arguments, but got " + arguments.length);

      if (object instanceof In) {
        return [object.__self, object.__value, object.__body];
      } else {
        return null;
      }
    }

    $equals(that) {
      return $rt.$$checkClassEquals(["__self", "__value", "__body"]);
    }

    debugRepresentation({
      depth: depth = 0,
      visited: visited = new Set()
    } = {}) {
      return $rt.$$showObject("In", this, ["__self", "__value", "__body"], depth, visited);
    }

  }

  $exports.In = In;

  class Binary {
    constructor(self, operator, right, body) {
      if (!(arguments.length === 4)) throw new Error("Binary.prototype.constructor takes 4 arguments, but got " + arguments.length);
      this.__self = self;
      this.__operator = operator;
      this.__right = right;
      this.__body = body;
    }

    get self() {
      return this.__self;
    }

    get operator() {
      return this.__operator;
    }

    get right() {
      return this.__right;
    }

    get body() {
      return this.__body;
    }

    static unapply(object) {
      if (!(arguments.length === 1)) throw new Error("Binary.prototype.unapply takes 1 arguments, but got " + arguments.length);

      if (object instanceof Binary) {
        return [object.__self, object.__operator, object.__right, object.__body];
      } else {
        return null;
      }
    }

    $equals(that) {
      return $rt.$$checkClassEquals(["__self", "__operator", "__right", "__body"]);
    }

    debugRepresentation({
      depth: depth = 0,
      visited: visited = new Set()
    } = {}) {
      return $rt.$$showObject("Binary", this, ["__self", "__operator", "__right", "__body"], depth, visited);
    }

  }

  $exports.Binary = Binary;

  class Unary {
    constructor(self, operator, body) {
      if (!(arguments.length === 3)) throw new Error("Unary.prototype.constructor takes 3 arguments, but got " + arguments.length);
      this.__self = self;
      this.__operator = operator;
      this.__body = body;
    }

    get self() {
      return this.__self;
    }

    get operator() {
      return this.__operator;
    }

    get body() {
      return this.__body;
    }

    static unapply(object) {
      if (!(arguments.length === 1)) throw new Error("Unary.prototype.unapply takes 1 arguments, but got " + arguments.length);

      if (object instanceof Unary) {
        return [object.__self, object.__operator, object.__body];
      } else {
        return null;
      }
    }

    $equals(that) {
      return $rt.$$checkClassEquals(["__self", "__operator", "__body"]);
    }

    debugRepresentation({
      depth: depth = 0,
      visited: visited = new Set()
    } = {}) {
      return $rt.$$showObject("Unary", this, ["__self", "__operator", "__body"], depth, visited);
    }

  }

  $exports.Unary = Unary;
  return $exports;
})();

exports.MemberDeclaration = MemberDeclaration;

const ModuleDeclaration = (() => {
  const $exports = {};

  class Definition {
    constructor(definition) {
      if (!(arguments.length === 1)) throw new Error("Definition.prototype.constructor takes 1 arguments, but got " + arguments.length);
      this.__definition = definition;
    }

    get definition() {
      return this.__definition;
    }

    static unapply(object) {
      if (!(arguments.length === 1)) throw new Error("Definition.prototype.unapply takes 1 arguments, but got " + arguments.length);

      if (object instanceof Definition) {
        return [object.__definition];
      } else {
        return null;
      }
    }

    $equals(that) {
      return $rt.$$checkClassEquals(["__definition"]);
    }

    debugRepresentation({
      depth: depth = 0,
      visited: visited = new Set()
    } = {}) {
      return $rt.$$showObject("Definition", this, ["__definition"], depth, visited);
    }

  }

  $exports.Definition = Definition;

  class Statement {
    constructor(statement) {
      if (!(arguments.length === 1)) throw new Error("Statement.prototype.constructor takes 1 arguments, but got " + arguments.length);
      this.__statement = statement;
    }

    get statement() {
      return this.__statement;
    }

    static unapply(object) {
      if (!(arguments.length === 1)) throw new Error("Statement.prototype.unapply takes 1 arguments, but got " + arguments.length);

      if (object instanceof Statement) {
        return [object.__statement];
      } else {
        return null;
      }
    }

    $equals(that) {
      return $rt.$$checkClassEquals(["__statement"]);
    }

    debugRepresentation({
      depth: depth = 0,
      visited: visited = new Set()
    } = {}) {
      return $rt.$$showObject("Statement", this, ["__statement"], depth, visited);
    }

  }

  $exports.Statement = Statement;
  return $exports;
})();

exports.ModuleDeclaration = ModuleDeclaration;

const Parameters = (() => {
  const $exports = {};

  class Spread {
    constructor(positional, spread) {
      if (!(arguments.length === 2)) throw new Error("Spread.prototype.constructor takes 2 arguments, but got " + arguments.length);
      this.__positional = positional;
      this.__spread = spread;
    }

    get positional() {
      return this.__positional;
    }

    get spread() {
      return this.__spread;
    }

    static unapply(object) {
      if (!(arguments.length === 1)) throw new Error("Spread.prototype.unapply takes 1 arguments, but got " + arguments.length);

      if (object instanceof Spread) {
        return [object.__positional, object.__spread];
      } else {
        return null;
      }
    }

    $equals(that) {
      return $rt.$$checkClassEquals(["__positional", "__spread"]);
    }

    debugRepresentation({
      depth: depth = 0,
      visited: visited = new Set()
    } = {}) {
      return $rt.$$showObject("Spread", this, ["__positional", "__spread"], depth, visited);
    }

  }

  $exports.Spread = Spread;

  class Regular {
    constructor(positional, named) {
      if (!(arguments.length === 2)) throw new Error("Regular.prototype.constructor takes 2 arguments, but got " + arguments.length);
      this.__positional = positional;
      this.__named = named;
    }

    get positional() {
      return this.__positional;
    }

    get named() {
      return this.__named;
    }

    static unapply(object) {
      if (!(arguments.length === 1)) throw new Error("Regular.prototype.unapply takes 1 arguments, but got " + arguments.length);

      if (object instanceof Regular) {
        return [object.__positional, object.__named];
      } else {
        return null;
      }
    }

    $equals(that) {
      return $rt.$$checkClassEquals(["__positional", "__named"]);
    }

    debugRepresentation({
      depth: depth = 0,
      visited: visited = new Set()
    } = {}) {
      return $rt.$$showObject("Regular", this, ["__positional", "__named"], depth, visited);
    }

  }

  $exports.Regular = Regular;
  return $exports;
})();

exports.Parameters = Parameters;

const Argument = (() => {
  const $exports = {};

  class Positional {
    constructor(expression) {
      if (!(arguments.length === 1)) throw new Error("Positional.prototype.constructor takes 1 arguments, but got " + arguments.length);
      this.__expression = expression;
    }

    get expression() {
      return this.__expression;
    }

    static unapply(object) {
      if (!(arguments.length === 1)) throw new Error("Positional.prototype.unapply takes 1 arguments, but got " + arguments.length);

      if (object instanceof Positional) {
        return [object.__expression];
      } else {
        return null;
      }
    }

    $equals(that) {
      return $rt.$$checkClassEquals(["__expression"]);
    }

    debugRepresentation({
      depth: depth = 0,
      visited: visited = new Set()
    } = {}) {
      return $rt.$$showObject("Positional", this, ["__expression"], depth, visited);
    }

  }

  $exports.Positional = Positional;

  class Named {
    constructor(name, expression) {
      if (!(arguments.length === 2)) throw new Error("Named.prototype.constructor takes 2 arguments, but got " + arguments.length);
      this.__name = name;
      this.__expression = expression;
    }

    get name() {
      return this.__name;
    }

    get expression() {
      return this.__expression;
    }

    static unapply(object) {
      if (!(arguments.length === 1)) throw new Error("Named.prototype.unapply takes 1 arguments, but got " + arguments.length);

      if (object instanceof Named) {
        return [object.__name, object.__expression];
      } else {
        return null;
      }
    }

    $equals(that) {
      return $rt.$$checkClassEquals(["__name", "__expression"]);
    }

    debugRepresentation({
      depth: depth = 0,
      visited: visited = new Set()
    } = {}) {
      return $rt.$$showObject("Named", this, ["__name", "__expression"], depth, visited);
    }

  }

  $exports.Named = Named;

  class Spread {
    constructor(expression) {
      if (!(arguments.length === 1)) throw new Error("Spread.prototype.constructor takes 1 arguments, but got " + arguments.length);
      this.__expression = expression;
    }

    get expression() {
      return this.__expression;
    }

    static unapply(object) {
      if (!(arguments.length === 1)) throw new Error("Spread.prototype.unapply takes 1 arguments, but got " + arguments.length);

      if (object instanceof Spread) {
        return [object.__expression];
      } else {
        return null;
      }
    }

    $equals(that) {
      return $rt.$$checkClassEquals(["__expression"]);
    }

    debugRepresentation({
      depth: depth = 0,
      visited: visited = new Set()
    } = {}) {
      return $rt.$$showObject("Spread", this, ["__expression"], depth, visited);
    }

  }

  $exports.Spread = Spread;
  return $exports;
})();

exports.Argument = Argument;

const FunctionKind = (() => {
  const $exports = {};

  class Regular {
    constructor() {
      if (!(arguments.length === 0)) throw new Error("Regular.prototype.constructor takes 0 arguments, but got " + arguments.length);
    }

    static unapply(object) {
      if (!(arguments.length === 1)) throw new Error("Regular.prototype.unapply takes 1 arguments, but got " + arguments.length);

      if (object instanceof Regular) {
        return [];
      } else {
        return null;
      }
    }

    $equals(that) {
      return $rt.$$checkClassEquals([]);
    }

    debugRepresentation({
      depth: depth = 0,
      visited: visited = new Set()
    } = {}) {
      return $rt.$$showObject("Regular", this, [], depth, visited);
    }

  }

  $exports.Regular = Regular;

  class Generator {
    constructor() {
      if (!(arguments.length === 0)) throw new Error("Generator.prototype.constructor takes 0 arguments, but got " + arguments.length);
    }

    static unapply(object) {
      if (!(arguments.length === 1)) throw new Error("Generator.prototype.unapply takes 1 arguments, but got " + arguments.length);

      if (object instanceof Generator) {
        return [];
      } else {
        return null;
      }
    }

    $equals(that) {
      return $rt.$$checkClassEquals([]);
    }

    debugRepresentation({
      depth: depth = 0,
      visited: visited = new Set()
    } = {}) {
      return $rt.$$showObject("Generator", this, [], depth, visited);
    }

  }

  $exports.Generator = Generator;

  class Async {
    constructor() {
      if (!(arguments.length === 0)) throw new Error("Async.prototype.constructor takes 0 arguments, but got " + arguments.length);
    }

    static unapply(object) {
      if (!(arguments.length === 1)) throw new Error("Async.prototype.unapply takes 1 arguments, but got " + arguments.length);

      if (object instanceof Async) {
        return [];
      } else {
        return null;
      }
    }

    $equals(that) {
      return $rt.$$checkClassEquals([]);
    }

    debugRepresentation({
      depth: depth = 0,
      visited: visited = new Set()
    } = {}) {
      return $rt.$$showObject("Async", this, [], depth, visited);
    }

  }

  $exports.Async = Async;
  return $exports;
})();

exports.FunctionKind = FunctionKind;

const ImportBinding = (() => {
  const $exports = {};

  class Alias {
    constructor(name, local) {
      if (!(arguments.length === 2)) throw new Error("Alias.prototype.constructor takes 2 arguments, but got " + arguments.length);
      this.__name = name;
      this.__local = local;
    }

    get name() {
      return this.__name;
    }

    get local() {
      return this.__local;
    }

    static unapply(object) {
      if (!(arguments.length === 1)) throw new Error("Alias.prototype.unapply takes 1 arguments, but got " + arguments.length);

      if (object instanceof Alias) {
        return [object.__name, object.__local];
      } else {
        return null;
      }
    }

    $equals(that) {
      return $rt.$$checkClassEquals(["__name", "__local"]);
    }

    debugRepresentation({
      depth: depth = 0,
      visited: visited = new Set()
    } = {}) {
      return $rt.$$showObject("Alias", this, ["__name", "__local"], depth, visited);
    }

  }

  $exports.Alias = Alias;

  class Default {
    constructor(local) {
      if (!(arguments.length === 1)) throw new Error("Default.prototype.constructor takes 1 arguments, but got " + arguments.length);
      this.__local = local;
    }

    get local() {
      return this.__local;
    }

    static unapply(object) {
      if (!(arguments.length === 1)) throw new Error("Default.prototype.unapply takes 1 arguments, but got " + arguments.length);

      if (object instanceof Default) {
        return [object.__local];
      } else {
        return null;
      }
    }

    $equals(that) {
      return $rt.$$checkClassEquals(["__local"]);
    }

    debugRepresentation({
      depth: depth = 0,
      visited: visited = new Set()
    } = {}) {
      return $rt.$$showObject("Default", this, ["__local"], depth, visited);
    }

  }

  $exports.Default = Default;
  return $exports;
})();

exports.ImportBinding = ImportBinding;

const Alternate = (() => {
  const $exports = {};

  class If {
    constructor(ifStatement) {
      if (!(arguments.length === 1)) throw new Error("If.prototype.constructor takes 1 arguments, but got " + arguments.length);
      this.__ifStatement = ifStatement;
    }

    get ifStatement() {
      return this.__ifStatement;
    }

    static unapply(object) {
      if (!(arguments.length === 1)) throw new Error("If.prototype.unapply takes 1 arguments, but got " + arguments.length);

      if (object instanceof If) {
        return [object.__ifStatement];
      } else {
        return null;
      }
    }

    $equals(that) {
      return $rt.$$checkClassEquals(["__ifStatement"]);
    }

    debugRepresentation({
      depth: depth = 0,
      visited: visited = new Set()
    } = {}) {
      return $rt.$$showObject("If", this, ["__ifStatement"], depth, visited);
    }

  }

  $exports.If = If;

  class Else {
    constructor(block) {
      if (!(arguments.length === 1)) throw new Error("Else.prototype.constructor takes 1 arguments, but got " + arguments.length);
      this.__block = block;
    }

    get block() {
      return this.__block;
    }

    static unapply(object) {
      if (!(arguments.length === 1)) throw new Error("Else.prototype.unapply takes 1 arguments, but got " + arguments.length);

      if (object instanceof Else) {
        return [object.__block];
      } else {
        return null;
      }
    }

    $equals(that) {
      return $rt.$$checkClassEquals(["__block"]);
    }

    debugRepresentation({
      depth: depth = 0,
      visited: visited = new Set()
    } = {}) {
      return $rt.$$showObject("Else", this, ["__block"], depth, visited);
    }

  }

  $exports.Else = Else;
  return $exports;
})();

exports.Alternate = Alternate;
