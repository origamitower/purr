const ohm = require("ohm-js");
const { toAST } = require("ohm-js/extras");
const fs = require("fs");
const path = require("path");

const grammarSource = fs.readFileSync(
  path.join(__dirname, "./grammar.ohm"),
  "utf8"
);
const grammar = ohm.grammar(grammarSource);

function sliceSource(source) {
  return source.sourceString.slice(source.startIdx, source.endIdx);
}

function parse(source) {
  const match = grammar.match(source);
  if (match.failed()) {
    throw new SyntaxError(match.message);
  }

  const visitor = {
    Program(_1, definitions, _2) {
      return {
        type: "Program",
        definitions: definitions.toAST(visitor)
      };
    },

    Import_as(_1, id, _2, alias, _3) {
      return {
        type: "Import",
        tag: "As",
        id: id.toAST(visitor),
        alias: alias.toAST(visitor)
      };
    },

    Import_exposing(_1, id, _2, bindings, _3) {
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
        name: name.toAST(visitor),
        alias: name.toAST(visitor)
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

    ClassDeclaration(_1, name, params, superClass, _2, ctor, members, _3) {
      return {
        name: name.toAST(visitor),
        params: params.toAST(visitor) || [],
        superclass: superClass.toAST(visitor),
        constructor: ctor.toAST(visitor),
        members: members.toAST(visitor)
      };
    },

    SuperClass(_, ctor, params) {
      return {
        type: "SuperClass",
        constructor: ctor.toAST(visitor),
        params: params.toAST(visitor)
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
        params: [param.toAST(visitor)],
        block: block.toAST(visitor)
      };
    },

    MemberDeclaration_getter(self, _1, name, block) {
      return {
        type: "MemberGetter",
        self: self.toAST(visitor),
        name: name.toAST(visitor),
        params: [],
        block: block.toAST(visitor)
      };
    },

    String_raw(_1, characters, _2) {
      return {
        type: "String",
        value: characters.toAST(visitor).join("")
      };
    },

    String_double(_1, characters, _2) {
      return {
        type: "String",
        value: characters
          .toAST(visitor)
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
                  return String.fromCodePoint(
                    parseInt(x.slice(2).replace(/_/g, ""), 16)
                  );
              }
            } else {
              return x;
            }
          })
          .join("")
      };
    },

    Integer_negative(_, digits) {
      return {
        type: "Integer",
        sign: "-",
        digits: digits.toAST(visitor).replace(/_/g, "")
      };
    },

    Integer_positive(_, digits) {
      return {
        type: "Integer",
        sign: "+",
        digits: digits.toAST(visitor).replace(/_/g, "")
      };
    },

    Integer_unsigned(digits) {
      return {
        type: "Integer",
        digits: digits.toAST(visitor).replace(/_/g, "")
      };
    },

    Decimal_negative(_1, integer, _2, decimal) {
      return {
        type: "Decimal",
        sign: "-",
        integer: integer
          .toAST(visitor)
          .join("")
          .replace(/_/g, ""),
        decimal: decimal
          .toAST(visitor)
          .join("")
          .replace(/_/g, "")
      };
    },

    Decimal_positive(_1, integer, _2, decimal) {
      return {
        type: "Decimal",
        sign: "+",
        integer: integer
          .toAST(visitor)
          .join("")
          .replace(/_/g, ""),
        decimal: decimal
          .toAST(visitor)
          .join("")
          .replace(/_/g, "")
      };
    },

    Decimal_unsigned(integer, _, decimal) {
      return {
        type: "Decimal",
        integer: integer
          .toAST(visitor)
          .join("")
          .replace(/_/g, ""),
        decimal: decimal
          .toAST(visitor)
          .join("")
          .replace(/_/g, "")
      };
    },

    Boolean_true(_) {
      return {
        type: "Boolean",
        value: true
      };
    },

    Boolean_false(_) {
      return {
        type: "Boolean",
        value: false
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

    LetStatement(_1, mutable, name, _2, expr, _3) {
      return {
        type: "LetStatement",
        mutable: mutable === "mutable",
        name: name.toAST(visitor),
        expression: expr.toAST(visitor)
      };
    },

    AssertStatement(_1, expr, _2) {
      return {
        type: "AssertStatement",
        expression: expr.toAST(visitor),
        code: sliceSource(expr.source)
      };
    },

    LoopStatement_foreach(_1, name, _2, iterator, block) {
      return {
        type: "ForeachStatement",
        name: name.toAST(visitor),
        iterator: iterator.toAST(visitor),
        block: block.toAST(visitor)
      };
    },

    LoopStatement_while(_1, _2, predicate, block) {
      return {
        type: "WhileStatement",
        predicate: predicate.toAST(visitor),
        block: block.toAST(visitor)
      };
    },

    LoopStatement_until(_1, _2, predicate, block) {
      return {
        type: "UntilStatement",
        predicate: predicate.toAST(visitor),
        block: block.toAST(visitor)
      };
    },

    LoopStatement_for(_1, _2, name, _3, start, _4, end, block) {
      return {
        type: "ForStatement",
        name: name.toAST(visitor),
        start: start.toAST(visitor),
        end: end.toAST(visitor),
        by: {
          type: "LiteralExpression",
          literal: { type: "Integer", digits: "1" }
        },
        block: block.toAST(visitor)
      };
    },

    LoopStatement_for_by(_1, _2, name, _3, start, _4, end, _5, by, block) {
      return {
        type: "ForStatement",
        name: name.toAST(visitor),
        start: start.toAST(visitor),
        end: end.toAST(visitor),
        by: by.toAST(visitor),
        block: block.toAST(visitor)
      };
    },

    LoopStatement_repeat(_1, block) {
      return {
        type: "RepeatStatement",
        block: block.toAST(visitor)
      };
    },

    IfStatement(_1, test, block, alternate) {
      return {
        type: "IfStatement",
        test: test.toAST(visitor),
        block: block.toAST(visitor),
        alternate: alternate.toAST(visitor)
      };
    },

    AlternateStatement_elseif(_1, stmt) {
      return {
        type: "ElseIf",
        if: stmt.toAST(visitor)
      };
    },

    AlternateStatement_else(_1, block) {
      return {
        type: "Else",
        block: block.toAST(visitor)
      };
    },

    Statement_expression(expr, _) {
      return {
        type: "ExpressionStatement",
        expression: expr.toAST(visitor)
      };
    },

    IfExpression(_1, test, _2, consequent, _3, alternate) {
      return {
        type: "IfExpression",
        test: test.toAST(visitor),
        consequent: consequent.toAST(visitor),
        alternate: alternate.toAST(visitor)
      };
    },

    PipeExpression_pipe(left, _, right) {
      return {
        type: "PipeExpression",
        left: left.toAST(visitor),
        right: right.toAST(visitor)
      };
    },

    YieldAwait_await(_, expr) {
      return {
        type: "AwaitExpression",
        expression: expr.toAST(visitor)
      };
    },

    YieldAwait_yield_all(_1, _2, expr) {
      return {
        type: "YieldExpression",
        generator: true,
        expression: expr.toAST(visitor)
      };
    },

    YieldAwait_yield(_1, expr) {
      return {
        type: "YieldExpression",
        generator: false,
        expression: expr.toAST(visitor)
      };
    },

    BinaryExpression_binary(left, operator, right) {
      return {
        type: "BinaryExpression",
        left: left.toAST(visitor),
        operator: operator.toAST(visitor),
        right: right.toAST(visitor)
      };
    },

    UnaryExpression_not(_, arg) {
      return {
        type: "UnaryExpression",
        prefix: true,
        operator: "not",
        argument: arg.toAST(visitor)
      };
    },

    SendExpression_send(base, cont) {
      return cont.toAST(visitor)(base);
    },

    SendContinuation_call(params) {
      return base => ({
        type: "CallExpression",
        callee: base,
        params: params.toAST(visitor)
      });
    },

    SendContinuation_method_call(_, method, params) {
      return base => ({
        type: "MethodCallExpression",
        object: base,
        method: method.toAST(visitor),
        params: params.toAST(visitor)
      });
    },

    SendContinuation_property(prop) {
      return prop.toAST(visitor);
    },

    Property_at(_1, expr, _2) {
      return base => ({
        type: "AtExpression",
        object: base,
        key: expr.toAST(visitor)
      });
    },

    Property_get(_, name) {
      return base => ({
        type: "GetExpression",
        object: base,
        name: name.toAST(visitor)
      });
    },

    MemberExpression_member(object, prop) {
      return prop.toAST(visitor)(object.toAST(visitor));
    },

    NewExpression_new(_, object, params) {
      return {
        type: "NewExpression",
        constructor: object.toAST(visitor),
        params: params.toAST(visitor)
      };
    },

    PrimaryExpression_super(_) {
      return {
        type: "SuperExpression"
      };
    },

    PrimaryExpression_variable(name) {
      return {
        type: "VariableExpression",
        name: name.toAST(visitor)
      };
    },

    PrimaryExpression_literal(lit) {
      return {
        type: "LiteralExpression",
        literal: lit.toAST(visitor)
      };
    },

    ArrayExpression(_1, items, _2) {
      return {
        type: "ArrayExpression",
        items: items.toAST(visitor)
      };
    },

    ObjectExpression(_1, pairs, _2) {
      return {
        type: "ObjectExpression",
        pairs: pairs.toAST(visitor)
      };
    },

    FunctionExpression(kind, params, _, block) {
      return {
        type: "FunctionExpression",
        kind: kind.toAST(visitor),
        params: params.toAST(visitor),
        block: block.toAST(visitor)
      };
    },

    Pair(name, _, expr) {
      return {
        name: name.toAST(visitor),
        expression: expr.toAST(visitor)
      };
    },

    Expression_group: 1
  };

  return toAST(match, visitor);
}

module.exports = { parse };
