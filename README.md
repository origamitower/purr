# Origami

Origami is a multi-paradigm, safe, and practical meta-language targeting JavaScript.

In particular, this means that:

- It's multi-paradigm by supporting the imperative, object-oriented, and functional paradigms out of the box;

- It's safe by trading off some performance to get additional safety _using runtime verification_. That's the only way to be safe-ish when interacting with JavaScript. Some of the features lets you control the amount of verification that you want.

- It's practical in the sense that it does not add any feature that does not interact cleanly and modularly with JavaScript. For example, we don't add Protocols because it's not possible to add it modularly to JavaScript.

- It's a meta-language by supporting compiler plugins, inline DSLs, and pluggable literals.

## Why not <insert-other-language-here>?

There are many languages that compile to JavaScript, and for most of these languages it's kinda fine if you only consume JavaScript objects without ever letting your language's objects be consumed by JavaScript, but:

- TypeScript makes no guarantees about _runtime safety_. It's fine for tooling and hints about code that _may_ be wrong, but you can't really think of the type checking errors as anything more than a warning;

- F# (Fable), OCaml/Reason (Bucklescript/js_of_ocaml), Scala (Scala.js), and other existing languages weren't originally designed for the JavaScript ecossystem and platform. It's nice that you can compile programs in those languages to use in a JavaScript environment, but mixing code in those languages with code in JavaScript basically breaks most of their assumptions. Plus, compilers which erase types make runtime behaviour hard to predict and really dangerous;

- Elm is great because it avoids all of these problems by forcing a strict separation between Elm code and JavaScript code, but that also comes with a price--FFI is expensive. It's cool if your application is mainly in Elm, but you can't really use it for mixed, modular codebases;

## Roadmap

- [ ] Foundation library (a standard library for Origami)
- [ ] Rest and named parameters
- [ ] Array and object spread
- [ ] Modules (lazy top-level objects)
- [ ] Class expressions
- [ ] Destructuring (simplified pattern-matching)
- [ ] Decorators (compile-time macros)
- [ ] Pluggable literals (compile-time macros)
- [ ] Inline DSLs (compile-time)
- [ ] Grammar DSL (ohm-based)
- [ ] Testing DSL and integrated testing (Pyret-style)
- [ ] Package language

Things that need a bit more of thought and love before implementing:

- Contextual extensions/subjective layers
- Traits (syntax and some performance considerations pending)
- Higher-order contracts (syntax, mostly)
- Optional static verification (soft-contracts + assertions + inference)
- Whole-program compilation under closed-world assumptions (which actually lets us do optimisations)

## Getting started

The current compiler is a prototype-stage compiler and will eventually be replaced by a self-hosted one. This means that the quality of the generated code is pretty poor, there is no static verification, and there may be some rough edges.

That said, you can install the compiler through npm:

    npm install -g @origamitower/origami

A minimal hello world looks like this:

```
% version: 1

function main(_) {
  console.log("Hello, world");
}
```

You can compile with `origami compile <file>` and run it with `origami run <file>`. Running will execute the `main` function for now (configurable entry-points are on the roadmap).

## Licence

Origami is (c) Quildreen Motta, and released under MIT.
