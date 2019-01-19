module Purr.Core.Runtime

open Purr.Core.Ast

type PurrValue() = class end


type Environment(parent: Environment option) =
  let mutable bindings: Map<Name, PurrValue> = Map.empty

  member __.Lookup(name: string) =
    match (Map.tryFind name bindings), parent with
    | Some value, _           -> Some value
    | None,       Some parent -> parent.Lookup(name)
    | None,       None        -> None

  member __.Add(name: string, value: PurrValue) =
    bindings <- Map.add name value bindings


[<RequireQualifiedAccess>]
module Environment =
  let lookup name (env: Environment) = env.Lookup name
  let add name value (env: Environment) = env.Add(name, value)
  

module Objects =

  type Text(value: string) =
    inherit PurrValue()


  type Integer(value: int) =
    inherit PurrValue()


  type Float(value: float) =
    inherit PurrValue()


  type Boolean(value: bool) =
    inherit PurrValue()


  type Cons(head: PurrValue, tail: PurrValue) =
    inherit PurrValue()


  type Nothing() =
    inherit PurrValue()


  type Closure(env: Environment, parameters: Name list, body: Expression) =
    inherit PurrValue()

   
  let nothing = Nothing()


