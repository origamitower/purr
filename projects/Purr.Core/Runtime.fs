module Purr.Core.Runtime

open Purr.Core.Ast

type PurrValue =
  | Text of string
  | Integer of int
  | Float of float
  | Boolean of bool
  | Cons of head: PurrValue * tail: PurrValue
  | Nothing
  | Closure of Environment * parameters: Name list * body: Expression


and Environment(parent: Environment option) =
  let mutable bindings: Map<Name, PurrValue> = Map.empty

  member __.Lookup(name: string) =
    match (Map.tryFind name bindings), parent with
    | Some value, _           -> Some value
    | None,       Some parent -> parent.Lookup(name)
    | None,       None        -> None

  member __.Add(name: string, value: PurrValue) =
    match (Map.tryFind name bindings) with
    | None   -> bindings <- Map.add name value bindings
    | Some _ -> failwithf "Duplicated variable definition %s" name


[<RequireQualifiedAccess>]
module Environment =
  let lookup name (env: Environment) = env.Lookup name
  let add name value (env: Environment) = env.Add(name, value)
  let addAll pairs (env: Environment) = 
    pairs |> List.map (fun (k ,v) -> env.Add(k, v)) |> ignore

  let extend pairs (env: Environment) =
    let newEnv = Environment(Some env)
    addAll pairs newEnv
    newEnv

  let empty = Environment(None)

[<AutoOpen>]
module RuntimeType =   
  let nothing = Nothing

  let text x = Text(x)
  let integer x = Integer(x)
  let float x = Float(x)
  let bool x = Boolean(x)
  let cons x y = Cons(x, y)
  let closure env parameters body = Closure(env, parameters, body)

  let purrType value =
    match value with
    | Text _ -> "Text"
    | Integer _ -> "Integer"
    | Float _ -> "Float"
    | Boolean _ -> "Boolean"
    | Cons _ -> "List"
    | Nothing _ -> "Nothing"
    | Closure _ -> "Function"

  let asText value =
    match value with
    | Text v -> v
    | _ -> failwithf "Expected a Text, got %s" (purrType value)

  let asInteger value =
    match value with
    | Integer v -> v
    | _ -> failwithf "Expected an Integer, got %s" (purrType value)
  
  let asFloat value =
    match value with
    | Float v -> v
    | _ -> failwithf "Expected a Float, got %s" (purrType value)

  let asBoolean value =
    match value with
    | Boolean v -> v
    | _ -> failwithf "Expected a Boolean, got %s" (purrType value)

  let asList value =
    match value with
    | Cons (h, t) -> Cons (h, t)
    | _ -> failwithf "Expected a List, got %s" (purrType value)

  let asNothing value =
    match value with
    | Nothing -> Nothing
    | _ -> failwithf "Expected a Nothing, got %s" (purrType value)

  let asClosure value =
    match value with
    | Closure (e, p, b) -> Closure (e, p, b)
    | _ -> failwithf "Expected a Function, got %s" (purrType value)