const ohm = require("ohm-js");
const { toAST } = require("ohm-js/extras");
const fs = require("fs");
const path = require("path");

const grammarSource = fs.readFileSync(
  path.join(__dirname, "./grammar.ohm"),
  "utf8"
);
const grammar = ohm.grammar(grammarSource);

function parse(source) {
  const match = grammar.match(source);
  if (match.failed) {
    throw new SyntaxError(match.message);
  }

  const visitor = {
    Program(_1, definitions, _2) {
      return {
        type: "Program",
        definitions: definitions.toAST(visitor)
      };
    },

    Import_as(_1, id, _2, alias) {
      return {
        type: "Import",
        tag: "As",
        id: id.toAST(visitor),
        alias: alias.toAST(visitor)
      };
    },

    Import_Exposing(_1, id, _2, bindings) {
      return {
        type: "Import",
        tag: "Exposing",
        id: id.toAST(visitor),
        bindings: bindings.toAST(visitor)
      };
    },

    Binding_aliased(name, _, alias) {
      return {
        type: "Binding",
        name: name.toAST(visitor),
        alias: alias.toAST(visitor)
      };
    },

    Binding_original(name) {
      return {
        type: "Binding",
        name: name.toAST(visitor)
      };
    },

    Function(meta, _1, signature, block) {
      return {
        type: "Function",
        meta: meta.toAST(visitor),
        signature: signature.toAST(visitor),
        block: block.toAST(visitor)
      };
    },

    FunctionSignature(type, name, params) {
      return {
        type: "FunctionSignature",
        kind: type.toAST(visitor),
        name: name.toAST(visitor),
        params: params.toAST(visitor)
      };
    },

    ParamList(_1, names, _2) {
      return names.toAST(visitor);
    },

    FunctionType_generator(_) {
      return "generator";
    },

    FunctionType_async(_) {
      return "async";
    },

    Class_data(meta, _, declarations) {
      return {
        type: "Class",
        tag: "Data",
        meta: meta.toAST(visitor),
        declaration: declarations.toAST(visitor)
      };
    },

    Class_regular(meta, declarations) {
      return {
        type: "Class",
        tag: "Regular",
        meta: meta.toAST(visitor),
        declaration: declarations.toAST(visitor)
      };
    },

    SuperClass(_, ctor) {
      return {
        type: "SuperClass",
        expression: ctor.toAST(visitor)
      };
    },

    ClassMember_static(meta, _, definition) {
      return {
        type: "ClassMember",
        tag: "Static",
        meta: meta.toAST(visitor),
        definition: definition.toAST(visitor)
      };
    },

    ClassMember_instance(meta, _, definition) {
      return {
        type: "ClassMember",
        tag: "Instance",
        meta: meta.toAST(visitor),
        definition: definition.toAST(visitor)
      };
    },

    MemberDeclaration_method(type, self, _, name, params, block) {
      return {
        type: "MemberMethod",
        kind: type.toAST(visitor),
        self: self.toAST(visitor),
        name: name.toAST(visitor),
        params: params.toAST(visitor),
        block: block.toAST(visitor)
      };
    },

    MemberDeclaration_setter(self, _1, name, _2, param, block) {
      return {
        type: "MemberSetter",
        self: self.toAST(visitor),
        name: name.toAST(visitor),
        param: param.toAST(visitor),
        block: block.toAST(visitor)
      };
    },

    MemberDeclaration_getter(self, _1, name, block) {
      return {
        type: "MemberGetter",
        self: self.toAST(visitor),
        name: name.toAST(visitor),
        block: block.toAST(visitor)
      };
    },

    String_raw(_1, characters, _2) {
      return {
        type: "String",
        value: characters.join("")
      };
    },

    String_double(_1, characters, _2) {
      return {
        type: "String",
        value: characters
          .map(x => {
            if (x.startsWith("\\")) {
              switch (x[1]) {
                case "b":
                  return "\b";
                case "f":
                  return "\f";
                case "n":
                  return "\n";
                case "r":
                  return "\r";
                case "t":
                  return "\t";
                case "u":
                  return String.fromCodePoint(parseInt(x.slice(2), 16));
              }
            } else {
              return x;
            }
          })
          .join("")
      };
    },

    Metadata(doc) {
      return {
        type: "Metadata",
        documentation: doc
          .toAST(visitor)
          .replace(/^\/\*|\*\//g, "")
          .trim()
      };
    },

    Block(_1, statements, _2) {
      return statements.toAST(visitor);
    },

    Statement_expression(expr, _) {
      return {
        type: "ExpressionStatement",
        expression: expr.toAST(visitor)
      };
    },

    Expression_variable(name) {
      return {
        type: "VariableExpression",
        name: name.toAST(visitor)
      };
    },

    Expression_literal(lit) {
      return {
        type: "LiteralExpression",
        literal: lit.toAST(visitor)
      };
    },

    Expression_group: 1
  };

  return toAST(match, visitor);
}

module.exports = { parse };
