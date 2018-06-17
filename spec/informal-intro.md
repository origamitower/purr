# Introduction

Origami is a functional-first programming language that compiles to TypeScript. It supports expressing programs imperatively, functionally, or in an object-oriented manner. You can think of it as an alternative syntax for TypeScript which makes functional programming more tractable, and it's fully compatible with it. This means that you can use code (and typings!) written in TypeScript directly in any Origami module, and you can use Origami modules directly in TypeScript.

The language doesn't stop at just providing different syntax for TypeScript, however. While most of the constructs in Origami desugar to native TypeScript features, a few of them require an additional runtime, and provide new runtime semantics:

- Extensible pattern matching (based on \[Scala's Extractors]\[extractors]);
- Modular protocols (based on Harper et al's \[Modular Type Classes]\[mtc]);
- Compositional object-oriented programming with Traits (based on Schärli et al's \[Traits]\[traits]);
- Keyword functions/methods (based on Smalltalk's and Swift's);
- Built-in testing support (based on \[Pyret's]\[pyret]);
- Persistent collections;
- Arbitrary-precision arithmetic;

The design is influenced by many programming languages, including F#, Haskell, Clojure, Swift, and the Smalltalk family. This document briefly and informally explains the language.


## Functional programming

As a functional-first language Origami doesn't limit programs to be expressed functionally, but strongly encourages and support this style of programming.

```origami-stmt
let naturals = Lazy.iterate(? + 1, start_with: 1);
let factorial = Lazy.scan(naturals, from: 1, with: ? * ?) |> Lazy.enumerate(?, from: 1);

Lazy.take(10, from: factorial) |> Map.from(pairs: ?)
==> [ 1  : 1,
      2  : 2,
      3  : 6,
      4  : 24,
      5  : 120,
      6  : 720,
      7  : 5_040,
      8  : 40_320,
      9  : 362_880,
      10 : 3_628_800 ];
```

Disjoint unions and pattern matching are also supported:

```origami
union Tree<'A>
  | Branch(left :: Tree<'A>, right :: Tree<'A>)
  | Leaf(value :: 'A)
end

define sum(tree :: Tree<'A>) = match tree with
  | Tree.Branch(left, right) -> sum(left) + sum(right)
  | Tree.Leaf(value) -> value
where
  sum(Tree.Branch(Tree.Leaf(1), Tree.Branch(Tree.Leaf(2), Tree.Leaf(3))))
  ==> 6;
end
```

Besides the tools for defining and composing functions, Origami also provides built-in persistent structures for efficient data transformations without side-effects. For example, the following piece of code sorts a vector on the provided disjoint set of indices. All of the updates create new versions of the vector in (amortized) constant time.

```origami
define disjoint_sort(items :: Vector<Integer>, indices: :: Vector<Integer>) -> Vector<Integer>
  let update = ([index, value]) => Vector.update(items, at: index, put: value);
  let sorted_indices = indices |> Set.to_vector |> Vector.sort;
  let sorted_subset = Vector.map(items, with: (x) => items[x]) |> Vector.sort;

  Iterable.zip(sorted_indices, with: sorted_subset)
  |> Iterable.fold(?, from: items, using: update);
where
  disjoint_sort([7, 6, 5, 4, 3, 2, 1, 0], indices: [set| 6, 1, 7])
  ==> [7, 0, 5, 4, 3, 2, 1, 6];
end
```

Origami also has a more precise numeric tower by default than JavaScript's double-precision floating point type. Operations do not propagate numbers up or down the tower implicitly.

```origami-stmt
24 ** 24       ==> 1_333_735_776_850_284_124_449_081_472_843_776;    # big integer
24.0 ** 24.0   ==> 1_333_735_776_850_284_124_449_081_472_843_776.0;  # big decimal
24.0f ** 24.0f ==> 1.333735776850284e+33;                            # double
```

## Imperative programming

Origami supports the same imperative programming constructs JavaScript does, but is more explicit with mutability:

```origami-stmt
define sieve(limit_int :: Integer) -> Array<Integer>
  let limit = Integer.to_float(limit_int);
  let mutable is_prime = [false, false] ++ Array.with(size: limit - 2, default: () => true);
  
  repeat with i from 0.0f to Math.sqrt(limit) do
    if is_prime[i] then
      repeat with j from i ** 2.0f to limit by i do
        is_prime[i] <- false;
      end
    end
  end

  is_prime 
    |> Iterable.enumerate
    |> Iterable.filter(?, with: ([_, value]) => value === true)
    |> Iterable.map(?, with: ([_, value]) => value);
end
```

## Object-Oriented Programming

Origami supports all OOP features from TypeScript, but makes some things more explicit, like naming the receiver parameter.

```origami
interface IEquality<'A>
  member this::'A === that::'A => boolean
end

class Id<'A>(value :: 'A)
  console.log("Created Id with value", value);
with
  member self === other = value === that.value
  member self.unwrap() = value
  member self.map(f :: ('A) => 'B) = Id.of(f(value))
  static of(value :: 'A) = new Id(value)
end

class Id2<'A>(value :: 'A) extends Id<'A>
  super(value)
end
```

## Asynchronous programming

TODO: ...

