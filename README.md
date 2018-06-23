# The Origami Programming Language

# What’s Origami?

Origami is a small, functional-first programming language that targets TypeScript. The goal is to use the same type system, and support all features from JavaScript, but without being restricted to not shipping a runtime, or to the same syntax.

In a sense, Origami’s goals are similar to F#, with the difference that we don’t have different inference algorithm—though we might consider better local inference in the future.

Semantics that Origami will add:

- First-class support for immutable types (lists, vectors, maps);
- First-class support for richer numeric types (bigints, bigdecimals, bigrationals);
- Union types; (desugaring to classes+subtyping, the usual pattern)
- Compiler annotations + compiler plugins (e.g.: for documentation and automatic derivations);
- [Protocols](https://clojure.org/reference/protocols) (first-class, modular type classes, though single-dispatched);
- [Extensible pattern matching with extractors](https://infoscience.epfl.ch/record/98468?ln=en); (same as Scala)
- [Traits](http://scg.unibe.ch/research/traits); (the OOP kind, not Rust’s kind. Pretty much safer/compositional mixins)
- Nice sugar (pipes, infix application, operator overloading, partial application, keyword arguments (Swift/Smalltalk-like));
- Built-in testing facilities (Pyret/D-like);

All of the runtime additions will be available to use with TypeScript (and JavaScript) as well.

The plan is to have decent tooling for Origami as well, which includes:

- A build pipeline (for Node and browsers);
- A reference documentation tool (also supporting TypeScript);
- Project scaffolding tools;
- Testing and benchmarking tools;
- Full IDE support in at least VSCode through a language server;

Check the [ROADMAP](./notes/roadmap.md) for the current status of this project.