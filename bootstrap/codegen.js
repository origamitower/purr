const { inspect } = require("util");
const generateJs = require("@babel/generator").default;
const t = require("@babel/types");
const { mangle, fresh, flatmap } = require("./utils");
const coreModules = require("./core-modules");

const id = x => t.identifier(x);

function isArray(a) {
  return t.callExpression(t.memberExpression(id("Array"), id("isArray")), [a]);
}

function isNull(a) {
  return t.binaryExpression("===", a, t.nullLiteral());
}

function isNone(a) {
  return t.binaryExpression("==", a, t.nullLiteral());
}

function isntNone(a) {
  return t.binaryExpression("!=", a, t.nullLiteral());
}

function isntNull(a) {
  return t.binaryExpression("!==", a, t.nullLiteral());
}

function typeOf(a) {
  return t.unaryExpression("typeof", a, true);
}

function isObject(a) {
  return t.logicalExpression(
    "&&",
    isntNull(a),
    t.binaryExpression("===", typeOf(a), t.stringLiteral("object"))
  );
}

function hasLength(a, op, i) {
  return t.binaryExpression(op, t.memberExpression(a, id("length")), i);
}

function defConst(name, value) {
  return t.variableDeclaration("const", [t.variableDeclarator(name, value)]);
}

function at(obj, i) {
  return t.memberExpression(obj, i, true);
}

function send(obj, message, args) {
  return t.callExpression(t.memberExpression(obj, id(message)), args);
}

function $rt(name, args) {
  return t.callExpression($rtMember(name), args);
}

function $rtMember(name) {
  return t.memberExpression(id("$rt"), id(name));
}

function $compileArgs(params, fn) {
  let holeId = 0;
  let holes = [];
  const compileArg = arg => {
    switch (arg.type) {
      case "HoleExpression": {
        const bind = id(`$${holeId++}`);
        holes.push(bind);
        return bind;
      }

      default:
        return compile(arg);
    }
  };

  const spread =
    params.spread == null
      ? []
      : [t.spreadElement($rt("$$assertIterable", [compileArg(params.spread)]))];
  const named =
    params.named.length > 0
      ? [
          t.objectExpression(
            params.named.map(({ name, expression }) =>
              t.objectProperty(id(name), compile(expression))
            )
          )
        ]
      : [];
  const expr = fn([...params.positional.map(compileArg), ...spread, ...named]);
  if (holes.length === 0) {
    return expr;
  } else {
    return t.functionExpression(
      null,
      holes,
      t.blockStatement([t.returnStatement(expr)])
    );
  }
}

function $checkArity(name, arity, spread) {
  const mod = spread ? " at least" : "";
  const op = spread ? ">=" : "===";
  const message = `${
    name ? name : "This function"
  } takes${mod} ${arity} arguments, but got `;

  return $assertRaw(
    t.binaryExpression(
      op,
      t.memberExpression(id("arguments"), id("length")),
      t.numericLiteral(arity)
    ),
    t.binaryExpression(
      "+",
      t.stringLiteral(message),
      t.memberExpression(id("arguments"), id("length"))
    )
  );
}

function $call(callee, params) {
  return $compileArgs(params, e => t.callExpression(callee, e));
}

function $member(object, method) {
  return t.memberExpression(object, method);
}

function $methodCall(object, method, params) {
  return $call($member(object, method), params);
}

function $new(object, params) {
  return $compileArgs(params, e => t.newExpression(object, e));
}

function $compileParams(params) {
  const spread =
    params.spread == null ? [] : [t.restElement(id(params.spread))];
  const named =
    params.named.length > 0
      ? [
          t.assignmentPattern(
            t.objectPattern(
              params.named.map(({ key, name, default: expr }) =>
                t.objectProperty(
                  id(key),
                  t.assignmentExpression("=", id(name), compile(expr))
                )
              )
            ),
            t.objectExpression([])
          )
        ]
      : [];
  return [...params.positional.map(id), ...spread, ...named];
}

function $paramNames(params) {
  return [...params.positional, ...[params.spread].filter(x => x != null)];
}

function $countParams(params) {
  return [params.positional.length, !!params.spread || params.named.length > 0];
}

function $fnExpr(kind, params, block) {
  const fnBlock = blockPrepend(compileBlock(fixReturns(block)), [
    $checkArity(null, ...$countParams(params))
  ]);
  const fnParams = $compileParams(params);

  return t.functionExpression(
    null,
    fnParams,
    fnBlock,
    kind === "generator",
    kind === "async"
  );
}

function $fnDecl(name, kind, params, block) {
  const fnBlock = blockPrepend(compileBlock(fixReturns(block)), [
    $checkArity(name, ...$countParams(params))
  ]);
  const fnParams = $compileParams(params);

  return t.functionDeclaration(
    id(name),
    fnParams,
    fnBlock,
    kind === "generator",
    kind === "async"
  );
}

function $classMethod(
  className,
  { static, methodType, name, kind, params, body }
) {
  const checkName =
    name === "constructor"
      ? `new ${className}`
      : static
        ? `${className}.${name.name}`
        : `${className}.prototype.${name.name}`;

  return {
    type: "ClassMethod",
    static: static,
    key: name,
    computed: false,
    kind: methodType,
    generator: kind === "generator",
    async: kind === "async",
    params: $compileParams(params),
    body: blockPrepend(body, [$checkArity(checkName, ...$countParams(params))])
  };
}

function $assertRaw(expr, message) {
  return t.ifStatement(
    t.unaryExpression("!", expr),
    t.throwStatement(t.newExpression(id("Error"), [message]))
  );
}

function $assert(expr, message) {
  return $assertRaw(expr, t.stringLiteral(message));
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

    case "MatchStatement": {
      const fixCase = matchCase => {
        return Object.assign({}, matchCase, {
          block: fixReturns(matchCase.block)
        });
      };

      return [
        ...initial,
        {
          type: "MatchStatement",
          match: {
            type: "Match",
            value: last.match.value,
            cases: last.match.cases.map(fixCase)
          }
        }
      ];
    }

    case "LetStatement":
    case "LetDestructureStatement":
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

function flatten(xss) {
  return xss.reduce((a, b) => {
    if (Array.isArray(b)) {
      return a.concat(flatten(b));
    } else {
      return a.concat([b]);
    }
  }, []);
}

function compileBlock(block) {
  return t.blockStatement(compileRawBlock(block));
}

function compileRawBlock(block) {
  return flatten(block.map(compile));
}

function blockAppend(blockStmt, stmts) {
  return t.blockStatement([...blockStmt.body, ...stmts]);
}

function blockPrepend(blockStmt, stmts) {
  return t.blockStatement([...stmts, ...blockStmt.body]);
}

function compileProgram(module) {
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
      return [t.exportNamedDeclaration(compileFunction(node), [])];

    case "Class":
      return [t.exportNamedDeclaration(compileClass(node), [])];

    case "Export":
      return [
        t.exportNamedDeclaration(null, [
          t.exportSpecifier(id(node.name), id(node.alias))
        ])
      ];

    case "Module":
      return [t.exportNamedDeclaration(compileModule(node), [])];

    default:
      throw new Error(`Unknown node ${node.type}`);
  }
}

function compileModule(node) {
  return t.variableDeclaration("const", [
    t.variableDeclarator(
      id(node.name),
      t.callExpression(
        t.arrowFunctionExpression(
          [],
          t.blockStatement([
            defConst(id("$exports"), t.objectExpression([])),
            ...flatmap(node.declarations, compileModuleDeclaration),
            t.returnStatement(id("$exports"))
          ])
        ),
        []
      )
    )
  ]);
}

function compileModuleDeclaration(node) {
  const exportNameAs = (name, alias) =>
    t.expressionStatement(
      t.assignmentExpression("=", $member(id("$exports"), id(alias)), id(name))
    );

  const exportName = name => exportNameAs(name, name);

  switch (node.type) {
    case "Function":
      return [compileFunction(node), exportName(node.signature.name)];

    case "Class":
      return [compileClass(node), exportName(node.declaration.name)];

    case "Module":
      return [compileModule(node), exportName(node.name)];

    case "Statement":
      return compile(node.statement);

    case "Export": {
      switch (node.tag) {
        case "Named":
          return [exportNameAs(node.name, node.alias)];

        default:
          throw new TypeError(`Unknown export type ${node.tag}`);
      }
    }

    default:
      throw new Error(`Unknown node ${node.type}`);
  }
}

function compile(node) {
  switch (node.type) {
    case "Binding":
      return t.importSpecifier(id(node.alias), id(node.name));

    case "DefaultBinding":
      return t.importDefaultSpecifier(id(node.name));

    case "ExpressionStatement":
      return t.expressionStatement(compile(node.expression));

    case "LetStatement":
      return t.variableDeclaration(node.mutable ? "let" : "const", [
        t.variableDeclarator(id(node.name), compile(node.expression))
      ]);

    case "LetDestructureStatement": {
      const newBind = id(fresh.next());
      const value = id(fresh.next());
      const names = collectNames(node.pattern);
      const freshNames = names.map(_ => id(fresh.next()));
      return [
        t.variableDeclaration("let", [
          t.variableDeclarator(newBind, t.booleanLiteral(false)),
          t.variableDeclarator(value, compile(node.expression)),
          ...freshNames.map(x => t.variableDeclarator(x))
        ]),
        compilePattern(value, node.pattern)(
          t.blockStatement([
            t.expressionStatement(
              t.assignmentExpression("=", newBind, t.booleanLiteral(true))
            ),
            ...names.map((x, i) =>
              t.expressionStatement(
                t.assignmentExpression("=", freshNames[i], id(x))
              )
            )
          ])
        ),
        $assert(newBind, `Pattern matching failed.`),
        t.variableDeclaration("const", [
          ...names.map((x, i) => t.variableDeclarator(id(x), freshNames[i]))
        ])
      ];
    }

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
        t.variableDeclaration("const", [t.variableDeclarator(id(node.name))]),
        compile(node.iterator),
        compileBlock(node.block)
      );

    case "WhileStatement":
      return t.whileStatement(
        compile(node.predicate),
        compileBlock(node.block)
      );

    case "UntilStatement":
      return t.doWhileStatement(
        compile(node.predicate),
        compileBlock(node.block)
      );

    case "ForStatement":
      return t.forStatement(
        t.variableDeclaration("let", [
          t.variableDeclarator(id(node.name), compile(node.start))
        ]),
        t.binaryExpression("<=", id(node.name), compile(node.end)),
        t.assignmentExpression("+=", id(node.name), compile(node.by)),
        compileBlock(node.block)
      );

    case "RepeatStatement":
      return t.whileStatement(t.booleanLiteral(true), compileBlock(node.block));

    case "IfStatement": {
      const compileIf = node => {
        return t.ifStatement(
          compile(node.test),
          compileBlock(node.block),
          node.alternate ? compileAlternate(node.alternate) : null
        );
      };
      const compileAlternate = node => {
        switch (node.type) {
          case "ElseIf":
            return compileIf(node.if);

          case "Else":
            return compileBlock(node.block);

          default:
            throw new Error(`Unknown node ${node.type}`);
        }
      };

      return compileIf(node);
    }

    case "MatchStatement":
      return t.blockStatement(compileMatch(node.match));

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
      return $call($rtMember(mangle(node.operator)), {
        positional: [node.left, node.right],
        named: []
      });

    case "UnaryExpression":
      return $call($rtMember(mangle(node.operator)), {
        positional: [node.argument],
        named: []
      });

    case "CallExpression":
      return $call(compile(node.callee), node.params);

    case "MethodCallExpression":
      return $methodCall(compile(node.object), id(node.method), node.params);

    case "AtPutExpression":
      return $call($rtMember(mangle("[]<-")), {
        positional: [node.object, node.key, node.value],
        named: []
      });

    case "UpdateExpression":
      return t.assignmentExpression(
        "=",
        compile(node.location),
        compile(node.value)
      );

    case "AtExpression":
      return $call($rtMember(mangle("[]")), {
        positional: [node.object, node.key],
        named: []
      });

    case "GetExpression":
      return t.memberExpression(compile(node.object), id(node.name));

    case "NewExpression":
      return $new(compile(node.constructor), node.params);

    case "SuperExpression":
      return id("super");

    case "VariableExpression":
      return t.identifier(node.name);

    case "LiteralExpression":
      return compileLiteral(node.literal);

    case "ArrayExpression": {
      const compileItem = item => {
        switch (item.type) {
          case "Spread":
            return t.spreadElement(
              $rt("$$assertIterable", [compile(item.expression)])
            );

          case "Item":
            return compile(item.expression);

          default:
            throw new Error(`Invalid array item type ${item.type}`);
        }
      };
      return t.arrayExpression(node.items.map(compileItem));
    }

    case "ObjectExpression":
      return t.objectExpression(
        node.pairs.map(({ name, expression }) => {
          return t.objectProperty(id(name), compile(expression));
        })
      );

    case "FunctionExpression":
      return $fnExpr(node.kind, node.params, node.block);

    case "ClassExpression": {
      const decl = compileClass(node.class);
      return t.classExpression(decl.id, decl.superClass, decl.body);
    }

    case "HoleExpression":
      throw new Error(`Holes can only occurr directly in function calls.`);

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
          compileLiteral(node.id)
        )
      ];

    case "Exposing":
      return [
        t.importDeclaration(node.bindings.map(compile), compileLiteral(node.id))
      ];

    case "Core": {
      const mod = coreModules[node.id];
      if (!mod) {
        throw new Error(`Invalid core module ${node.id}`);
      }
      for (const { name } of node.bindings) {
        if (!mod.has(name)) {
          throw new Error(`No binding ${name} in core module ${node.id}`);
        }
      }
      return node.bindings.filter(x => x.alias).map(x => {
        return t.variableDeclaration("const", [
          t.variableDeclarator(
            id(x.alias),
            t.memberExpression($rtMember("$$GLOBAL"), id(x.name))
          )
        ]);
      });
    }

    default:
      throw new Error(`Unknown import type ${node.tag}`);
  }
}

function compileClass(node) {
  const {
    type: classType,
    name,
    params,
    superclass,
    fields,
    constructor,
    members
  } = node.declaration;
  const paramNames = $paramNames(params);
  const isData = classType === "data";
  const className = name;

  const field = x => t.memberExpression(t.thisExpression(), id(`__${x}`));
  const objField = (obj, x) => t.memberExpression(obj, id(`__${x}`));

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

    return $classMethod(className, {
      static: member.tag === "Static",
      methodType: methodKind,
      name: id(name),
      kind: functionKind,
      params: methodParams,
      body: t.blockStatement([
        ...unpackPrelude,
        t.variableDeclaration("const", [
          t.variableDeclarator(id(self), t.thisExpression())
        ]),
        ...compileRawBlock(realBlock)
      ])
    });
  }

  // We always set all properties in the class
  const constructorPrelude = [
    ...paramNames.map(x => {
      return t.expressionStatement(
        t.assignmentExpression("=", field(x), id(x))
      );
    }),
    ...fields.map(x => {
      return t.expressionStatement(
        t.assignmentExpression("=", field(x.name), compile(x.value))
      );
    })
  ];

  const superPrelude = superclass
    ? [t.expressionStatement($call(id("super"), superclass.params))]
    : [];

  const unpackPrelude = [
    ...paramNames.map(x => defConst(id(x), field(x))),
    ...fields.map(x => defConst(id(x.name), field(x.name)))
  ];

  const compiledMembers = members.map(compileMember);

  const genGetters = isData
    ? paramNames.map(x => {
        return t.classMethod(
          "get",
          id(x),
          [],
          t.blockStatement([t.returnStatement(field(x))])
        );
      })
    : [];

  const genMethods = isData
    ? [
        t.classMethod(
          "method",
          id("unapply"),
          [id("object")],
          t.blockStatement([
            $checkArity(`${name}.prototype.unapply`, 1, false),
            t.ifStatement(
              t.binaryExpression("instanceof", id("object"), id(name)),
              t.blockStatement([
                t.returnStatement(
                  t.arrayExpression(
                    paramNames.map(k => objField(id("object"), k))
                  )
                )
              ]),
              t.blockStatement([t.returnStatement(t.nullLiteral())])
            )
          ]),
          false,
          !!"static"
        ),
        t.classMethod(
          "method",
          id("$equals"),
          [id("that")],
          t.blockStatement([
            t.returnStatement(
              $rt("$$checkClassEquals", [
                t.arrayExpression(
                  paramNames.map(k => t.stringLiteral(`__${k}`))
                ),
                id("that")
              ])
            )
          ])
        ),
        t.classMethod(
          "method",
          id("debugRepresentation"),
          [
            t.assignmentPattern(
              t.objectPattern([
                t.objectProperty(
                  id("depth"),
                  t.assignmentExpression("=", id("depth"), t.numericLiteral(0))
                ),
                t.objectProperty(
                  id("visited"),
                  t.assignmentExpression(
                    "=",
                    id("visited"),
                    t.newExpression(id("Set"), [])
                  )
                )
              ]),
              t.objectExpression([])
            )
          ],
          t.blockStatement([
            t.returnStatement(
              $rt("$$showObject", [
                t.stringLiteral(className),
                t.thisExpression(),
                t.arrayExpression(
                  paramNames.map(k => t.stringLiteral(`__${k}`))
                ),
                id("depth"),
                id("visited")
              ])
            )
          ])
        )
      ]
    : [];

  return t.classDeclaration(
    id(name),
    superclass ? compile(superclass.constructor) : null,
    t.classBody([
      $classMethod(name, {
        static: false,
        methodType: "constructor",
        name: id("constructor"),
        params: params,
        body: t.blockStatement([
          ...superPrelude,
          ...constructorPrelude,
          ...constructor.map(compile)
        ])
      }),
      ...genGetters,
      ...genMethods,
      ...compiledMembers
    ])
  );
}

function compileFunction(node) {
  const { name, params, kind } = node.signature;
  return $fnDecl(name, kind, params, node.block);
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

    case "Null":
      return t.nullLiteral();

    default:
      throw new Error(`Unknown node type ${node.type}`);
  }
}

function collectNames(pattern) {
  switch (pattern.tag) {
    case "Literal":
      return [];

    case "Array": {
      const pat = pattern.pattern;
      switch (pat.tag) {
        case "Spread":
          return [
            ...flatmap(pat.items, collectNames),
            ...collectNames(pat.spread)
          ];
        case "Regular":
          return flatmap(pat.items, collectNames);
        default:
          throw new Error(`Unknown array pattern tag ${pat.tag}`);
      }
    }

    case "Object":
      return flatmap(pattern.pairs.map(x => x.pattern), collectNames);

    case "Extractor":
      return flatmap(pattern.patterns, collectNames);

    case "Bind":
      return [pattern.name];

    default:
      throw new Error(`Unknown pattern tag ${pattern.tag}`);
  }
}

function compilePattern(bind, pattern) {
  switch (pattern.tag) {
    case "Literal":
      return e => [
        t.ifStatement(
          t.binaryExpression("===", bind, compileLiteral(pattern.literal)),
          e
        )
      ];

    case "Array": {
      const pat = pattern.pattern;
      const isValidArray = (a, op, i) =>
        t.logicalExpression(
          "&&",
          isArray(a),
          hasLength(a, op, t.numericLiteral(i))
        );

      switch (pat.tag) {
        case "Spread": {
          const spreadBind = id(fresh.next());
          return e => [
            t.ifStatement(
              isValidArray(bind, ">=", pat.items.length),
              pat.items.reduceRight(
                (e, newPattern, i) => {
                  const newBind = id(fresh.next());
                  return t.blockStatement([
                    defConst(newBind, at(bind, t.numericLiteral(i))),
                    ...compilePattern(newBind, newPattern)(e)
                  ]);
                },
                /**/
                t.blockStatement([
                  defConst(
                    spreadBind,
                    send(bind, "slice", [t.numericLiteral(pat.items.length)])
                  ),
                  ...compilePattern(spreadBind, pat.spread)(e)
                ])
              )
            )
          ];
        }

        case "Regular": {
          return e => [
            t.ifStatement(
              isValidArray(bind, "===", pat.items.length),
              pat.items.reduceRight((e, newPattern, i) => {
                const newBind = id(fresh.next());
                return t.blockStatement([
                  defConst(newBind, at(bind, t.numericLiteral(i))),
                  ...compilePattern(newBind, newPattern)(e)
                ]);
              }, e)
            )
          ];
        }

        default:
          throw new Error(`Unknown array pattern ${pat.tag}`);
      }
    }

    case "Object": {
      return e => [
        t.ifStatement(
          isObject(bind),
          pattern.pairs.reduceRight((e, pair) => {
            const newBind = id(fresh.next());
            return t.blockStatement([
              defConst(newBind, at(bind, t.stringLiteral(pair.name))),
              ...compilePattern(newBind, pair.pattern)(e)
            ]);
          }, e)
        )
      ];
    }

    case "Extractor": {
      return e => {
        const unapplied = id(fresh.next());
        return [
          defConst(unapplied, send(compile(pattern.object), "unapply", [bind])),
          t.ifStatement(
            isntNone(unapplied),
            t.blockStatement([
              $assert(
                isArray(unapplied),
                "unapply() must return null or an array"
              ),
              pattern.patterns.reduceRight((e, newPattern, i) => {
                const newBind = id(fresh.next());
                return t.blockStatement([
                  defConst(newBind, at(unapplied, t.numericLiteral(i))),
                  ...compilePattern(newBind, newPattern)(e)
                ]);
              }, e)
            ])
          )
        ];
      };
    }

    case "Bind":
      return e => [
        t.variableDeclaration("const", [
          t.variableDeclarator(id(pattern.name), bind)
        ]),
        e
      ];

    default:
      throw new Error(`Unknown pattern tag ${pattern.tag}`);
  }
}

function compileMatch(match) {
  const bind = id(fresh.next());
  const matched = id(fresh.next());
  const matchSuccess = () => {
    return t.expressionStatement(
      t.assignmentExpression("=", matched, t.booleanLiteral(true))
    );
  };

  const compileCase = bind => matchCase => {
    switch (matchCase.tag) {
      case "When":
        return t.blockStatement(
          compilePattern(bind, matchCase.pattern)(
            t.ifStatement(
              compile(matchCase.predicate),
              blockAppend(compileBlock(matchCase.block), [matchSuccess()])
            )
          )
        );

      case "Case":
        return t.blockStatement(
          compilePattern(bind, matchCase.pattern)(
            blockAppend(compileBlock(matchCase.block), [matchSuccess()])
          )
        );

      case "Default":
        return blockAppend(compileBlock(matchCase.block), [matchSuccess()]);

      default:
        throw new Error(`Unknown match case tag ${matchCase.tag}`);
    }
  };

  return [
    t.variableDeclaration("const", [
      t.variableDeclarator(bind, compile(match.value))
    ]),
    t.variableDeclaration("let", [
      t.variableDeclarator(matched, t.booleanLiteral(false))
    ]),
    ...match.cases.map(compileCase(bind)),
    $assert(matched, `Pattern matching failed`)
  ];
}

function generate(ast) {
  return generateJs(compileProgram(ast));
}

module.exports = {
  compileProgram,
  compile,
  compileDefinition,
  compileClass,
  compileFunction,
  compileImport,
  compileLiteral,
  compileModule,
  generate
};
