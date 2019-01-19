module Purr.Core.Ast

type Name = string

type Program = {
  declarations: Declaration list
}

and Declaration =
  | Define of name: Name * body: Expression

and Expression =
  | Lambda of parameters: Name list * body: Expression 
  | Let of name: Name * init: Expression * body: Expression
  | Apply of callee: Expression * arguments: Expression list
  | Load of name: Name
  | Text of string
  | Integer of int
  | Float of float
  | Boolean of bool
  | Nothing
  | List of Expression list
  | Sequence of left: Expression * right: Expression
  | If of test: Expression * consequent: Expression * alternate: Expression
