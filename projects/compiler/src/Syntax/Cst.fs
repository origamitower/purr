module Origami.Compiler.Syntax.Cst

open Origami.Compiler.Syntax.Range

type Module = {
  range: Range
  meta: Metadata
  id: ModuleId
  declarations: Declaration[]
}

and Metadata = {
  documentation: string
}

and ModuleId = {
  range: Range
  names: Name[]
}

and Name = 
  | N_Id of Range * string
  | N_Quoted of Range * string[]

and Declaration =
  | Import of Range * ModuleId * ImportBinding[]
  | Export of Range * ModuleId * ExportBinding[]
  | ExportLocal of Range * ExportLocalBinding[]
  | FFI of Range * Metadata * id: LitString * FFISignature[]
  | Record of Range * Metadata * Name * Field[]
  | Union of Range * Metadata * Name * UnionCase[]
  | Function of Range * Metadata * FunctionKind * FunctionSignature * returnType: Contract * body: Statement[]
  | Define of Range * Metadata * Name * Contract * Expression

and UnionCase = {
  range: Range
  meta: Metadata
  name: Name
  fields: Field[]
}

// ## Import/Export
and ImportBinding =
  | IB_Alias of Range * external: BindingSignature * local: BindingSignature
  | IB_Open of Range * local: Name

and ExportBinding =
  | EB_Alias of Range * external: BindingSignature * alias: BindingSignature
  | EB_Object of Range * alias: Name
  | EB_ReExport of Range

and ExportLocalBinding =
  | ELB_Alias of Range * local: BindingSignature * alias: BindingSignature

and BindingSignature =
  | BS_Unary of Range * UnaryOp * Name
  | BS_Binary of Range * BinaryOp * left: Name * right: Name
  | BS_AtPut of Range * container: Name * key: Name * value: Name
  | BS_At of Range * container: Name * key: Name
  | BS_Name of Range * Name


// ## FFI
and FFISignature =
  | FFI_Function of Range * Metadata * FunctionKind * FunctionSignature * returnType: Contract * ffiName: LitString
  | FFI_Define of Range * Metadata * Name * Contract * ffiName: LitString


// ## Data
and Field = {
  range: Range
  meta: Metadata
  isMutable: bool
  name: Name
  contract: Contract
  initializer: Expression option
}


// ## Functions
and FunctionKind =
  | FK_Generator
  | FK_Function

and FunctionSignature =
  | FS_Unary of Range * UnaryOp * Param
  | FS_Binary of Range * BinaryOp * left: Param * right: Param
  | FS_AtPut of Range * container: Param * key: Param * value: Param
  | FS_At of Range * container: Param * key: Param
  | FS_Named of Range * Name * FunctionParams

and FunctionParams =
  | FS_Fixed of Range * positional: Param[]
  | FS_Variadic of Range * positional: Param[] * spread: Param
  | FS_Keyword of Range * positional: Param[] * named: NamedParam[]

and Param = {
  range: Range
  name: Name
  contract: Contract
}

and NamedParam = {
  range: Range
  key: Name
  name: Name
  contract: Contract
  initializer: Expression option
}


// ## Statements and Expressions
and Statement =
  | Let of Range * Name * Contract * Expression
  | LetMutable of Range * Name * Contract * Expression
  | Assert of Range * Expression
  | Unreachable of Range * LitString
  | Foreach of Range * Name * Contract * Expression * Statement[]
  | While of Range * Expression * Statement[]
  | Until of Range * Expression * Statement[]
  | Repeat of Range * Statement[]
  | For of Range * Name * Contract * start: Expression * stop: Expression * Statement[]
  | ForBy of Range * Name * Contract * start: Expression * stop: Expression * by: Expression * Statement[]
  | Assign of Range * Name * Expression
  | ExprStmt of Range * Expression


and Expression =
  | IfThenElse of Range * test: Expression * consequent: Expression * alternate: Expression
  | Pipe of Range * left: Expression * right: Expression
  | Yield of Range * Expression
  | YieldAll of Range * Expression
  | BinaryExpr of Range * BinaryOp * left: Expression * right: Expression
  | UnaryExpr of Range * UnaryOp * Expression
  | EffectExpr of Range * Expression
  | Call of Range * callee: Expression * Argument[]
  | MethodCall of Range * object: Expression * message: Name * Argument[]
  | AtPut of Range * object: Expression * key: Expression * value: Expression
  | At of Range * object: Expression * key: Expression
  | Set of Range * object: Expression * property: Name * value: Expression
  | Get of Range * object: Expression * property: Name
  | New of Range * ctor: Expression * Argument[]
  | NewRecord of Range * ctor: Expression * RecordPair[]
  | ArrowFn of Range * FunctionKind * FunctionParams * returnType: Contract * Statement[]
  | Var of Range * Name
  | PartialHole of Range
  | MatchExpr of Range * Expression * MatchCase[]
  | Do of Range * handler: Expression option * Statement[]
  | LitExpr of Range * Literal
  | ArrayExpr of Range * isMutable: bool * items: ArrayItem[]
  | RecordExpr of Range * isMutable: bool * pairs: RecordPair[]
  | Parens of Range * Expression

and ArrayItem =
  | AI_Spread of Range * Expression
  | AI_Item of Range * Expression

and RecordPair = {
  range: Range
  key: Name
  value: Expression
}

and Argument =
  | A_Positional of Range * Expression
  | A_Spread of Range * Expression
  | A_Named of Range * key: Name * Expression


// ## Literals
and Literal =
  | L_String of Range * string
  | L_Boolean of Range * bool
  | L_Number of Range * Sign * string * string * Suffix
  | L_Null of Range

and LitString = {
  range: Range
  value: string
}

and Sign =
  | Unsigned
  | Positive
  | Negative

and Suffix =
  | Decimal
  | Integer
  | Float64


// ## Pattern matching
and MatchCase =
  | MC_Guarded of Range * Pattern * Expression * Statement[]
  | MC_Unguarded of Range * Pattern * Statement[]
  | MC_Default of Range * Statement[]

and Pattern =
  | P_Literal of Range * Literal
  | P_FixedArray of Range * Pattern[]
  | P_SpreadArray of Range * Pattern[] * spread: Pattern
  | P_Record of Range * PairPattern[]
  | P_Extractor of Range * object: Expression * Pattern[]
  | P_Guarded of Range * Pattern * Contract
  | P_Bind of Range * Name

and PairPattern = {
  range: Range
  key: Name
  pattern: Pattern
}



// ## Operators
and UnaryOp =
  | OpNot of Range

and BinaryOp =
  | OpAnd of Range
  | OpOr of Range
  | OpConcat of Range           // ++
  | OpComposeRight of Range     // >>
  | OpComposeLeft of Range      // <<
  | OpIn of Range
  | OpImplies of Range          // -->
  | OpPlus of Range             // +
  | OpPower of Range            // **
  | OpTimes of Range            // *
  | OpMinus of Range            // -
  | OpDivide of Range           // /
  | OpEqual of Range            // ==
  | OpNotEqual of Range         // /=
  | OpGreaterOrEqual of Range   // >=
  | OpGreater of Range          // >
  | OpLessOrEqual of Range      // <=
  | OpLess of Range             // <


// ## Types
and Contract =
  | C_Unknown of Range
  | C_Any of Range
  | C_Named of Range * Name
  | C_Project of Range * Contract * Name
  | C_Apply of Range * Name * Contract[]
  | C_Option of Range * Contract
  | C_Or of Range * left: Contract * right: Contract