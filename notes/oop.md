# Object-Oriented Programming

Most features in Origami come from OOP (even the more functional ones).

The OOP model in Origami is prototype-based (as in JavaScript), but syntactical support for traits, classes, and more is provided.

## Classes

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

## Traits

Traits are a modular unit of composition. A trait specifies the behaviours it contributes to a class, and the behaviours that it requires to contribute them. In other words, they're a parameterised mixin:

```
trait Ordered(x) {
  require x.compareTo(that);

  member self <= that = self.compareTo(that) <= 0;
  member self >= that = self.compareTo(that) >= 0;
  member self > that = self.compareTo(that) > 0;
  member self < that = self.compareTo(that) < 0;
}

class Num(x) {
  member self.compareTo(that) =
    if x < that.x then -1
    else if x > that.x then 1
    else 0;

  include Ordered(num) {
    member self.compareTo(that) = num.compareTo(that);
  }
}
```

The ordered trait is parameterised over a class `x`, and requires a method `compareTo` to be applied. Note that this _does not_ mean that the class has to implement a method `compareTo`, rather, you have to provide a method `compareTo` that will be local to the trait (it's not visible outside).

This allows traits to be modular, by allowing classes to rename and reconfigure any method within any trait _without_ breaking its expectations.

For example:

```
trait Equality(x) {
  require x.compareTo(that);

  member self === that = self.compareTo(that) === 0;
  member self =/= that = not (self === that);
}

class Num(x) {
  member self.compare(that) = ...;

  include Ordered(num) {
    member self.compareTo(that) = num.compareTo(that);
  }

  include Equality(num) {
    exclude _ =/= _;
    member self.compareTo(that) = num.compareTo(that);
  }
}
```

This results in a class that has the methods `compare`, `>`, `>=`, `<`, `<=`, and `===`.

Besides `exclude`, trait methods can be overriden (`override member ...`), and renamed `rename member ...`.

TODO: how can traits depend on each other?

## Contextual programming/Layers

(TBD)

Objects may play different roles in different situations. Contextual programming allows this, but any implementation would require a modular concept of layers.

Very rough idea so far (based on Siren):

```
// Interfaces define contextual parts
interface Equality {
  require self === that;
  member self =/= that = not (self === that);
}

// Layers define contexts
layer LooseEquals;
layer PreciseEquals;

// Extend attaches implementations to an object
extend Number {
  default Equality { ... }

  in LooseEquals {
    implement Equality { ... }
  }

  in PreciseEquals {
    implement Equality { ... }
  }
}

// Casting allows using the object in that context (it's a "view" of the object)
let a = 3 :: Equality @ LooseEquals;
3 === 3.1 // => true
```

- Layers should probably be parameterised, and those parameters should be available for the implementations.
- Interfaces and Layers should probably be composable so we can get bigger "views" of an object.
