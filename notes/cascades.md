# Cascades

Object-oriented methods in JavaScript and other imperative languages generally return void, which makes composing different method calls impossible. Cascades work around this problem by allowing side-effecting methods to be composed in a similar way to the fluent interfaces:

```
// Instead of:
someObject.foo();
someObject.bar <- qux;
someObject.otherMethod(...a);

// You can use cascades:
someObject
  ..foo()
  ..bar <- qux
  ..otherMethod(...a);
```
