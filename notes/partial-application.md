# Syntactic partial application

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
