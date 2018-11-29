# Origami

> **NOTE**: this project is in early stages of design and development.

Origami is a safe, multi-paradigm, and practical programming language targeting JavaScript. It’s based on a simple call-by-value calculus with one-shot delimited continuations, algebraic effect handlers, gradual typing and higher-order contracts, and a generalised form of pattern matching.

It supports functional, imperative, and object-oriented programming out-of-the-box. Other paradigms can be implemented as little embedded languages.

It uses runtime verification to enforce safety, but optimises away dynamic checks where the compiler can statically prove that a violation of the contract at runtime is impossible.

It does not add any feature that does not interact cleanly and modularly with JavaScript. Actual JavaScript code is isolated in FFIs to maintain safety, but runtime values still use the same intrinsics.

It supports compiler plugins, inline DSLs, and plugabble literals. Macros are plain AST-transforming functions that must be compiled prior to execution.

## Licence

Origami is (c) Quildreen Motta, and released under MIT.
