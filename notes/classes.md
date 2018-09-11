# Classes

Classes are a declarative syntax for defining a factory for similar objects, and they compile to a similar construct in JavaScript.

There aren't many semantic differences, but the major syntactic/semantic differences are:

- Origami has a concept of "fields", which are local properties in a class body. This doesn't mean that they're private, since JavaScript doesn't have private members yet, but they use a prefix to avoid clashing with other properties.

- The receiver parameter is _explicit_ in all Origami methods. This avoids all of the problems related to implicit receiver arguments (`this` in JS) and makes Origami easier to teach.

- All other definitions within a class are methods. There are no public-facing properties that are not methods.

Class syntax also highlight the existence of a single constructor:

```
class Tagged(tag) {}

class Point(x, y) extends Tagged("point") {
  member self.x = x;
  member self.y = y;
}
```

This expands to (roughly) the following JS:

```js
class Tagged {
  constructor(tag) {
    this.$$tag = tag;
  }
}

class Point extends Tagged {
  constructor(x, y) {
    super("point");
    this.$$x = x;
    this.$$y = y;
  }

  get x() {
    return this.$$x;
  }
  get y() {
    return this.$$y;
  }
}
```

Because classes that work as records are such a common thing, Origami also has a concept of a Data Class. A class meant to hold data (and maybe provide behaviours about that data). This is similar to Scala's case classes, Kotlin's data classes, and Haskell/MLs's data constructors.

```
data class Point2d(x, y) {
  member self + that = new Point2d(x + that.x, y + that.y);
}
```

This is equivalent to the following (tedious) JS:

```
class Point2d {
  constructor(x, y) {
    this.$$x = x;
    this.$$y = y;
  }

  get x() { return this.$$x }
  get y() { return this.$$y }

  static unapply(object) {
    if (object.instanceof === Point2d) {
      return [this.$$x, this.$$y];
    }
  }

  static hasInstance(object) {
    return object instanceof Point2d;
  }

  // <more generated methods for equality, representation, etc. here>

  $concat(that) {
    return new Point2d(this.$$x + that.x, this.$$y + that.y);
  }
}
```

Only getters are generated for data classes, but the fields themselves are mutable, and you can implement your own setters if you decide that a particular field needs to be mutated from the outside.
