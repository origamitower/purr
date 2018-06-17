# Program structure and organisation

Origami programs are organised in files with the `.ori` or `.orix` extensions, the latter being used for modules that include JSX portions. Each file defines an ECMAScript-compatible module, and may only contain meta-data or top-level declarations.

Interactive programming and scripting are only supported only by specialised tools, or by writing a separate entry-point in TypeScript or JavaScript.

A module will generally start by providing the language version that it uses, and may provide additional meta-data for the compiler. That's followed by a sequence at least one declaration. A minimal module may look like this:

```
% version: 1

export main() = console.log("Hello, world.")
```

## Syntax

Module : File_Metadata? Declaration+

File_Metadata : % identifier : SimpleLiteral

