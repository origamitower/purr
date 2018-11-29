[<RequireQualifiedAccess>]
module Origami.Compiler.Core.Ast

open Origami.Compiler.Syntax.Range

type Fresh(prefix: string) =
  member __.Prefix = prefix

type Module = {
  range: Range
  meta: Metadata
  id: ModuleId
  declarations: Declaration list
}

and Metadata = {
  documentation: string
}

and Name = 
  | NBound of string
  | NFresh of Fresh

and ModuleId = {
  range: Range
  names: string list
}

and Declaration =
  | Import of Range * ModuleId * Name
  | Export of Range * local: Name * alias: Name
  | ReExport of Range * ModuleId
  | Function of Range * Metadata * Name * Parameters * Contract * Statement list
  | Generator of Range * Metadata * Name * Parameters * Contract * Statement list
  | Define of Range * Metadata * Name * Contract * Expression
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
  // ### Calls
  | Call of Range * callee: Expression * Arguments
  | Send of Range * object: Expression * message: Name * Arguments
  | New of Range * ctor: Expression * Arguments
  | NewRecord of Range * ctor: Expression * (Name * Expression) list

  // ### Locations
  | Assign of Range * Name * Expression
  | Get of Range * object: Expression * property: string
  | Set of Range * object: Expression * property: string * value: Expression

  // ### Loads
  | LoadFree of Range * Name
  | LoadLocal of Range * Name

  // ### Branching
  | IfThenElse of Range * test: Expression * consequent: Expression * alternate: Expression
  | Match of Range * Expression * MatchCase list
  | MatchFailed

  // ### Effects
  | Yield of Range * Expression
  | YieldAll of Range * Expression
  | Effect of Range * Expression
  | Do of Range * Expression * Statement list
  
  // ### Values
  | Array of Range * ArrayItem list
  | MutableArray of Range * ArrayItem list
  | Record of Range * RecordPair list
  | MutableRecord of Range * RecordPair list
  | Literal of Range * Literal
  | Lambda of Range * Parameters * Contract * Statement list
  | LambdaGenerator of Range * Parameters * Contract * Statement list

and Contract =
  | CUnknown of Range
  | CAny of Range
  | CNamed of Range * Name
  | CProject of Range * Contract * Name
  | CApply of Range * Name * Contract list
  | COption of Range * Contract
  | COr of Range * left: Contract * right: Contract


// ## Values
and ArrayItem =
  | AISpread of Range * Expression
  | AIItem of Range * Expression

and RecordPair = {
  range: Range
  key: string
  value: Expression
}

and Literal =
  | LString of Range * string
  | LBoolean of Range * bool
  | LNumber of Range * Sign * string * string * Suffix
  | LNull of Range

and Sign =
  | Positive
  | Negative

and Suffix =
  | Decimal
  | Integer
  | Float64

// ## Pattern matching
and MatchCase = {
  range: Range
  pattern: Pattern
  bindings: Name list
  guard: Expression
  body: Statement list
}

and Pattern =
  | PAny of Range
  | PLiteral of Range * Literal
  | PFixedArray of Range * arity: int
  | PSpreadArray of Range * arity: int
  | PRecord of Range * keys: string list
  | PExtractor of Range * object: Expression * arity: int
  | PGuarded of Range * Contract



// ## Data structures
and Field = {
  range: Range
  meta: Metadata
  isMutable: bool
  name: string
  contract: Contract
  initializer: Expression option
}

and UnionCase = {
  range: Range
  meta: Metadata
  name: string
  fields: Field list
}

// ## Functions
and Parameters =
  | Fixed of string list
  | Variadic of string list * string
  | Named of string list * (string * string) list

and Arguments =
  | APositional of Argument list
  | ANamed of Argument list * NamedArgument list

and NamedArgument = {
  range: Range
  key: string
  value: Expression
}

and Argument =
  | ArgPos of Expression
  | ArgSpread of Expression