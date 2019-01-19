module Purr.Core.Ast

type Name = string

type Program = {
  declarations: Declaration list
}

and Declaration =
  | Define of name: Name * body: Expr

and AExpr =
  | Lambda of parameters: Name list * body: Expr
  | LoadLocal of Name
  | Text of string
  | Integer of int
  | Float of float
  | Boolean of bool
  | Nothing
  | List of AExpr list

and CExpr =
  | Apply of callee: AExpr * arguments: AExpr list
  | If of test: AExpr * consequent: Expr * alternate: Expr
  | AExpr of AExpr

and Expr =
  | Let of name: Name * init: CExpr * body: Expr
  | CExpr of CExpr
  | AExpr of AExpr
