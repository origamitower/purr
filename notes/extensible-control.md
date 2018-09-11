# Extensible control

Origami supports generators and asynchronous functions. Generators are not as powerful as deep coroutines, but they still make it possible to implement most of the control-flow structures you'd like to have (the ones that can be captured as one-shot continuations).

For example, a direct-style of monadic sequencing is implementable as a generator:

```
function Do(monad) {
  let run = *(gen) => (value) => {
    let { value: newValue, done } = gen.next(value);
    if done then
      newValue.chain(run(gen))
    else
      newValue;
  };

  (fn) => {
    let gen = fn();
    monad.of(gen).chain(run);
  }
}

function main(_) {
  let map = new Map([["a", 1], ["b", 2]])
  let tryGet = (key) =>
    if map.has(key) then new Just(map.get(key))
    else new Nothing();


  *Do {
    let a = yield map.get("a");
    let b = yield map.get("b");
    return new Just(a + b);
  };
  // => Just(3)
}
```

TODO: F#'s computation expressions?
