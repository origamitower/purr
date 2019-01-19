
#load "Common.fs"
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
  let load n = LoadLocal n
  let str t = Text t
  let int v = Integer v
  let float v = Float v 
  let bool v = Boolean v
  let nothing = Nothing
  let list v = List v
  let pif t c a = If(t, c, a)
  let cexpr c = Expr.CExpr c
  let aexpr a = Expr.AExpr a
  let caexpr a = CExpr.AExpr a
  let loadMod n = LoadModule n

let rec runTracing g =
  match g with
  | Done r ->
      printfn "Done: %A" r
      r
  | Fail e -> failwith e
  | Yield (v, k) ->
      printfn "Yield: %A" v
      runTracing (k v)


let TestMod = Runtime.PurrModule([
  "if_test", cexpr (pif (bool true)
              (cexpr (pif (bool false) (aexpr (int 1)) (aexpr (int 2))))
              (aexpr (int 2)))
              
  "let_test", plet "x" (caexpr (int 1))
                (plet "y" (caexpr (int 2))
                  (aexpr (list [(load "x"); load "y"])))
])

let rootEnv = Runtime.Environment.empty TestMod

evalExpr rootEnv (cexpr (loadMod "let_test"))
|> runTracing


