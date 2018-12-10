module Purr.Compiler.Syntax.Parsing

open Fohm.Generated
open Purr.Compiler.Syntax.Cst

let tryParse source options = Purr.parse "Module" source options

let parse source options =
  match tryParse source options with
  | Ok v -> v
  | Error e -> failwith e
