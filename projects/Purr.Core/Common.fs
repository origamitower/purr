module Purr.Core.Common

type ResultBuilder() =
  member __.Bind(x, f) = Result.bind f x
  member __.Return(x) = Ok x
 
let result = ResultBuilder()