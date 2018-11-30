# [#0001] - Modules

|             |      |
| ----------- | ---- |
| **Authors** | Quil |

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

### Modules and modularity

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

### Relavant implementations

- [Racket's Units](https://docs.racket-lang.org/guide/units.html)
- [OCaml's modules](https://ocaml.org/learn/tutorials/modules.html)
- [Haskell's Backpack](https://plv.mpi-sws.org/backpack/)
- [Newspeak's modules](http://newspeaklanguage.org/)

### Relational & Constraint logic

- [Relational Programming in miniKanren: Techniques, Applications, and Implementations](https://github.com/webyrd/dissertation-single-spaced/blob/master/thesis.pdf)  
  -- William E. Byrd's PhD thesis, 2009

- [µKanren: A Minimal Functional Core for Relational Programming](http://webyrd.net/scheme-2013/papers/HemannMuKanren2013.pdf)  
  -- Jason Hemann, and Daniel P. Friedman, 2013

- [cKanren: miniKanren with Constraints](http://www.schemeworkshop.org/2011/papers/Alvis2011.pdf)  
  -- Claire E. Alvis, Jeremiah J. Willcock, Kyle M. Carter, William E. Byrd, and Daniel P. Friedman, 2011

## Motivation

As programs grow more complex, programmers need to start organising them into more manageable pieces—components. As programs grow even more complex, programmers need to incorporate components written and maintained by other people.

The first of these tasks poses a modularity problem: how do you define components? How do you make these components stand on their own? How can you switch components by equivalent ones if needed? How can you extend components to do new things?

The second of these tasks also poses a security problem: can you trust code written by other people? How much can you trust it? Will adding this code break other parts of my application that have nothing to do with it? What happens if they change the code? How difficult is it to update components to fix a security problem? Can you temporarily fix a component without having to maintain it forever if you discover a huge security issue?

Sadly, most widely used programming languages do pretty poorly at both of these problems. Modules are more often than not entangled by name, path, or some similar identification, so it's difficult to switch one for another. Modules can use anything your program has access to, so you have to fully trust every piece of code you add to your program. And some languages have features which are not modular (such as Type Classes in Haskell), where modules may conflict in a way that render your application unusable.

Some work-arounds for these problems, like dependency injection containers in Java, and stack-inspection for security in the JVM, result in a lot of complexity--so applications are harder to write and debug,--and performance overhead.

Origami is a language that values safety--it's one of its core goals,--so any unsafe module system is unacceptable. We also value practicality, so we'd like to have a system that isn't complex to reason about or use, but that can't come at the expense of security and safety.

Luckily, people have been working on these issues for a long time, and while there isn't a language that coherently brings these together ([Pony](https://www.ponylang.io/) and [Newspeak](http://newspeaklanguage.org/) have promising security facilities, however), it's possible to combine different ideas into one module system that comes close to our ideal. That's what this document describes.

## An overview of the module system

Origami's module system is primarily based on David Barbour's idea of linking modules using constraints, and dividing modules into interfaces and anonymous implementations of interfaces. The latter is also similar to ML module systems to an extent--you have a module signature that defines the expected shape for a module, and module implementations which provide concrete definitions of these signatures.

In Origami, an interface is a set of meta-data, contracts, and an unique identifier. For example, an interface for a Set may be specified as follows:

```
interface Data.Set

uses Data.Boolean exposing Boolean

type Set<T>

function empty<T>() :: Set<T>
function add(set :: Set<T>, value :: T) :: Set<T>
function has(set :: Set<T>, value :: T) :: Boolean
```

This code describes the interface uniquely identified by `Data.Set`, which depends on the interface `Data.Boolean` providing a type with the name `Boolean`.

Implementations of `Data.Set` are required to provide an abstract and generic `Set<T>` type, and three operations on such type: `empty`, `add` and `has`. Here's one possible implementation:

```
module Data.Set

uses Data.Boolean exposing Boolean

union Set<T> {
  Empty
  Has(value :: T, rest :: Set<T>)
}

function empty<T>() :: Set<T> =
  Set.Empty;

function add(set :: Set<T>, value :: T) :: Set<T> =
  Set.Has(value, set);

function has(set :: Set<T>, value :: T) :: Boolean =
  match set {
    case Set.Empty: false;
    case Set.Has(v, rest):
      if v == value then true
      else has(rest, value);
  }
```

Here we have a module that implements the interface `Data.Set` (the module itself has no name, and it's not possible to refer to it directly), and it also depends on the interface `Data.Boolean`. It implements `Set<T>` as an union type.

This second module could also exist in the same program, at the same time:

```
module Data.Set

type Set<T> = (T) -> Boolean

function empty<T>() :: Set<T> =
  (_) => false;

function add(set :: Set<T>, value :: T) :: Set<T> =
  (v) => if v == value then true
         else set(value);

function has(set :: Set<T>, value :: T) :: Boolean =
  set(value);
```

Which implements the interface `Data.Set` with `Set<T>` being a simple closure.

Now, we have two modules in the system that implement the same interface, in _behaviourally-equivalent_ ways, but not _value-equivalent_ ways (you cannot pass a set from the first module into a function of the second module). But there's still a question of how one goes about _using_ one of these modules, as referring to any specific module is not possible in this system.

Using a module is a _linking_ problem. Modules describe only dependencies in terms of interfaces, and it's the job of the linker to provide them with actual modules that fulfill their expectations.

The simplest way in which the linker works is by looking at the interface identifier, and looking for a module that implements it, then providing that module. This works well in the scenario where there's only one implementation of a particular module, but that's not the case here: we have two modules implementing the same interface.

For ambiguous cases, the linker needs additional _constraints_ to disambiguate the linking. Constraints may be provided either directly in the source form (by specifying any meta-data attached to the module), or externally in the application's description--a special file that configures the application.

So if we have:

```
module App

uses Data.Set as Set

function main(_) =
  Set.empty()
  |> Set.add(_, 1)
  |> Set.add(_, 2);
```

We would need an application description like this:

```
package {
  entry: App;

  link {
    Data.Set => "path/to/data.set/using/unions"
  }
}
```

The `link` description disambiguates linking by specifying the actual implementation to use for an interface. These specifications may also use other constraints (for example, the author of a particular module), and they may be divided into "search spaces", which can then be applied to groups of modules.

Search spaces allow trust to be managed in an easier way. For example, one can define a "low trust" search space that does not have access to most effectful modules, such that an attacker wouldn't be able to send information over the network, or access the file system, even if they were able to take over some dependency you use. And a "high trust" search space for packages owned by the user, that has access to everything the program has.

## Interfaces

An interface describes the _minimal_ set of behaviours that must be implemented, by describing a set of contracts. Interfaces may be seen as the following:

```
interface ::= Id * Meta ... * Signature ...

Signature ::=
  | Define: name * type
  | Function: name * arity * type
  | Union: name * [name : arity] ...
  | Record: name * key ...
  | Type: name * type
```

So an interface is a triple of an unique identifier, a set of meta-data (for example, author, trust-level, stability, etc), and a set of signatures. For signatures we only care about the shape of the definition for equivalence. We don't try to prove that two modules have equivalent _types_, as those are defined in terms of higher-order contracts.

As an example, the boolean interface could be defined as such:

```
@Experimental
interface Data.Boolean

uses Origami.Annotation.Stability exposing Experimental

/**
 * The boolean data type.
 */
union Boolean {
  True
  False
}

/**
 * Logical conjunction.
 */
function (l :: Boolean) and (r :: Boolean) :: Boolean

/**
 * Logical disjunction.
 */
function (l :: Boolean) or (r :: Boolean) :: Boolean

/**
 * Logical negation.
 */
function not (v :: Boolean) :: Boolean
```

This interface has the unique identifier `Data.Boolean`, a metadata of `Origami.Annotation.Stability.Experimental`, and four signatures: `Union(Boolean, [True, False])`, `_ and _`, `_ or _`, and `not _`.

## Modules

A module implements an interface through its unique identifier, and must define at least all of the signatures described in the interface. A module _may_ define more signatures than what's expected by the interface. Where this is the case, those signatures are accessible within the module, but not outside of it--as other modules may only depend on the interface.

A module may be described as follows:

```
Module ::= Id * Meta ... * Definition ...

Definition ::=
  | Define: Name * type * Expression
  | Function: Name * Name ... * Type * Statement ...
  | Union: Name * [Name : Field ...] ...
  | Record: Name * Field ...
  | Type: Name * Type

Field ::= Name * Type * Expression?
```

Which is pretty close to what interfaces support, but include an implementation for all of the definitions. Unions and Records may define default values for fields in a module, which is not supported in interfaces--interfaces may not contain expressions.

All of the definitions in a module are late bound. They are evaluated only when (and if) they're used. This allows the system to fully analyse a module to figure out if it implements an interface correctly or not, and link the appropriate definitions, without executing any code, thus avoiding some security problems from module loading, and supporting mutually-recursive modules.

An implementation of the previously-specified `Data.Boolean` interface would look as follows:

```
@Author("Quil")
module Data.Boolean

uses Origami.Annotation.Author exposing Author

union Boolean { True; False }

type True = Boolean.True
type False = Boolean.False

function (_ :: True) and (_ :: True) = True
function _ and _ = False

function (_ :: True) or _ = True
function _ or (_ :: True) = True
function _ or _ = False

function not (_ :: True) = False
function not (_ :: False) = True
```

The implementation provides a definition for every signature in the interface, and defines two additional types. As these types don't appear in the interface, they're local to the module, and can't be accessed from the outside.

The implementation also attaches an Author annotation to the module. The module inherits the annotations from the interface, and so contains both the Stability annotation and the Author one. These annotations may be used as constraints for the linker.

## Annotations

Annotations are a special form of data structure that are associated directly with an interface. For annotations, we don't actually _link_ a module implementation, but rather use the structure defined in the interface. In fact, modules can't even define annotations, as that could lead to conflicts if two modules defined incompatible annotations with the same name.

Other than that, an annotations is not very different from a `record` definition. The major difference is that annotations don't have any real runtime representation, being a compile-only construct.

## Dependencies

Interfaces may depend on other interfaces. Because intefaces are identified by unique names, resolving these dependencies is simple enough: we just look at the dictionary of names to interfaces to resolve them:

```
interface(id) :: Interface
```

Dependencies in modules are trickier: they define an interface, together with some constraints, and something must translate this into an actual module implementation satisfying the expectations of the programmer of that module. We do this with a _linker_, an operation that takes in a module, an interface identifier, and some constraints, and resolves the dependencies in the module to actual modules that have been registered.

### Dependency constraints

The linker translates dependencies into a _constraint_. It then uses this constraint to find suitable modules to link.

For example, given the dependency:

```
uses Data.Boolean exposing Boolean, _ and _
```

The linker considers the constraint:

```
Id = Data.Boolean /\ Has(Define(Boolean)) /\ Has(Function(and, 2))
```

And given the dependency:

```
uses Data.Boolean as b
  if Author("Quil")
```

It considers the constraint:

```
Id = Data.Boolean /\ Meta(Origami.Annotation.Author.Author("Quil"))
```

The following is the constraint language used by the linker:

```
n in Number
s in String
b in Boolean
l in Label
v in Variable

Constraint c ::=
  | Id = <id>           -- interface identifier
  | Has(signature)      -- exposes signature
  | Meta(meta(r..))     -- contains or inherits meta with values
                           satisfying the given relation
  | c /\ c              -- conjunction
  | c \/ c              -- disjunction
  | ~c                  -- negation

Relation r ::=
  | n | s | b               -- the value is the primitive
  | v                       -- any value captured as v
  | r.l                     -- projection
  | r /\ r                  -- conjunction
  | r \/ r                  -- disjunction
  | ~r                      -- negation
  | r = p | r > p | r < p   -- relations
```

> **TODO:**  
> This is probably too much to implement efficiently right now, so the more SMT
> parts of relation may be left to another iteration, and for this initial
> implementation we'll only consider simple equality between terms in unification.

This language is powerful enough to include most common categories, without causing problems such as non-termination. Evaluation is done by unification, as in relational logic.

For example, a constraint may be given for the version of a module:

```
uses Origami.Annotations.Version exposing Version
uses Data.List as L
  if Version(v.major = 2 & v.feature > 3)
```

Would be the equivalent of "only link modules whose version is '>2.3 and <3.0'".

### Search spaces

The linker needs access to a set of modules to link to when resolving the dependency constraints. These sets of modules are organised into **search spaces**. A search space is a set of modules, optionally given an unique identifier in the application.

Each module gets its own search space, which may only be a subset of the search space available for the module that linked it. At the top level, in the application configuration, it's possible to define unrestricted sets of modules and give them a name. These uniquely-identified search spaces may then be assigned to specific modules within the application.

Search spaces play the primary role of capabilities in Origami, and follow the principle of least authority. Modules have _exactly_ the rights you give them, and they cannot amplify those rights, or grant more rights to their dependencies. This way, if one does not provide a File System module to a module A, and this module depends on B that uses the File System, then B simply will fail to be linked before executing the program, as A does not have sufficient rights to use it.

By default, there's one search space for the application, and the entry point of the application can see all of the modules in this space. From there, every module linked from the entry point has access to _at most_ those modules, but nothing else. Any module may specify a restricted search space when linking a dependency. For example, to sandbox a module, and revoke its possibilities of using the network, file system, or other IO effects:

```
module App

uses Some.Untrusted.Module as um
  without Origami.IO.*

uses Some.Trusted.Module as tm
```

In this example, `tm` has access to the same set of modules that the linking module, `App`, does, and thus the same rights. It can provide all of its dependencies with the same rights, and it can do anything that `App` itself can. But `um` has access to a restricted subset of modules--all of those modules that `App` can use, without modules that implement any of the interfaces starting with `Origami.IO`. This effectively denies `um` from ever possibly doing any IO operation by default.

It's possible to amplify these rights by assigning a different search space to modules linked from `um` at the application description. And its also possible to amplify these rights by giving more powerful references to a function from `um` or one of its dependencies.

### Ambiguity

As it stands, the system does not preclude the existence of ambiguous linking in principle. All of the specified dependencies are potentially ambiguous, and it's fine for these to exist in source form. However, _executing_ or _compiling_ a program where the module to be linked is ambiguous is not allowed.

That is, if, when compiling a program P, there's any module M for which one of its dependencies resolve to more than one module, then P cannot be compiled, and the ambiguity must be resolved first.

Much of the source code in modern applications is not controlled by the programmer, and they may not even have access to the source code itself, so it's unreasonable to expect the programmer to modify the source code to resolve the ambiguity. Because of this, Origami uses external resolution rules.

Ambiguity resolution builds up on the idea of search spaces. A search space may contain ambiguous modules as long as the dependencies described in the source form resolve such ambiguity, and no ambiguous _linking_ happens.

In the case of ambiguous linking, the application programmer can specify a resolution in the application description, either by refining the search space (e.g.: by removing the conflicting module), or by specifying an absolute module to link to (which is what dependency pinning does).

## Packaging

Eventually applications need to be packaged for distribution in many forms: we may want to share the code with other people, in which case we'll generate a package manager package; we may want to run the application in a different computer, in which case we'll generate a binary package; etc.

Most of these concerns will be dealt with in a separate proposal, but we must look into a couple of them here as they directly affect module loading, trust, and search spaces.

### Origami packages

An Origami package is any directory that contains Origami source code. Optionally this directory may contain a package description, external modules (e.g.: JS or C++ modules for FFI), documentation, and other resource files.

All modules within a package (at any depth) are available for linking in the application's search space. We group modules through directories, which allows rules to be specified for groups of modules, instead of individual modules. Rules always use the relative path of the module to the package root.

For example, in a tree such as:

```
+ /
|--+ src/
|  `--o app.origami
`--+ vendor/
   |--o lib-a.origami
   `--o lib-b.origami
```

We have two groups of modules: `src` and `vendor`. A rule such as `vendor/*` applies to all modules in the `vendor` group (so both `lib-a` and `lib-b` at the same time). These rules may be used to define and refine search spaces.

### External packages

Packages may be installed by a package manager. The package manager for Origami reserves the group root `.origami-packages` for all externally downloaded packages. These are further categorised as: `group` > `source` > `organization`? > `name` > `version`.

Unlike npm (and some other flatter package managers), Origami has a generalised concept of **groups**. A group is any identifier that the application programmer decides to associate with some packages. For example, they may create a group for "development" packages, a group for "testing" packages, or a group for "low-trust" packages. Groups provide a simple way of specifying linking rules for many packages at the same time.

Following the group, we have a `source` for the package. This allows packages installed directly from a git repository to be subject to different rules than a package installed from some central or vetted repository.

Then we have `organization` and `name`. If the source supports a concept of organization (for example, GitHub's username), then that name is used, otherwise we use the special marker `.flat`. That's followed by the unique package name, which should be guaranteed somehow by the `source` and `organization`.

Finally, we have the `version` of the module. Many different versions of a module may be installed, and we allow rules to be defined for each of the versions directly.

> **TODO:** figure out a better name for this marker.

> **TODO:** Decide how dependencies specified in packages will be handled, and how it affects package rights.

## Security

Before we talk about what security properties the module system defined here can guarantee, we will talk about the security properties it most definitely does not guarantee.

Origami does not guarantee anything _outside of the process_. It assumes that the hardware and the file system can be trusted. It assumes that _external processes_ cannot read or tamper with Origami memory. And it makes no effort to mitigate these risks. This module system cannot help you avoid side-channel attacks, it cannot help you avoid something messing with your files, etc.

With that out of the way, let's look at the security properties that we do guarantee.

### Authority and trust

The module system provides a way of managing trust levels in Origami components, and providing them with authority to do things. Origami does not have a global namespace, and intrinsic objects/other language features are defined on a per-module basis. Intrinsics are always immutable, in the sense that behaviours in such objects cannot be changed (we do support safe contextual extensions, but those will not be covered here, and they're still capability secure).

A module in Origami has access to nothing by default. And it may _request_ access by specifying its dependencies as interface constraints. The application must them provide each module with the authority to do what it has to in order to work, by defining search spaces.

To make the language practical, we lessen this work by specifying that linked modules have, by default, the same rights as their parent modules. Because this would be a security disaster in the presence of external packages, we require at least the definition of search spaces on groups of external packages. This definition may simply be "the same as the application", for groups of packages you highly trust.

### Code execution

The top level of each module consists solely of declarations. This means that no code can possibly run except from the entry point of the application--instantiating an Origami module that contains no FFI is always safe.

### FFI boundary

FFI is a no-rules land. We cannot guarantee anything about the behaviour of the linked code written in a different language, with different rules. So, by default, there's only two pieces of code with access to FFI:

- Origami's runtime--because we do need it to work.
- The application's code.

For every other package, a configuration of whether they'll have access to the FFI or not must be explicitly made. It's also possible to revoke the default rights to FFI to any package. And revoke any transient rights to FFI as a result of the automatic search space definition.

## Practical affordances

### Generating interfaces from modules

As specified, the module system would require that programmers maintained both an interface description _and_ an implementation. In separate files. This is not really reasonable for most modules, where there's no expectation that the module will be implemented more than once. Most application modules are really application-specific, and would not benefit from this.

To avoid this problem, we allow interfaces to be generated from module definitions **if** there's only one module for such interface in the program. This way people only need to define an interface file for the types of modules for which they either want to share with other programmers, or for which they expect multiple implementations to exist.

### Caching & pinning linked modules

In order to execute an Origami application, the linker must resolve all of the constraints in dependencies to provide actual module implementations to every module. The cost of resolving these constraints grows with the number of modules and dependencies. On top of that, if the module files change, a different module may be linked _even if_ the constraints themselves haven't changed. If a linked module changes after programmers have executed the program a few times, the behaviour could be confusing.

To avoid this we allow linked modules to be pinned and cached. Which means that after we resolve the constraint once for a module, we will reuse the module previously linked until the programmer explicitly asks the linker to update the linked module--in which case we'll resolve the constraints again for that module.

Note that we _still_ have to check that the linked modules fulfill all of the requirements specified in the dependency. The only cost we avoid here is looking at the other modules in the search space.

## TODO: Open questions

- Types and generics (the type system is still not defined);
- The application description format is not defined;
- Threat modelling;
- What happens if people plug values from different implementations into some function?
