module Origami.Compiler.Syntax.Range

type Line = int
type Column = int
type Offset = int

type Range = 
  | R_Known of RangeInfo
  | R_Unknown
  
and RangeInfo = {
  span: Offset * Offset
  start: Line * Column
  stop: Line * Column
  source: string
  filename: string option
}