# Declarations

The top-level of any Origami module consists entirely of declarations. This is a deliberate deviation of TypeScript's more flexible top-level in order to better support modular programming and interactive tooling (for example, hot-patching in live-programming environments).

A declaration may be one of the following:

Declaration :
  - ImportDeclaration
  - ExportDeclaration
  - FunctionDeclaration
  - ClassDeclaration
  - InterfaceDeclaration

## Imports and Exports

Origami limits itself to ECMAScript modules, which are what TypeScript uses. This means that modules are non-parameterisable, second-class constructs, and module ids generally map to a file in the file system.

Definitions within a module are limited to that module by default, but a module may choose to export some of its definitions.

```origami
export double(x :: Integer) = x * 2;
```

Likewise, a module may choose to import exported definitions from another module.

```origami
import "./double" exposing double

define main()
  console.log(double(2));
```

Bindings may be renamed to avoid conflicts with bindings already defined in the module.

```origami
import "./double" exposing double as other_double

define double(x) = x + x

define main()
  console.log(other_double(2));
```

Alternatively, an imported module may be namespaced, so its exposed members can be accessed by its qualified name.

```origami
import "./double" as M

define main()
  console.log(M.double(2));
```

Default imports in ECMAScript modules are treated as any other named import. This makes using modules that rely on default exports a bit more cumbersome than the equivalent in TypeScript, but not much more so.

```origami
import "./module" exposing default as f

define main() = f()
```

Finally, you can import modules that are only used for side-effects.

```origami
import "./module"
```

TODO: Should we consider marking modules imported for side-effects more explicitly? If so, how?

### Syntax

ImportDeclaration :
  - `import` TextLiteral `as` Identifier
  - `import` TextLiteral `exposing` ImportBinding+
  - `import` TextLiteral

ImportBinding :
  - ModuleBinding `as` ModuleBinding
  - ModuleBinding

ModuleBinding :
  - Identifier ( KeywordDefinition+ )
  - InfixIdentifier
  - PrefixIdentifier
  - Identifier

KeywordDefinition : Identifier `:`

ExportDeclaration :
  - `export` FunctionDeclaration
  - `export` ClassDeclaration
  - `export` InterfaceDeclaration