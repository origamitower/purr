const { inspect } = require("util");
const generateJs = require("@babel/generator").default;
const template = require("@babel/template").default;
const t = require("@babel/types");

const id = x => t.identifier(x);

function flatmap(xs, f) {
  return xs.map(f).reduce((a, b) => a.concat(b), []);
}

function fixReturns(block) {
  if (block.length === 0) {
    return [];
  }

  const initial = block.slice(0, -1);
  const last = block[block.length - 1];

  switch (last.type) {
    case "ExpressionStatement":
      return [
        ...initial,
        {
          type: "ReturnStatement",
          expression: last.expression
        }
      ];

    default:
      throw new Error(`Unknown node type ${last.type}`);
  }
}

function compileModule(module) {
  return t.program(
    flatmap(module.definitions, compileDefinition),
    [],
    "module"
  );
}

function compileDefinition(node) {
  switch (node.type) {
    case "Import":
      return compileImport(node);

    case "Function":
      return compileFunction(node);

    case "Class":
      return compileClass(node);

    default:
      throw new Error(`Unknown node ${node.type}`);
  }
}

function compile(node) {
  switch (node.type) {
    case "Binding":
      return t.importSpecifier(id(node.alias), id(node.name));

    case "String":
      return t.stringLiteral(node.value);

    case "ExpressionStatement":
      return t.expressionStatement(compile(node.expression));

    // Note: this node doesn't exist in the grammar, it's added by the ReturnLast pass
    case "ReturnStatement":
      return t.returnStatement(compile(node.expression));

    case "VariableExpression":
      return t.identifier(node.name);

    case "LiteralExpression":
      return compile(node.literal);

    default:
      throw new Error(`Unknown node ${node.type}`);
  }
}

function compileImport(node) {
  switch (node.tag) {
    case "As":
      return [
        t.importDeclaration(
          [t.importNamespaceSpecifier(id(node.alias))],
          compile(node.id)
        )
      ];

    case "Exposing":
      return [
        t.importDeclaration(node.bindings.map(compile), compile(node.id))
      ];

    default:
      throw new Error(`Unknown import type ${node.tag}`);
  }
}

function compileClass(node) {
  const isData = node.tag === "Data";
  const { name, params, superclass, constructor, members } = node.declaration;

  const field = x => t.memberExpression(t.thisExpression(), id(`__${x}`));

  function compileMember(member) {
    const { type, self, name, block } = member.definition;
    const methodParams = member.definition.params;
    const functionKind = member.definition.kind;
    const methodKind =
      type === "MemberMethod"
        ? "method"
        : type === "MemberSetter"
          ? "set"
          : type === "MemberGetter"
            ? "get"
            : null;
    const realBlock = type === "MemberSetter" ? block : fixReturns(block);

    return {
      type: "ClassMethod",
      static: member.tag === "Static",
      key: id(name),
      computed: false,
      kind: methodKind,
      generator: functionKind === "generator",
      async: functionKind === "async",
      params: methodParams.map(id),
      body: t.blockStatement([
        ...unpackPrelude,
        t.variableDeclaration("const", [
          t.variableDeclarator(id(self), t.thisExpression())
        ]),
        ...realBlock.map(compile)
      ])
    };
  }

  // We always set all properties in the class
  const constructorPrelude = params.map(x => {
    return t.expressionStatement(t.assignmentExpression("=", field(x), id(x)));
  });

  const superPrelude = superclass
    ? [
        t.expressionStatement(
          t.callExpression(
            t.identifier("super"),
            superclass.params.map(compile)
          )
        )
      ]
    : [];

  const unpackPrelude = params.map(x => {
    return t.variableDeclaration("const", [
      t.variableDeclarator(id(x), field(x))
    ]);
  });

  const compiledMembers = members.map(compileMember);

  const genGetters = isData
    ? params.map(x => {
        return t.classMethod(
          "get",
          id(x),
          [],
          t.blockStatement([t.returnStatement(field(x))])
        );
      })
    : [];

  return [
    t.exportNamedDeclaration(
      t.classDeclaration(
        id(name),
        superclass ? compile(superclass.expression) : null,
        t.classBody([
          t.classMethod(
            "constructor",
            id("constructor"),
            params.map(x => id(x)),
            t.blockStatement([
              ...superPrelude,
              ...constructorPrelude,
              ...constructor.map(compile)
            ])
          ),
          ...genGetters,
          ...compiledMembers
        ])
      ),
      []
    )
  ];
}

function compileFunction(node) {
  const { name, params, kind } = node.signature;
  return [
    t.exportNamedDeclaration(
      t.functionDeclaration(
        id(name),
        params.map(x => id(x)),
        t.blockStatement(fixReturns(node.block).map(compile)),
        kind === "generator",
        kind === "async"
      ),
      []
    )
  ];
}

function generate(ast) {
  return generateJs(compileModule(ast));
}

module.exports = {
  compileModule,
  compile,
  compileDefinition,
  compileClass,
  compileFunction,
  compileImport,
  generate
};
