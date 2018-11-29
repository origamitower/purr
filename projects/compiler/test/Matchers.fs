module Tests.Matchers

open Fable.Import.Jest

let inline (-->) l r = expect.Invoke(l).toEqual(r)

let inline Expect x = expect.Invoke(x).toBeTruthy()

let inline Throws x = expect.Invoke(x).toThrow()