# Functional and Function-based programming

Origami extends JavaScript's support for functional/function-based programming by adding extensible pattern matching, syntactic partial application, pipes, modules, and named parameters.

## Pattern matching

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

## Pipes and infix application

Long function chains can be expressed as pipes instead of nested calls:

```
f(g(h(x), y), z);

// Can be expressed in a more readable way as:
h(x)
|> (a) => g(a, y)
|> (a) => f(a, z);
```

Some function applications can be more readably expressed as infix application:

```
slice("hello", 1, 2);

// With infix
"hello" `slice(1, 2);
```

## Syntactic partial application

Origami implements syntactic partial application by allowing function application to have "holes" in them. This is very similar to Scala's partial application and Scheme's cut/cute operator.

```
[1, 2, 3].map((x) => x + 1);

// Can be expressed as:
[1, 2, 3].map(? + 1);
```

Syntactic partial application is particularly nice to use with pipes:

```
reduce(map(sort(slice(getContents(), 0, 10), compare `on(date)), getRank), (x, y) => x + y, 0);

// Can be expressed as:
getContents()
  |> slice(?, 0, 10)
  |> sort(?, compare `on(date))
  |> map(?, getRank)
  |> reduce(?, (? + ?), 0);
```

## Named parameters

Like OCaml, Dart, and many other languages, Origami supports named parameters:

```
function show(value, depth: depth = 1, visited: visited = new Set()) {
  ...
}
```

Named parameters are implemented as just a trailing object parameter, so the following calls are equivalent:

```
show(a, { depth: 1, visited: new Set([b]) });
show(a, depth: 1, visited: new Set([b]));
```
