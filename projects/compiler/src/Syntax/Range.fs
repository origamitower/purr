module Purr.Compiler.Syntax.Range

type Line = int
type Column = int
type Offset = int

type Range = 
  | R_Known of RangeInfo
  | R_Unknown
  member self.ToLocationString =
    match self with
    | R_Known(info) -> sprintf "(%s)" info.ToLocationString
    | R_Unknown -> ""
  
and RangeInfo = 
  {
    span: Offset * Offset
    start: Line * Column
    stop: Line * Column
    source: string
    filename: string option
  }
  member self.ToLocationString =
    let (line, column) = self.start
    sprintf "at line %d, column %d in %s"
            line 
            column 
            (Option.defaultValue "(unknown file)" self.filename)