# Pattern matching

Origami provides pattern matching for core JavaScript built-ins (strings, booleans, numbers, null, and arrays), and extensible pattern matching for custom objects using the concept of Extractors.

While the way pattern matching is done for the core-types is fixed, for custom objects the object itself decides how to participate in pattern matching (which allows it to retain control over its own data) by implementing the methods `unapply` for non-nullary matches, and `hasInstance` for nullary matches.

```
class Point(x, y) {
  static unapply(value) {
    if Mirror.on(value).isInstanceOf(Point) then
      [x, y, x + y]
    else
      null;
  }
}

function foo() {
  match new Point(1, 2) {
    case Point(a, b, c): (a + b) - c;
    default: "No matches";
  }
  // Always returns 0
}
```

Data classes simplify this task a lot by generating getters, extractors, and common operators for you. If you're familiar with data classes in Kotlin, case classes in Scala, or Haskell's data constructors, they're very similar:

```
data class Point2d(x, y) {}

function foo() {
  match new Point2d(1, 2) {
    case Point2d(x, y): x + y;
  };
  // => 3
}
```
