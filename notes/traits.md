# Traits

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
