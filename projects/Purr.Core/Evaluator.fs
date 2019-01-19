module Purr.Core.Evaluator

open Purr.Core.Ast
open Purr.Core.Runtime

type Generator<'a> =
  | Yield of value: 'a * continuation: ('a -> Generator<'a>)
  | Fail of reason: string
  | Done of value: 'a


module Generator =
  let ``return`` x = Done(x)

  let ``yield`` x k = Yield(x, k)

  let fail reason = Fail(reason)

  let rec bind g f =
    match g with
    | Yield (v, k) ->
        match k v with
        | Yield (v', k') -> bind (Yield(v', k')) f
        | Fail reason -> Fail reason
        | Done v -> f v
    | Fail reason -> Fail reason
    | Done v -> Done v

  let sequence m1 m2 =
    bind m1 (fun _ -> m2)

  let rec run g =
    match g with
    | Done v -> v
    | Fail reason -> failwith reason
    | Yield (v, k) -> run (k v)

  

type GeneratorBuilder() =
  member __.Bind(m, f) = Generator.bind m f
  member __.Return(v) = Generator.``return`` v
  member __.ReturnFrom(m) = m
    

let gen = GeneratorBuilder()

let ensureDiscarded value =
  match value with
  | Nothing -> Done Nothing
  | _ -> Generator.fail 
            """
            Only the last expression in a sequence may return a value.
            
            If you have `a; b`, and `a` returns a value, you must explicitly ignore it:
            
                a |> ignore;
                b
            """



let rec eval env (expr:Expression) : Generator<PurrValue> =
  gen {
    match expr with
    | Expression.Text v ->
        return (text v)

    | Expression.Integer v ->
        return (integer v)

    | Expression.Float v ->
        return (float v)

    | Expression.Boolean v ->
        return (bool v)

    | Expression.Nothing ->
        return (nothing)

    | List items ->
        return! Generator.fail "Not implemented."

    | Lambda (parameters, body) ->
        return (closure env parameters body)

    | Load name ->
        match Environment.lookup name env with
        | Some v -> return v
        | None -> return! Generator.fail (sprintf "%s is not defined" name)

    | Sequence (l, r) ->
        let! lvalue = eval env l
        return! Generator.sequence
                  (ensureDiscarded lvalue)
                  (eval env r)

    | If (test, consequent, alternate) ->
        let! testValue = eval env test
        if asBoolean testValue then
          return! eval env consequent
        else
          return! eval env alternate

    | Let (name, init, body) ->
        let! initValue = eval env init
        let newEnv = Environment.extend [name, initValue] env
        return! eval newEnv body

    | Apply (callee, args) ->
        let! calleeValue = eval env callee
        let fn = asClosure calleeValue
        return Nothing
  }

  