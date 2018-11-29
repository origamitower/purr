[<RequireQualifiedAccess>]
module Origami.Compiler.Core.Ast

open Origami.Compiler.Syntax.Range

type Module = {
  range: Range
  meta: Metadata
  id: ModuleId
  declarations: Declaration list
}

and Metadata = {
  documentation: string
}

and Name = string

and ModuleId = {
  range: Range
  names: Name list
}

and Declaration =
  | Import of Range * ModuleId * Name
  | Export of Range * local: Name * alias: Name
  | ReExport of Range * ModuleId
  | Function of Range * Metadata * Name * Parameters * Statement list
  | Generator of Range * Metadata * Name * Parameters * Statement list
  | Define of Range * Metadata * Name * Expression
  | Record of Range * Metadata * Name * Field list
  | Union of Range * Metadata * Name * UnionCase list

and Statement =
  | Let of Range * Name * Contract * Expression
  | LetMutable of Range * Name * Contract * Expression
  | Return of Range * Expression
  | Assert of Range * Expression
  | Unreachable of Range * string
  | Foreach of Range * Name * Contract * Expression * Statement list
  | For of Range * Name * Contract * start: Expression * stop: Expression * by: Expression * Statement list
  | Repeat of Range * Expression * Statement list
  | ExprStmt of Range * Expression

and Expression =
  | Call

and Field = {
  range: Range
  meta: Metadata
  isMutable: bool
  name: Name
  contract: Contract
  initializer: Expression option
}

and UnionCase = {
  range: Range
  meta: Metadata
  name: Name
  fields: Field list
}

and Parameters =
  | Fixed of Name list
  | Variadic of Name list * Name
  | Named of Name list * (Name * Name) list
