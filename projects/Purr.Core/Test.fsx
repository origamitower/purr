
#load "Ast.fs"
#load "Runtime.fs"
#load "Evaluator.fs"

open Purr.Core
open Purr.Core.Evaluator

[<AutoOpen>]
module dsl =
  open Purr.Core.Ast

  let plet n i b = Let(n, i, b)
  let lambda p b = Lambda(p, b)
  let apply c a = Apply(c, a)
  let load n = Load n
  let str t = Text t
  let int v = Integer v
  let float v = Float v 
  let bool v = Boolean v
  let nothing = Nothing
  let list v = List v
  let (./) a b =  Sequence(a, b)
  let pif t c a = If(t, c, a)

let rec runTracing g =
  match g with
  | Done r -> r
  | Fail e -> failwith e
  | Yield (v, k) ->
      printfn "Yield: %A" v
      runTracing (k v)

let program = 
  pif (bool true)
    (int 1)
    (int 2)


eval (Runtime.Environment.empty) program
|> runTracing



