# Pipes and infix application

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
