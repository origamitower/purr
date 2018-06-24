This file provides a short overview of each Origami feature.

# Declarations

## Unions

General syntax:

```
union $NAME <$TYPE ...>
  case $VARIANT_0 ($PARAM ...)
  ...
  case $VARIANT_N ($PARAM ...)
end
```

Example:

```
union Maybe<'A>
  case Just(value :: 'A)
  case Nothing()
end
```

Translates to the general pattern of a base abstract class with several subclasses. The specific representation may change later after I have the time to better analyse how each JS VM handles the possible representations and their uses.

Current tentatively translates to:

```ts
abstract class Maybe<A> {
  abstract 'origami/tag': 'Just' | 'Nothing';
  readonly 'origami/type/arg0'!: A;

  static get Just() { return Just }
  static get Nothing() { return Nothing }

  static hasInstance(value: any): value is Maybe<any> {
    return value instanceof Maybe;
  }
}

class Just<A> extends Maybe<A> {
  readonly 'origami/tag' = 'Just';
  constructor(readonly value: A) { super() }

  unapply(): [A] {
    return [this.value];
  }

  static hasInstance(value: any): value is Just<any> {
    return value instanceof Just;
  }
}

class Nothing extends Maybe<never> {
  readonly 'origami/tag' = 'Nothing';
  
  static hasInstance(value: any): value is Nothing {
    return value instanceof Nothing;
  }

  unapply(): never[] { 
    return [];
  }
}
```

> TODO: think about runtime reflection capabilities.


## Modules

Origami uses the same modules as ES2015. The import syntax is a bit different to help with intelligent auto-completion.

General syntax:

```
import "$ID"
import "$ID" as $BINDING
import "$ID" exposing ($NAME_0 as $ALIAS_0, ..., $NAME_N as $ALIAS_N)
```

Translates to the usual:

```ts
import "$ID";
import * as $BINDING from "$ID";
import { $NAME_0: $ALIAS_0, ... } from "$ID";
```


## Function definitions

Origami may only have declarations at the top-level, so function definitions translate to regular function declarations. Generators and asynchronous functions are supported. Furthermore Origami supports infix and keyword (Swift-style) functions by mangling the names.

As a functional language the last expression statement is returned by default in Origami.

General syntax:

```
define $NAME($PARAM ...) -> $RET
  STMT...
end

define async $NAME($PARAM ...) -> Promise<$RET>
  STMT...
end

define generator $NAME($PARAM ...) -> $RET
  STMT...
end
```

Example:

```
define async plus(left: number, right: number) -> number
  left + right
end
```

### Operators

| Operator  | Name                       | Translation                      |
| --------- | -------------------------- | -------------------------------- |
| a === b   | Equals                     | $equals(a, b)                    |
| a =/= b   | Not equals                 | $not_equals(a, b)                |
| a > b     | Greater than               | $gt(a, b)                        |
| a >= b    | Greater or equal to        | $gte(a, b)                       |
| a < b     | Less than                  | $lt(a, b)                        |
| a <= b    | Less or equal to           | $lte(a, b)                       |
| a + b     | Plus                       | $plus(a, b)                      |
| a - b     | Minus                      | $minus(a, b)                     |
| a * b     | Times                      | $times(a, b)                     |
| a / b     | Divide                     | $div(a, b)                       |
| a ++ b    | Concatenation              | $concat(a, b)                    |
| a and b   | Logical conjunction        | $and(a, b)                       |
| a or b    | Logical disjunction        | $or(a, b)                        |
| not a     | Logical negation           | $not(a)                          |
| a[b]      | Subscript                  | $at(a, b)                        |
| a[b] <- c | Subscript update           | $at_put(a, b, c)                 |
| a ==> b   | Assert a equals to b       | $assert_equals(a, b)             |

Note that introduction and elimination of operator forms use the *same syntax*. That is, you write:

```
define (array :: Array<'A>)[index :: number] <- value :: 'A
  ...
end

some_array[index] <- value
```

And not:

```
define $at_put(array, index, value)
  ...
end

some_array[index] <- value
```

(the second isn't even valid syntax)

This should keep things simple and straightforward for anyone writing Origami programs and not using them from TypeScript directly, rather than always having to think about things like "magic methods" (ehem, Python, Lua, and JavaScript, I'm looking at you).

## Interfaces

Aside from making required and optional members a prefix keyword, interfaces in Origami map directly to interfaces in TypeScript.

Example:

```
interface Foo<'A>
  required (self :: 'C).bar :: ('A) -> 'B
  optional self.qux :: 'A
end
```

Translates to:

```ts
interface Foo<A> {
  bar<B, C>(this: C, _0: A): B;
  qux?: A
}
```

## Classes

Classes are defined in a similar manner to F#, they map almost directly to TypeScript classes for now. Note that all parameters create internal fields in the class with mangled versions of those names.

Example:

```
class Point2d(x: number, y: number)
  mutable field z :: number;

  z <- x + y;
  console.log("Created point with x:", x, "y:", y);
with
  member _.x = x
  member _.y = y
  
  member _.z = z
  member self.z <- new_value
    z <- self.inc(new_value)
  end

  private member _.inc(x :: number) = x + 1
  
  static with(x: x :: number, y: y :: number)
    new Point2d(x, y)
  end
end

let p1 = new Point2d(1, 2);
let p2 = Point2d.with(x: 1, y: 2);
```

Translates to:

```ts
class Point2d {
  private _x: number;
  private _y: number;
  private _z: number;

  constructor(x: number, y: number) {
    const $this = this;

    $this._x = x;
    $this._y = y;
    $this._z = $this._x + $this._z;
    console.log("Created point with x:", $this.x, "y:", $this.y);
  }

  get x() { 
    const $this = this;
    return $this._x 
  }
  get y() { 
    const $this = this;
    return $this._y 
  }
  get z() { 
    const $this = this;
    return $this._z 
  }
  set z(new_value: number) {
    const $this = this;
    const self = this;
    $this._z = self.inc(new_value);
  }

  private inc(x: number) {
    const $this = this;
    return $plus($this.x, 1);
  }

  static with$x$y(x: number, y: number) {
    return new Point2d(x, y);
  }
}

const p1 = new Point2d(1, 2);
const p2 = Point2d.with$x$y(1, 2);
```

# Statements

## Variable declaration

Immutability is favoured, and mutability can be opted-in explicitly:

```
let x = 1;
let mutable y = 2;
```

Translates to:

```ts
const x = 1;
let y = 2;
```

## Iteration

All sensible iteration forms from JavaScript are supported.

### Simple iteration

For loops:

```
repeat with x from 1 to 10 by 1 do
  console.log(x)
end
```

Translate to:

```ts
for (let x = 1; $lt(x, 10); ++x) {
  console.log(x);
}
```

While loops:

```
repeat while x < 10 do
  console.log(x);
  x <- x + 1;
end

repeat until x > 10 do
  console.log(x);
  x <- x + 1;
end

repeat
  do_something();
  break;
end
```

Translates to:

```ts
while ($lt(x, 10)) {
  console.log(x);
  x = x + 1;
}

while (!($gt(x, 10))) {
  console.log(x);
  x = x + 1;
}

while (true) {
  do_something();
  break;
}
```


### Iterators and asynchronous iterators

```
foreach x of y do
  console.log(x);
end

foreach x of y async do
  console.log(await x);
end
```

Translates to:

```ts
for (const x of y) {
  console.log(x);
}

for async (const x of y) {
  console.log(await x);
}
```

## Exception handling

Origami supports exception handling in the same way as TypeScript, and exception handling at the expression/value level with Result monads.

```
try
  do_something()
catch error with
  handle(error)
finally
  cleanup()
end
```

Translates to the usual:

```ts
try {
  do_something();
} catch (error) {
  handle(error);
} finally {
  cleanup();
}
```

You can also trap an error-throwing expression into a Result monad:

```
trap do_something();
```

Translates to (roughly):

```ts
(() => {
  try {
    return Result.ok(do_something());
  } catch (error) {
    return Result.error(error);
  }
})()
```

Origami also proviea an `assert` statement that provides useful error messages:

```
assert x > y;
```

Translates to:

```ts
if (!($gt(x, y))) {
  throw new AssertionError(`Assertion failed: x > y`);
}
```

## Expressions

### Partial application

Partial application is supported in a variant of Scheme's "cute" operator. Holes are specified with `?`.

```
some_function(?, 2, ?);
```

Translates to:

```ts
($0, $1) => some_function($0, 2, $1);
```

It's not possible to specify holes to be filled outside of the normal source ordering. You have to use an actual function definition for that.

### Function application

Function application works the same as in JavaScript for regular functions:

```
foo(a, b, c)
```

Translates to:

```ts
foo(a, b, c)
```

Operators work similarly, but with the names mangled according to the rules defined previously in this document:

```
a and b[c]
```

Translates to:

```ts
$and(a, $at(b, c))
```

Keyword functions include all keywords in their name separated by `$`:

```
fold(array, from: 0, with: ? + ?)
```

Translates to:

```ts
fold$from$with(array, 0, ($0, $1) => $0 + $1)
```

### Class construction

Class construction translates 1:1 to TypeScript. So:

```
new Point2d(1, 2)
```

Translates to:

```ts
new Point2d(1, 2)
```

### If/Else

Origami only has expression-level if/else branching, and it translates to JavaScript's conditional operator:

```
if a then b else c
```

Translates to:

```ts
a ? b : c
```

### Function definition

Functions can be defined in the usual way. We use `->` instead of `=>` though. Lambdas can't have keywords:

```
(a, b, c) -> a + b + c
```

Translates to:

```ts
(a, b, c) => $plus(a, $plus(b, c))
```

### Pipes

Combining functions can be done with pipes, similar to F# and other languages.

```
foo |> bar(?, 2) |> baz;
```

Translates to:

```
baz(($0) => bar(foo, 2));
```

### Data structures

Origami has more built-in types than JavaScript, so some of these types will be implemented by the Origami runtime.

```
1_000_000         (arbitrary-precision integer, runtime impl)
1_000_000.00      (arbitrary-precision decimal, runtime impl)
1_000_000.00f     (double-precision floating point, JS native type)

"string"          (string, JS native type)
true, false       (boolean, JS native type)

[a, b, c]         (Immutable Vector, red-black tree backed, by Immutable.js)
[a: b, c: d]      (Immutable map, red-black tree backed, by Immutable.js)
[| a, b, c |]     (Mutable array, JS native type)
{ a: b, c: d }    (Mutable record, JS native type)
```

### Statement block expression

Statement blocks can be used as an expression by wrapping in a `do` block:

```
do
  let x = 1;
  let y = 2;
  x + y
end
```

Translates to:

```ts
(() => {
  const x = 1;
  const y = 2;
  return $plus(x, y);
})
```

And will translate to do-expressions if that ever gets added to the language.

### Pattern matching

Origami provides pattern matching based on Scala's extractors. Types can participate in pattern matching by implementing a static `hasInstance` and a member `unapply`. There's no exhaustiveness checking, but patterns include a *runtime guard* for that.

```
match expr with
  case Maybe.Just(value) do [value + 1]
  case [a, b, ...c]      do [a] ++ [b] ++ c
  case 1                 do [1]
  case anything          do [0]
end
```

Translates roughly to:

```ts
(() => {
  const $0 = expr;
  
  const MaybeJust = Maybe.Just
  if (MaybeJust.hasInstance($0)) {
    const [value] = $0.unapply();
    return [$plus(value, 1)];
  }

  if ($is_vector($0)) {
    const a = $0.at(0);
    const b = $0.at(1);
    const c = $0.slice(2);
    return vector(a).concat(vector(b)).concat(c);
  }

  if ($equals($0, 1)) {
    return [1];
  }

  return [0];
  throw new NonExhaustivePatternError(`Failed to match ${$0}`);
})()
```