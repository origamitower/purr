# Imperative Programming

Like JavaScript, Origami supports imperative programming and structured code-blocks.

## Iteration

The basic iteration structures are all present, but without the familiar-for-some-confusing-for-many C-style syntax.

```
foreach x of y { }
// => for (const x of y) { }

repeat while p { }
// => while (p) { }

repeat until p { }
// => while (!p) { }

repeat with x from a to b by c { }
// => for (let x = a; x <= b; x += c) { }

repeat { }
// => for ( ; ; ) { }
```

## Mutability

Origami favours immutability to make it easier to reason about data structures, in particular for more complex interactions (e.g.: concurrency). Mutability is an explicit opt-in:

```
// This is an error
let a = 1;
a <- a + 1; // assignment to constant variable a

// This is ok
let mutable a = 1;
a <- a + 1; // a is now 2
```

Arrays also have to be marked as mutable or they'll be a read-only view (note that read-only arrays do impose a performance penalty, but are completely compatible with any existing JavaScript code):

```
// This is an error
let x = [1, 2, 3];
x[0] <- 4;  // Cannot assign to read-only property "0"

// This is ok
let x = mutable [1, 2, 3];
x[0] <- 4;  // x is now [4, 2, 3]
```

Likewise, calling mutating methods in an immutable array is an error.

## Extensible control

Origami supports generators and asynchronous functions. Generators are not as powerful as deep coroutines, but they still make it possible to implement most of the control-flow structures you'd like to have (the ones that can be captured as one-shot continuations).

For example, a direct-style of monadic sequencing is implementable as a generator:

```
function Do(monad) {
  let run = *(gen) => (value) => {
    let { value: newValue, done } = gen.next(value);
    if done then
      newValue.chain(run(gen))
    else
      newValue;
  };

  (fn) => {
    let gen = fn();
    monad.of(gen).chain(run);
  }
}

function main(_) {
  let map = new Map([["a", 1], ["b", 2]])
  let tryGet = (key) =>
    if map.has(key) then new Just(map.get(key))
    else new Nothing();


  *Do {
    let a = yield map.get("a");
    let b = yield map.get("b");
    return new Just(a + b);
  };
  // => Just(3)
}
```

TODO: F#'s computation expressions?

## Error handling

TODO: Nothing defined here yet. There sure are a lot of things that can be improved in how JS does exceptions though.
