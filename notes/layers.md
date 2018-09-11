# Contextual programming/Layers

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
