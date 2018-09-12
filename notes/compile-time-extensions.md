# Compile-time extensions

Origami has support for compile-time extensions, in which AST nodes can be tagged, and compiler plugins can transform those AST nodes before they're sent to the compiler's backend.

A node can be tagged with a decorator:

```
// Tagging declarations:
@test import "f" exposing * as g;
@test function f() { }
@test class F() { }
@test module F { }

// Tagging statements
@lazy let x = y;

// Tagging expressions
@bigint 1000;
```

Decorators can take any number of arguments, but all arguments must be _compile-time evaluatable_. Which means that they're restricted to identifiers, strings, numbers, booleans, and arrays or objects containing only one of these compile-time literals as values.

Unlike macros in e.g.: Rust or Lisp, decorators really are processed _externally_. This makes the phase distinction in Origami (almost painfully) explicit. You can write compiler plugins in Origami itself, but the entire module will be compiled before any Origami code for the current project. Of course, compiler plugins can also be written in any compile-to-JS language, they just need to be compiled into a language the compiler can load beforehand (JS or Origami by default).

A compiler plugin is just a Node module that exposes a `transform` function, which takes in the Origami compiler module and an Origami AST and returns a new Origami AST, or an array of new Origami AST nodes (which will be spliced in place of the old one).

This allows these plugins to create new declarations. For example:

```
% language: origami

function transform(origami, ast) {
  match ast {
    case origami.ast.Function(meta, kind, name, parameters, body):
      [
        new origami.ast.Function(meta, kind, name, parameters, body),
        new origami.ast.Function(meta, kind, name + "_curried", parameters[0],
          parameters.slice(1).reduceRight(
            (e, p) => {
              new origami.ast.FunctionExpression(meta, kind, [p], e);
            },
            [
              new origami.ast.ExpressionStatement(
                new origami.ast.FunctionCall(
                  new origami.ast.Variable(name),
                  parameters.map(new origami.ast.Variable(?))
                )
              )
            ]
          )
        )
      ];
  }
}
```

This plugin keeps the original function definition, and constructs a curried function definition that calls the original saturated definition.

Note that the macro-expansion phase continues until there are no more decorators to expand. This means that decorators can return ASTs containing more decorators to expand. Decorators are processed from innermost to outermost (applicative-order).
