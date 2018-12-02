# [#0002] - Pattern matching

|             |      |
| ----------- | ---- |
| **Authors** | Quil |

- [ ] Discussion
- [ ] Implementation

## Summary

Pattern matching provides a generalised form of dispatching (selecting) an operation, while at the same time guaranteeing data coherence, being implementable efficiently, and supporting type refinements for a static type system.

For Origami, pattern matching provides a practical and coherent way of operating on data, defining functions, supporting evolution and extensibility, all while not violating any security guarantees made by the other parts of the language.

The goals of this idea are:

- To support operating on data in a coherent way, as defined contextually by the user of the data structure, that is efficient to implement and does not violate the security guarantees of the language (encapsulation boundaries, capabilities, etc).

- To support extensible functions (with local multi-dispatch), where separate definitions of the same function binding can be merged into a single definition, automatically selecting the correct one depending on the input, and without conflicts.

## References

- [May your data ever be coherent](https://www.youtube.com/watch?v=gVXt1RG_yN0)
  -- Daniel Spiewak, 2014

- [Matching objects with patterns](https://infoscience.epfl.ch/record/98468?ln=en)
  -- Burak Emir, Marin Odersky, and John Williams, 2006

- [Pattern matching for an object-oriented dynamically typed programming language](http://www.hpi.uni-potsdam.de/hirschfeld/publications/media/GellerHirschfeldBracha_2010_PatternMatchingForAnObjectOrientedAndDynamicallyTypedProgrammingLanguage_HPI36.pdf)
  -- Felix Geller, Robert Hirschfeld, and Gilad Bracha, 2010

- [Predicate dispatching: a unified theory of dispatch](https://homes.cs.washington.edu/~mernst/pubs/dispatching-ecoop98-abstract.html)
  -- Michael D. Ernst, Craig S. Kaplan, and Craig Chambers, 1998

## Patterns and pattern matching

In Origami, data is either a single thing (a scalar), or an aggregation of things (a record). It's easy to set expectations for scalar values. For example:

```
if n == 0 then ...
```

Sets the expectation that `n` must be the number `0`. But there's no way to do it for records. You can't just say:

```
if x.some_label and x.another_label then ...
```

This code doesn't run if `x` doesn't have those two labels, and it doesn't give the right answer if it does either. It says `if x.some_label is true, and x.another_label is true`, which is probably not what people want to be saying.

Pattern matching makes defining expectations for aggregate data (and how to manipulate such) practical, by providing these expectations in the form of "expected patterns". In other words, it's a series of "if the data kinda looks like this, then do this. If it looks like that, then do this other thing."

```
match value {
  case { x, y, z } -> handle_point3d(x, y, z);
  case { x, y } -> handle_point2d(x, y);
}
```

Patterns are tried top-to-bottom, in order. So first we look if the record has labels `x`, `y`, and `z`. And if it does, then we've found our code to run. Otherwise we check if it has labels `x`, and `y`. And if it does, we treat it as a point2d. Otherwise we fail.

## Origami patterns

The core language for patterns is as follows:

```
s in Strings
b in Booleans
n in Numbers
x in Variables
l in Labels

Literal l ::= s | n | b

Pattern p ::=
  | anything                                    -- always succeeds
  | literal <l>                                 -- succeeds if = l
  | [<p_1>, ..., <p_n>]                         -- fixed-arity array
  | [<p_1>, ..., <p_n> | <p_s>]                 -- variadic-arity array
  | { <l_1>: <p_1>, ..., <l_n>: <p_n> }         -- record
  | <e> { <l_1>: <p_1>, ..., <l_n>: <p_n> }     -- extractor
  | <x>                                         -- binding

Expression ++=
  | match <e> { case <p_1> [<x1_1>, ..., <x1_n>] when <e_1> -> <b_1>; ... }
  | fail

Block b ::= <s_1>; ...; <s_n>
```

Semantics follow pretty directly from this. Patterns match if they have the same inductive structure, and we record bound values in a binding environment.

```
B, match <e> with anything
--> B, true

B, match <l_1> with <l_2>
--> B, <l_1> = <l_2>

B, match [<e_1>, ..., <e_n>] with [<p_1>, ..., <p_n>]
--> B, (match <e_1> with <p_1>) and ... and (match <e_n> with <p_n>)

B, match [<e_1>, ..., <e_n> | <e_s>] with [<p_1>, ..., <p_n> | <p_s>]
--> B, (match <e_1> with <p_1>) and ... and (match <e_n> with <p_n>) and (match <e_s>) with <p_s>)

B, match { <l_1>: <e_1>, ..., <l_n>: <e_n> } with { <l_1>: <p_1>, ..., <l_n>: <p_n> }
--> B, (match <e_1> with <p_1>) and ... and (match <e_n> with <p_n>)

B, match <e> with <v> { <l_1>: <p_1>, ..., <l_n>: <p_n> }
--> B, match (<v>.unapply(<e>)) with { <l_1>: <p_1>, ..., <l_n>: <p_n> }

B, match <v> with <x>
--> B + <x> = <v>
```

And for match we just try all cases in sequence:

```
match <v> { case <p_1> when <e_1> -> <b_1>; ...; case <p_n> when <e_n> -> <b_n> }
--> if B, (match <v> with <p_1>) and <e_1>) then <b_1> (with bindings in B in scope)
    else match <v> { ...; case <p_n> when <e_n> -> <b_n> }

match <v> { }
--> fail
```

## Extractors

Pattern matching in most languages is not extensible, and it's also not possible to maintain encapsulation as it has to be able to look at the internals (structure) of a value. Origami enforces encapsulation using unforgeable references for projecting values out of a record structure, which gets rid of the encapsulation problems, but makes some patterns very cumbersome to write.

To address this, we use an idea inspired by Scala's extractors. Besides record patterns, we allow _extractor_ patterns. An extractor is just an object providing a method labelled `unapply`, invoked with the keys we're interested in and the value. The method then returns either a public record with (at least) the labels we've asked for, if it can provide one, or `Nothing`. The record pattern is then matched agains the returned value.

For example:

```
let Point = {
  unapply: (value, keys) => match value {
    case { x, y } -> { x: value.x, y: value.y };
    default -> Nothing
  }
};

match { x: 1, y: 2 } {
  case Point { x, y } -> x + y;
}
```

Evaluates to 3. But this does not work for:

```
match { x: 1 } {
  case Point { x } -> x;
}
```

Because even though we're only asking for `x`, `Point`'s extractor implementation requires the presence of an `y` label as well. Fixing this takes some work:

```
let Point = {
  unapply: (value, keys) => {
    let go = (record, keys) => match keys {
      case [ k, ...rest ] ->
        match value {
          case { (k): v } -> { go(record, rest) with (k): v };
          default -> Nothing;
        }
      case [] ->
        record;
    }

    go({}, keys);
  }
};

match { x: 1 } {
  case Point { x } -> x
}
```

Now this returns `1`, as expected.

### First-class patterns

Writing custom extractors is a common thing to, so Origami also provides first-class combinators for constructing them. Combinators just build extractors. The previous example could be written as:

```
let Point = {
  unapply: (value, keys) => {
    let pattern = keys.map(k => Pattern.project(k)).fold(Pattern.combine_record);
    pattern(value);
  }
}
```

> **TODO**: define the library of patterns.
