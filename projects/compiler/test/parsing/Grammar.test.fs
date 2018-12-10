module Tests.Parsing.Grammar

open Tests.Matchers
open Fable.Import.Jest
open Fable.Import.Node.Exports
open Fable.Import.Node.Globals
open Purr.Compiler.Syntax.Parsing


describe "[Parsing] grammar validation" <| fun () ->
  let root = path.join(__dirname, "${entryDir}/../test/fixtures")
  let files = fs.readdirSync(unbox root)
  files |> Seq.iter (fun file ->
    it file <| fun () ->
      let filepath = path.join(root, file)
      let program = fs.readFileSync(filepath, "utf8")
      parse program { filename = Some filepath } |> ignore
  )