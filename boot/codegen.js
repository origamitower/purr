const { inspect } = require("util");
const generateJs = require("@babel/generator").default;
const template = require("@babel/template").default;
const t = require("@babel/types");

const id = x => t.identifier(x);

function flatmap(xs, f) {
  return xs.map(f).reduce((a, b) => a.concat(b), []);
}

function mangle(name) {
  switch (name) {
    case "===":
      return "origami$equals";

    case "=/=":
      return "origami$notEquals";

    case "==>":
      return "origami$imply";

    case ">=":
      return "origami$gte";

    case ">>":
      return "origami$composeRight";

    case ">":
      return "origami$gt";

    case "<=":
      return "origami$lte";

    case "<<":
      return "origami$composeLeft";

    case "<":
      return "origami$lt";

    case "++":
      return "origami$concat";

    case "+":
      return "origami$plus";

    case "-":
      return "origami$minus";

    case "**":
      return "origami$power";

    case "*":
      return "origami$multiply";

    case "/":
      return "origami$divide";

    case "and":
    case "or":
    case "not":
      return `origami$${name}`;

    case "[]":
      return `origami$at`;

    case "[]<-":
      return `origami$atPut`;

    default:
      throw new Error(`Unknown operator ${name}`);
  }
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

    case "IfStatement": {
      const fixAlternate = node => {
        switch (node.type) {
          case "ElseIf":
            return {
              type: "ElseIf",
              if: fixReturns([node.if][0])
            };

          case "Else":
            return {
              type: "Else",
              block: fixReturns(node.block)
            };

          default:
            throw new Error(`Unknown node ${node.type}`);
        }
      };

      return [
        ...initial,
        {
          type: "IfStatement",
          test: last.test,
          block: fixReturns(last.block),
          alternate: last.alternate ? fixAlternate(last.alternate) : null
        }
      ];
    }

    case "LetStatement":
    case "AssertStatement":
    case "ForeachStatement":
    case "WhileStatement":
    case "UntilStatement":
    case "ForStatement":
    case "RepeatStatement":
      return [...initial, last];

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

    case "ExpressionStatement":
      return t.expressionStatement(compile(node.expression));

    case "LetStatement":
      return t.variableDeclaration(node.mutable ? "let" : "const", [
        t.variableDeclarator(id(node.name), compile(node.expression))
      ]);

    case "AssertStatement":
      return t.ifStatement(
        t.unaryExpression("!", compile(node.expression), true),
        t.blockStatement([
          t.throwStatement(
            t.newExpression(id("Error"), [
              t.stringLiteral(`Assertion failed: ${node.code}`)
            ])
          )
        ])
      );

    case "ForeachStatement":
      return t.forOfStatement(
        id(node.name),
        compile(node.iterator),
        t.blockStatement(node.block.map(compile))
      );

    case "WhileStatement":
      return t.whileStatement(
        compile(node.predicate),
        t.blockStatement(node.block.map(compile))
      );

    case "UntilStatement":
      return t.doWhileStatement(
        compile(node.predicate),
        t.blockStatement(node.block.map(compile))
      );

    case "ForStatement":
      return t.forStatement(
        t.variableDeclaration("let", [
          t.variableDeclarator(id(node.name), compile(node.start))
        ]),
        t.binaryExpression("<=", id(node.name), compile(node.end)),
        t.assignmentExpression("+=", id(name), compile(node.by))
      );

    case "RepeatStatement":
      return t.whileStatement(
        t.booleanLiteral(true),
        t.blockStatement(node.block.map(compile))
      );

    case "IfStatement": {
      const compileIf = node => {
        return t.ifStatement(
          compile(node.test),
          t.blockStatement(node.block.map(compile)),
          alternate ? compileAlternate(alternate) : null
        );
      };
      const compileAlternate = node => {
        switch (node.type) {
          case "ElseIf":
            return compileIf(node.if);

          case "Else":
            return t.blockStatement(node.block.map(compile));

          default:
            throw new Error(`Unknown node ${node.type}`);
        }
      };

      return compileIf(node);
    }

    // Note: this node doesn't exist in the grammar, it's added by the ReturnLast pass
    case "ReturnStatement":
      return t.returnStatement(compile(node.expression));

    case "IfExpression":
      return t.conditionalExpression(
        compile(node.test),
        compile(node.consequent),
        compile(node.alternate)
      );

    case "PipeExpression":
      return t.callExpression(compile(node.right), [compile(node.left)]);

    case "AwaitExpression":
      return t.awaitExpression(compile(node.expression));

    case "YieldExpression":
      return t.yieldExpression(compile(node.expression), node.generator);

    case "BinaryExpression":
      return t.callExpression(id(mangle(node.operator)), [
        compile(node.left),
        compile(node.right)
      ]);

    case "UnaryExpression":
      return t.callExpression(id(mangle(node.operator)), [
        compile(node.argument)
      ]);

    case "CallExpression":
      return t.callExpression(compile(node.callee), node.params.map(compile));

    case "MethodCallExpression":
      return t.callExpression(
        t.memberExpression(compile(node.object), id(node.method)),
        node.params.map(compile)
      );

    case "AtExpression":
      return t.callExpression(id(mangle("[]")), [
        compile(node.object),
        compile(node.key)
      ]);

    case "GetExpression":
      return t.memberExpression(compile(node.object), id(node.name));

    case "NewExpression":
      return t.newExpression(
        compile(node.constructor),
        node.params.map(compile)
      );

    case "SuperExpression":
      return id("super");

    case "VariableExpression":
      return t.identifier(node.name);

    case "LiteralExpression":
      return compile(node.literal);

    case "ArrayExpression":
      return t.arrayExpression(node.items.map(compile));

    case "ObjectExpression":
      return t.objectExpression(
        node.pairs.map(({ key, expression }) => {
          return t.objectProperty(id(key), compile(expression));
        })
      );

    case "FunctionExpression": {
      if (node.kind === "generator") {
        return t.functionExpression(
          null,
          node.params.map(id),
          fixReturns(node.block).map(compile),
          true
        );
      } else {
        return t.arrowFunctionExpression(
          params.map(id),
          fixReturns(node.block).map(compile),
          node.kind === "async"
        );
      }
    }

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
        superclass ? compile(superclass.constructor) : null,
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

function compileLiteral(node) {
  switch (node.type) {
    case "String":
      return t.stringLiteral(node.value);

    case "Integer":
      return t.numericLiteral(Number(`${node.sign || ""}${node.digits}`));

    case "Decimal":
      return t.numericLiteral(
        Number(`${node.sign || ""}${node.integer}.${node.decimal}`)
      );

    case "Boolean":
      return t.booleanLiteral(node.value);

    default:
      throw new Error(`Unknown node type ${node.type}`);
  }
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
  compileLiteral,
  generate
};
