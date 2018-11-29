# Origami

[![Join the chat at https://gitter.im/origamitower/origami](https://badges.gitter.im/origamitower/origami.svg)](https://gitter.im/origamitower/origami?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

> **NOTE**: this project is in early stages of design and development. If you want to contribute, you should get familiar with the [design process](https://github.com/origamitower/origami/tree/master/design). Otherwise, this is [the current state of the language](https://github.com/origamitower/origami/blob/master/design/ROADMAP.md).

Origami is a safe, multi-paradigm, and practical programming language targeting JavaScript. It’s based on a simple call-by-value calculus with one-shot delimited continuations, algebraic effect handlers, gradual typing and higher-order contracts, and a generalised form of pattern matching.

It supports functional, imperative, and object-oriented programming out-of-the-box. Other paradigms can be implemented as little embedded languages.

It uses runtime verification to enforce safety, but optimises away dynamic checks where the compiler can statically prove that a violation of the contract at runtime is impossible.

It does not add any feature that does not interact cleanly and modularly with JavaScript. Actual JavaScript code is isolated in FFIs to maintain safety, but runtime values still use the same intrinsics.

It supports compiler plugins, inline DSLs, and plugabble literals. Macros are plain AST-transforming functions that must be compiled prior to execution.

## Getting this to work

You'll need to install [.NET core 2.1+](https://dotnet.microsoft.com/download) and [Node 10+](https://nodejs.org/en/).

Clone this repository:

    $ git clone git@github.com:origamitower/origami.git

Install the tools (from the project's root):

    $ cd origami
    $ npm install

Install the compiler dependencies (from the compiler's root):

    $ cd origami/projects/compiler
    $ npm install
    $ dotnet restore src
    $ dotnet restore test

To build the compiler, run `make build`.

To run the tests, run `make test`.

If you're implementing a new feature, it might be useful to run the tests in "watch mode" (the project is recompiled and tests are run every time you change a source file). To do this, run `make test-watch-build` in one terminal, and `make test-watch-run` in another terminal.

## Licence

Origami is (c) Quildreen Motta, and released under MIT.
