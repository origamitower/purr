# The Origami Programming Language

# What’s Origami?

Origami is a small, functional-first programming language that targets TypeScript. The goal is to use the same type system, and support all features from JavaScript, but without being restricted to not shipping a runtime, or to the same syntax.

In a sense, Origami’s goals are similar to F#, with the difference that we don’t have different inference algorithm—though we might consider better local inference in the future.

Semantics that Origami adds:

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

# Roadmap

- **Runtime basics**
  - Numeric tower
  - Immutable & Mutable collections
  - Iterators
  - Maybe, Result, Validation
  - Function combinators
  - Protocols
  - Operators (based on protocols)
  - Testing/Benchmarking
  - Parsing
  - JSON serialisation
  - Debug representation/tools
- **Origami basics**
  - Bootstrapped compiler for level 0 language (functional/imperative parts, no classes/OOP yet)
- **Tooling basics**
  - Build system;
  - Reference documentation tool;
  - Testing/Benchmarking;
- **Migration support**
  - Tracing migration assistant for Folktale (traces in lib + trace analysis to point places that need to be changed)
- **Origami lv2**
  - Self-hosted compiler;
  - Compiler plugins + automatic derivations;
  - OOP
- **Origami lv3**
  - Type-based specialisation (needs to reimplement TS’s type system first)
  - Traits (still need to figure out how to do this)
