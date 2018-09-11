# Operators

Operators in Origami are overloaded in that they're statically defined for built-in JavaScript types (primitives, functions, and arrays), and use method calls for objects.

The following table shows the translation for different operator syntaxes:

| Operator | Method name | Kind |
+----------+-------------+------|
| `a === b` | `a.$equals(b)` | Equality (prim, array) |
| `a =/= b` | `a.$notEquals(b)` | Equality (prim, array) |
| -- | -- | -- |
| `a >= b` | `a.$gte(b)` | Relational (prim) |
| `a > b` | `a.$gt(b)` | Relational (prim) |
| `a <= b` | `a.$lte(b)` | Relational (prim) |
| `a < b` | `a.$lt(b)` | Relational (prim) |
| -- | -- | -- |
| `a << b` | `a.$composeLeft(b)` | Function composition (fn) |
| `a >> b` | `a.$composeRight(b)` | Function composition (fn) |
| -- | -- | -- |
| `a ++ b` | `a.$concat(b)` | Concatenation (array, string) |
| -- | -- | -- |
| `a + b` | `a.$plus(b)` | Arithmetic (number, bigint) |
| `a - b` | `a.$minus(b)` | Arithmetic (number, bigint) |
| `a ** b` | `a.$power(b)` | Arithmetic (number, bigint) |
| `a * b` | `a.$multiply(b)` | Arithmetic (number, bigint) |
| `a / b` | `a.$divide(b)` | Arithmetic (number, bigint) |
| `a and b` | `a.$and(b)` | Logic (boolean) |
| `a or b` | `a.$or(b)` | Logic (boolean) |
| `not a` | `a.$not()` | Logic (boolean) |
| -- | -- | -- |
| `a[b]` | `a.$at(b)` | Indexed collection (array) |
| `a[b] <- c` | `a.$atPut(b)` | Indexed collection (array) |
