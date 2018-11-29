# Origami RFC #0001 - Modules

- [ ] Discussion
- [ ] Implementation

## Summary

As a modular programming language, Origami aims to support both _modularity_ and _modular compilation_. We also care a lot about allowing mutual recursion between modules (disallowing it causes people to organise their programs in awkward ways), and security. The module system also has to be implementable in JavaScript (our target language) with acceptable performance.

There are not many module systems in usage that fit all of the criteria above, at least not in widely used languages. Origami brings some ideas from academia and implements them. In short, the module system:

- Separates `modules` and `interfaces`, like ML does. Interfaces describe a type signature for what we expect of a module, and are identified by an unique name. Modules are anonymous implementations of these interfaces.

- Modules can only depend on interfaces. There's no global namespace, and free variables are not allowed in a module--so linking is explicitly speficied. Implementations are provided through the Linking phase, which supports the use case of things like dependency injection and parameterised modules naturally without the need for functors or containers.

- No executable form is allowed at the top-level of a module. A module is a declarative entity, and it should be safe to load it and analyse its contents in full without the risk of running some attacker code. This also enables mutually-recursive modules, as names are naturally late-bound.

- Linking takes in a constraint (what we want) and a search space (what we can link), and provides some module implementation. Ambiguity is not allowed in this phase, and the user has to disambiguate manually (by providing more constraints or limiting the search space). Search spaces are per-module in an hierarchical fashion to reduce the burden of defining them, but without reducing security properties too much.

## References

- [A Ban on Imports](https://gbracha.blogspot.com/2009/06/ban-on-imports.html)  
  -- Gilad Bracha, 2009

- [A Ban on Imports (continued)](https://gbracha.blogspot.com/2009/07/ban-on-imports-continued.html)  
  -- Gilad Bracha, 2009

- [Modularity Without a Name](https://awelonblue.wordpress.com/2011/09/29/modularity-without-a-name/)  
  -- David Barbour, 2011

- [Modules Divided: Interface and Implement](https://awelonblue.wordpress.com/2011/10/03/modules-divided-interface-and-implement/)
  -- David Barbour, 2011

- [Modules as Objects in Newspeak](http://bracha.org/newspeak-modules.pdf)
  -- Gilad Bracha, Peter von der Ahé, Vassili Bykov, Yaron Kashai, William Madok, and Eliot Miranda, 2010

- [F-ing Modules](https://people.mpi-sws.org/~rossberg/f-ing/)
  -- Andreas Rossberg, Claudio Russo, and Derek Dreyer, 2014
