# Modular units

Origami uses the same concept of modular compilation units that JavaScript introduced on the ES2015 version, so the semantics are the same, and it works with all existing JavaScript tools--sometimes requiring compilation to Node modules' format.

## Importing and exporting

Imports have slightly different syntax:

```
import "<module id>";
// => import "<module id>";

import "<module id>" exposing * as name;
// => import * as name from "<module id>";

import "<module id>" exposing a, b as c, default as d;
// => import d, { a, b as c } from "<module id>";
```

Unlike ES2015 we just treat default imports as any other regular named import. While that does make imports a bit more consistent, it's not really the reason for this: Origami just doesn't consider default imports/exports a good idea, and they're supported because JavaScript uses them.

Exports also feature slightly different syntax. For local names, again, we do away with the weird bracket-syntax and treat default exports like any other named export:

```
export name;
// => export { name };

export name as alias;
// => export { name as alias };

export default as alias;
// => export default alias;
```

Exporting symbols from another module can be done by importing them from the module, and them exporting them again, of course. But as a short-hand we something similar to JavaScript's `export-from`:

```
export "<module id>" exposing a, b as c, default as d;
// => export d, { a, b as c } from "<module id>";

export "<module id>" exposing *;
// => export * from "<module id>";

export "<module id>" exposing * as N;
// => import * as N from "<module id>"; export { N };
```

## Global namespace

JavaScript has a global namespace, with names automatically available everywhere. Since Origami uses the same semantics, it also does have this global namespace, however, it's an error to refer to any name that isn't declared _locally_.

```
function main() {
  let x = new Map();
}
```

The program above is perfect fine in JavaScript, even though `Map` isn't a local name. The Origami compiler will reject this program, however, because the name `Map` was not declared.

In order to have access to global names, you have to import them from special modules:

```
import es2015 exposing Map;

function main() {
  let x = new Map();
}
```

This makes it easier for tools to statically analyse your program, and documents your dependencies properly. Precise documentation isn't great just for humans, by documenting these dependencies, tools have much better information about your intent and can do a better job polyfilling these dependencies for different platforms without having to pull in everything.

Note that this does not solve other problems of having a global namespace. For example, we still can't have proper Ocap, side-by-side deployments of particular modules with different dependencies, etc. We can't solve these problems and be compatible with JavaScript at the same time (at least, not without paying a big price in both performance and developer ceremonies for using any feature).

## Top-level

A big difference between JavaScript and Origami is that Origami does not have a non-declarations at the top-level. This simplifies mutually-recursive modules by reducing the amount of edge cases that could prevent them.

There are a few cases where code _is_ executed during module instantiation:

- `import` statements, if the imported module has expressions/statements at the top-level;
- `class` declarations for both superclasses and dynamic properties, since class declarations are eager in JavaScript.

You do need some care on how you organise your modules in the presence of these two cases. Particularly, if you have a module `a` that exposes classes `A` and `B`, and a module `b` that exposes classes `C` and `D`. If `A` extends `C`, and `D` extends `B`, the dependencies can't be resolved, and you'd have to organise your modules differently.

Again, this is one of those problems that are difficult to solve because JavaScript already went for eager evaluation everywhere. Perhaps it would be different if it was designed with modules in mind from the start...

Note that it's always safe to _load_ Origami modules in the absence of these two cases, since we don't _run_ any user code.
