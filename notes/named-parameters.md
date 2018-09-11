# Named parameters

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
