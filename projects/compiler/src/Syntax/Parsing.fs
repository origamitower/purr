module Origami.Compiler.Syntax.Parsing

open Fohm.Generated
open Origami.Compiler.Syntax.Cst

let tryParse source options = Origami.parse "Module" source options

let parse source options =
  match tryParse source options with
  | Ok v -> v
  | Error e -> failwith e
