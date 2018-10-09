const ohm = require("ohm-js");
const { toAST } = require("ohm-js/extras");
const fs = require("fs");
const path = require("path");
const { mangle, fresh } = require("./utils");
const plugins = require("./plugins");

const grammarSource = fs.readFileSync(
  path.join(__dirname, "./grammar.ohm"),
  "utf8"
);
const grammar = ohm.grammar(grammarSource);

function sliceSource(source) {
  return source.sourceString.slice(source.startIdx, source.endIdx);
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

  Import_core(_1, id, _2, bindings, _3) {
    return {
      type: "Import",
      tag: "Core",
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

  Binding_default(_1, _2, alias) {
    return {
      type: "DefaultBinding",
      name: alias.toAST(visitor)
    };
  },

  Binding_original(name) {
    return {
      type: "Binding",
      name: name.toAST(visitor),
      alias: name.toAST(visitor)
    };
  },

  Export_aliased(_1, name, _2, alias, _3) {
    return {
      type: "Export",
      tag: "Named",
      name: name.toAST(visitor),
      alias: alias.toAST(visitor)
    };
  },

  Export_original(_1, name, _2) {
    return {
      type: "Export",
      tag: "Named",
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

  FunctionBody_expr(_1, expr, _2) {
    return [{ type: "ExpressionStatement", expression: expr.toAST(visitor) }];
  },

  FunctionBody_block(block) {
    return block.toAST(visitor);
  },

  FunctionSignature(type, name, params, _contract) {
    return {
      type: "FunctionSignature",
      kind: type.toAST(visitor),
      name: name.toAST(visitor),
      params: params.toAST(visitor)
    };
  },

  ParamList_only_spread(_1, _2, spread, _3) {
    return {
      spread: spread.toAST(visitor),
      positional: [],
      named: []
    };
  },

  ParamList_pos_spread(_1, names, _2, _3, spread, _4) {
    return {
      spread: spread.toAST(visitor),
      positional: names.toAST(visitor),
      named: []
    };
  },

  ParamList_only_named(_1, pairs, _2) {
    return {
      positional: [],
      named: pairs.toAST(visitor)
    };
  },

  ParamList_pos_named(_1, names, _2, pairs, _3) {
    return {
      positional: names.toAST(visitor),
      named: pairs.toAST(visitor)
    };
  },

  ParamList_only_pos(_1, names, _2) {
    return {
      spread: null,
      positional: names.toAST(visitor),
      named: []
    };
  },

  ParamName_checked(name, _, contract) {
    return name.toAST(visitor);
  },

  ParamName_unchecked(name) {
    return name.toAST(visitor);
  },

  PParamName_checked: 1,
  PParamName_unchecked: 0,

  NamedParam_with_default(key, _1, name, _2, expr) {
    return {
      key: key.toAST(visitor),
      name: name.toAST(visitor),
      default: expr.toAST(visitor)
    };
  },

  NamedParam_no_default(key, _, name) {
    return {
      key: key.toAST(visitor),
      name: name.toAST(visitor),
      default: { type: "LiteralExpression", literal: { type: "Null" } }
    };
  },

  FunctionType_generator(_) {
    return "generator";
  },

  FunctionType_async(_) {
    return "async";
  },

  Module(meta, _1, name, _2, decl, _3) {
    return {
      type: "Module",
      meta: meta.toAST(visitor),
      name: name.toAST(visitor),
      declarations: decl.toAST(visitor)
    };
  },

  Definition_stmt(stmt) {
    return {
      type: "Statement",
      statement: stmt.toAST(visitor)
    };
  },

  Class(meta, declarations) {
    return {
      type: "Class",
      meta: meta.toAST(visitor),
      declaration: declarations.toAST(visitor)
    };
  },

  ClassDeclaration(
    type,
    _1,
    name,
    params,
    superClass,
    _2,
    fields,
    ctor,
    members,
    _3
  ) {
    return {
      type: type.toAST(visitor) || "regular",
      name: name.toAST(visitor),
      params: params.toAST(visitor) || [],
      superclass: superClass.toAST(visitor),
      fields: fields.toAST(visitor),
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

  ClassField(meta, _mutable, _1, name, contract, _2, value, _3) {
    return {
      type: "ClassField",
      mutable: _mutable.toAST(visitor) === "mutable",
      meta: meta.toAST(visitor),
      name: name.toAST(visitor),
      value: value.toAST(visitor)
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

  MemberDeclaration_method(type, self, _, name, params, contract, block) {
    return {
      type: "MemberMethod",
      kind: type.toAST(visitor),
      self: self.toAST(visitor),
      name: name.toAST(visitor),
      params: params.toAST(visitor),
      block: block.toAST(visitor)
    };
  },

  MemberDeclaration_setter(self, _1, name, _2, param, contract, block) {
    return {
      type: "MemberSetter",
      self: self.toAST(visitor),
      name: name.toAST(visitor),
      params: { positional: [param.toAST(visitor)], spread: null, named: [] },
      block: block.toAST(visitor)
    };
  },

  MemberDeclaration_getter(self, _1, name, contract, block) {
    return {
      type: "MemberGetter",
      self: self.toAST(visitor),
      name: name.toAST(visitor),
      params: { positional: [], spread: null, named: [] },
      block: block.toAST(visitor)
    };
  },

  MemberDeclaration_atput(self, _1, key, _2, _3, value, contract, block) {
    return {
      type: "MemberMethod",
      self: self.toAST(visitor),
      name: mangle("[]<-"),
      params: {
        positional: [...key.toAST(visitor), value.toAST(visitor)],
        spread: null,
        named: []
      },
      block: block.toAST(visitor)
    };
  },

  MemberDeclaration_at(self, _1, key, _2, contract, block) {
    return {
      type: "MemberMethod",
      self: self.toAST(visitor),
      name: mangle("[]"),
      params: { positional: [...key.toAST(visitor)], spread: null, named: [] },
      block: block.toAST(visitor)
    };
  },

  MemberDeclaration_in(param, _1, self, contract, block) {
    return {
      type: "MemberMethod",
      self: self.toAST(visitor),
      name: mangle("in"),
      params: { positional: [param.toAST(visitor)], spread: null, named: [] },
      block: block.toAST(visitor)
    };
  },

  MemberDeclaration_operator(self, op, arg, contract, block) {
    return {
      type: "MemberMethod",
      self: self.toAST(visitor),
      name: mangle(op.toAST(visitor)),
      params: { positional: [arg.toAST(visitor)], spread: null, named: [] },
      block: block.toAST(visitor)
    };
  },

  MemberDeclaration_not(_1, self, contract, block) {
    return {
      type: "MemberMethod",
      self: self.toAST(visitor),
      name: mangle("not"),
      params: { positional: [], spread: null, named: [] },
      block: block.toAST(visitor)
    };
  },

  MemberBlock_expr(_1, expr, _2) {
    return [{ type: "ExpressionStatement", expression: expr.toAST(visitor) }];
  },

  MemberBlock_block(block) {
    return block.toAST(visitor);
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
              case "\\":
                return "\\";
              case '"':
                return '"';
              default:
                throw new Error(`Invalid escape sequence ${x}`);
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

  LetStatement_bind(_1, mutable, name, _2, expr, _3) {
    return {
      type: "LetStatement",
      mutable: mutable.toAST(visitor) === "mutable",
      name: name.toAST(visitor),
      expression: expr.toAST(visitor)
    };
  },

  LetStatement_destructure(_1, pattern, _2, expr, _3) {
    return {
      type: "LetDestructureStatement",
      pattern: pattern.toAST(visitor),
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

  LoopStatement_foreach(_1, _2, name, _3, iterator, block) {
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

  MatchStatement(match) {
    return {
      type: "MatchStatement",
      match: match.toAST(visitor)
    };
  },

  Match(_1, value, _2, cases, _3) {
    return {
      type: "Match",
      value: value.toAST(visitor),
      cases: cases.toAST(visitor)
    };
  },

  MatchCase_case_when(_1, pattern, _2, predicate, _3, block) {
    return {
      type: "MatchCase",
      tag: "When",
      pattern: pattern.toAST(visitor),
      predicate: predicate.toAST(visitor),
      block: block.toAST(visitor)
    };
  },

  MatchCase_case(_1, pattern, _2, block) {
    return {
      type: "MatchCase",
      tag: "Case",
      pattern: pattern.toAST(visitor),
      block: block.toAST(visitor)
    };
  },

  MatchCase_default(_1, _2, block) {
    return {
      type: "MatchCase",
      tag: "Default",
      block: block.toAST(visitor)
    };
  },

  Pattern_literal(lit) {
    return {
      type: "Pattern",
      tag: "Literal",
      literal: lit.toAST(visitor)
    };
  },

  Pattern_array(_1, pattern, _2) {
    return {
      type: "Pattern",
      tag: "Array",
      pattern: pattern.toAST(visitor)
    };
  },

  Pattern_object(_1, pairs, _2) {
    return {
      type: "Pattern",
      tag: "Object",
      pairs: pairs.toAST(visitor)
    };
  },

  Pattern_extractor(object, _1, patterns, _2) {
    return {
      type: "Pattern",
      tag: "Extractor",
      object: object.toAST(visitor),
      patterns: patterns.toAST(visitor)
    };
  },

  Pattern_bind(name) {
    return {
      type: "Pattern",
      tag: "Bind",
      name: name.toAST(visitor)
    };
  },

  ArrayPattern_spread1(items, _1, _2, spread) {
    return {
      type: "ArrayPattern",
      tag: "Spread",
      items: items.toAST(visitor),
      spread: spread.toAST(visitor)
    };
  },

  ArrayPattern_spread0(_1, spread) {
    return {
      type: "ArrayPattern",
      tag: "Spread",
      items: [],
      spread: spread.toAST(visitor)
    };
  },

  ArrayPattern_regular(items) {
    return {
      type: "ArrayPattern",
      tag: "Regular",
      items: items.toAST(visitor)
    };
  },

  PairPattern(name, _, pattern) {
    return {
      name: name.toAST(visitor),
      pattern: pattern.toAST(visitor)
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

  BinaryExpression_in(arg, _, self) {
    return {
      type: "BinaryExpression",
      left: arg.toAST(visitor),
      operator: "in",
      right: self.toAST(visitor)
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
    return cont.toAST(visitor)(base.toAST(visitor));
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

  SendContinuation_assign(propNode, _, expr) {
    return base => {
      const prop = propNode.toAST(visitor)(base);
      if (prop.type === "AtExpression") {
        return {
          type: "AtPutExpression",
          object: base,
          key: prop.key,
          value: expr.toAST(visitor)
        };
      } else if (prop.type === "GetExpression") {
        return {
          type: "UpdateExpression",
          location: prop,
          value: expr.toAST(visitor)
        };
      } else {
        throw new Error(`Unknown property type ${prop.type}`);
      }
    };
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

  AssignExpression_assign(memberNode, _, value) {
    const member = memberNode.toAST(visitor);
    if (member.type === "AtExpression") {
      return {
        type: "AtPutExpression",
        object: member.object,
        key: member.key,
        value: value.toAST(visitor)
      };
    } else {
      return {
        type: "UpdateExpression",
        location: member,
        value: value.toAST(visitor)
      };
    }
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

  PrimaryExpression_class(klass) {
    return {
      type: "ClassExpression",
      class: klass.toAST(visitor)
    };
  },

  Literal_null(_) {
    return {
      type: "Null"
    };
  },

  PrimaryExpression_variable(name) {
    return {
      type: "VariableExpression",
      name: name.toAST(visitor)
    };
  },

  PrimaryExpression_plug_literal(_1, id, lit) {
    const pluginId = id.toAST(visitor);
    const plugin = plugins[pluginId];
    if (!plugin) {
      throw new Error(`The plugin ${pluginId} was not found.`);
    }

    return plugin(lit.toAST(visitor));
  },

  PrimaryExpression_literal(lit) {
    return {
      type: "LiteralExpression",
      literal: lit.toAST(visitor)
    };
  },

  PrimaryExpression_hole(_) {
    return {
      type: "HoleExpression"
    };
  },

  ArrayExpression(mutable, _1, items, _2) {
    return {
      type: "ArrayExpression",
      mutable: mutable.toAST(visitor) === "mutable",
      items: items.toAST(visitor)
    };
  },

  ArrayItem_spread(_, expr) {
    return {
      type: "Spread",
      expression: expr.toAST(visitor)
    };
  },

  ArrayItem_item(expr) {
    return {
      type: "Item",
      expression: expr.toAST(visitor)
    };
  },

  ObjectExpression(mutable, _1, pairs, _2) {
    return {
      type: "ObjectExpression",
      mutable: mutable.toAST(visitor) === "mutable",
      pairs: pairs.toAST(visitor)
    };
  },

  FunctionExpression_expr(kind, params, contract, _, expr) {
    return {
      type: "FunctionExpression",
      kind: kind.toAST(visitor),
      params: params.toAST(visitor),
      block: [{ type: "ExpressionStatement", expression: expr.toAST(visitor) }]
    };
  },

  FunctionExpression_block(kind, params, contract, _, block) {
    return {
      type: "FunctionExpression",
      kind: kind.toAST(visitor),
      params: params.toAST(visitor),
      block: block.toAST(visitor)
    };
  },

  ArgList_only_spread(_1, _2, spread, _3) {
    return {
      spread: spread.toAST(visitor),
      positional: [],
      named: []
    };
  },

  ArgList_pos_spread(_1, pos, _2, _3, spread, _4) {
    return {
      spread: spread.toAST(visitor),
      positional: pos.toAST(visitor),
      named: []
    };
  },

  ArgList_only_named(_1, pairs, _2) {
    return {
      positional: [],
      named: pairs.toAST(visitor)
    };
  },

  ArgList_pos_named(_1, pos, _2, pairs, _3) {
    return {
      positional: pos.toAST(visitor),
      named: pairs.toAST(visitor)
    };
  },

  ArgList_only_pos(_1, pos, _2) {
    return {
      spread: null,
      positional: pos.toAST(visitor),
      named: []
    };
  },

  Pair(name, _, expr) {
    return {
      name: name.toAST(visitor),
      expression: expr.toAST(visitor)
    };
  },

  Name(nameNode) {
    const name = nameNode.toAST(visitor);
    if (name === "_") {
      return fresh.next("ignore");
    } else {
      return name;
    }
  },

  QualifiedName(names) {
    return names.toAST(visitor).join(".");
  },

  Expression_group: 1
};

function parse(source) {
  const match = grammar.match(source);
  if (match.failed()) {
    throw new SyntaxError(match.message);
  }

  return toAST(match, visitor);
}

module.exports = { parse, visitor, grammar };
