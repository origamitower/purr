# Mutability

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
