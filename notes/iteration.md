# Iteration

The basic iteration structures are all present, but without the familiar-for-some-confusing-for-many C-style syntax.

```
for each x of y { }
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
