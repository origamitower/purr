## Bootstrapping compiler (WIP)

A very simple compiler implementing a minor subset of the language to allow the self-hosted compiler and runtime to be implemented. This includes:

- [x] First-class functions
- [x] Type declarations
- [x] Classes and Union types
- [x] Pattern matching
- [x] Collection and numeric literals
- [x] Infix functions
- [x] Imperative statements
- [ ] Language support for example & property-based tests
- [ ] Keyword functions/methods
- [ ] Parsing inline tests


## Self-hosted compiler and Runtime

A proper re-implementation of the bootstrap compiler in Origami. And a proper runtime to support it.

- [ ] Move the parser from OMeta to Ohm
- [ ] Translate Origami to TypeScript's AST
- [ ] Pretty print TS's AST to file (maybe the TS compiler already has something like this?)
- [ ] Implement built-in testing facilities
- [ ] Implement the runtime
- [ ] Compile pattern matching to good decision trees