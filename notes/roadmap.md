The language will be implemented in levels to allow bootstrapping and get things done quicklier.

## Level 0

A basic functional/imperative language. The bootstrapping compiler implements this.

Level 0 includes basic module support using ES6 modules:

```
import "id" as ID

# Translates to:
# import * from "id" as ID
```

Definition of data structures only as union types (for now):

```
union Maybe<'A>
  | Just(value :: 'A)
  | Nothing
end

# Translates to:
#
# enum Maybe_TAG { Just = 'Just', Nothing = 'Nothing' }
# abstract class Maybe<A> {
#   get "origami/type"() { return Maybe }
#   abstract "origami/tag": Maybe_TAG
#   readonly "origami/type-arg0": A
#
#   static Just(value) { return new Maybe_Just(value) }
#   static Nothing() { return new Maybe_Nothing() }
# }
# class Just<A> extends Maybe<A> {
#   readonly "origami/tag" = Maybe_TAG.Just
#   constructor(readonly value) {}
# }
# class Nothing extends Maybe<never> {
#   readonly "origami/tag" = Maybe_TAG.Nothing
# }
```

And the definition of functions:

```
define foo(a, b: c)
  ...
end

# Translates to:
#
# function foo$b(a, c) {
#   ...
# }
```

The statement-level includes all imperative constructs:

```
let x = y                                     #=> const x = y
let mutable x = y                             #=> let x = y

foreach x of y do ... end                     #=> for (const x of y) { ... }
repeat while expr do ... end                  #=> while (expr) { ... }
repeat until expr do ... end                  #=> do { ... } while (expr)
repeat with a from x to y by z do ... end     #=> for (let a = x; a < y; a += z) { ... }
repeat expr times ... end                     #=> for (let $_ = 0; $_ < times; ++$_) { ... }
repeat ... end                                #=> while (true) { ... }

try ... catch e with ... finally ... end      #=> try { ... } catch (e) { ... } finally { ... }
throw e                                       #=> throw e
assert x                                      #=> if (!x) throw $fail('x')
```

The expression-level only includes simple constructs:

```
foo(a, b: c)              #=> foo$b(a, c)
foo(a, b: ?)              #=> ($0) => foo$b(a, $0)
a.foo(b)                  #=> a.foo(b)
a.foo                     #=> $get(a, 'foo')            [no reflection]
a[foo]                    #=> $at(a, 'foo')             [no reflection]
a + b                     #=> $plus(a, b)
new Foo(a, b)             #=> new Foo(a, b)

a |> b                    #=> b(a)

a <- b                    #=> a = b

if a then b else c        #=> a ? b : c

do ... end                #=> (function(){ ... })()

# *specialised* pattern matching
match foo as Maybe with
  | Just(v) -> v
  | Nothing -> 1
end
# => if (foo['origami/type'] !== Maybe) throw $panic('Expected foo to be a Maybe')
#    switch (foo['origami/tag']) {
#      case 'Just': {
#        const v = foo.$unapply();
#        return v;
#      }
#
#      case 'Nothing': {
#        return 1;
#      }
#
#      default: throw $unreachable(foo, 'foo');
#    }

# Data structures
1_000.0<double>                   # double
1_000                             # big integer
1_000.0                           # big decimal

"foo"                             # string
true                              # boolean
[| 1, 2, 3 |]                     # array
[1, 2, 3]                         # list
[x: 1, x: 2, x: 3]                # map
{ x: e, y: z }                    # record
```

## Future

- Protocols (single-dispatch, Clojure-like)
- Classes (F#-like)
- Traits
- Proper pattern matching (with Extractors)
- Async/Await
- Generators
- Built-in testing
