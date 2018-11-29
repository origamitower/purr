module Origami.Compiler.Passes.CstToCore

open Origami.Compiler.Syntax.Range
open Origami.Compiler.Syntax
open Origami.Compiler.Core

let unknown = Ast.CUnknown(R_Unknown)
let emptyMeta : Ast.Metadata = { documentation = "" }

let lowerName (n:Cst.Name) : Ast.Name =
  match n with
  | Cst.N_Id(_, n) -> Ast.NBound n
  | Cst.N_Quoted(_, ns) -> Ast.NBound (String.concat " " ns)

let nameToString (n:Cst.Name) : string =
  match n with
  | Cst.N_Id(_, n) -> n
  | Cst.N_Quoted(_, ns) -> String.concat " " ns

let astNameToString (n:Ast.Name) : string =
  match n with
  | Ast.NBound n -> n
  | Ast.NFresh _ -> failwithf "[ERROR:internal] Can't translate a fresh name to a string. This is an internal error in the compiler."

let lowerUnaryOp (op:Cst.UnaryOp) : Ast.Name =
  match op with
  | Cst.OpNot r -> Ast.NBound "op_not"

let lowerBinaryOp (op:Cst.BinaryOp) : Ast.Name =
  match op with
  | Cst.OpAnd r -> Ast.NBound "op_and"
  | Cst.OpOr r -> Ast.NBound "op_or"
  | Cst.OpConcat r -> Ast.NBound "op_concat"
  | Cst.OpComposeRight r -> Ast.NBound "op_compose_right"
  | Cst.OpComposeLeft r -> Ast.NBound "op_compose_left"
  | Cst.OpIn r -> Ast.NBound "op_in"
  | Cst.OpImplies r -> Ast.NBound "op_implies"
  | Cst.OpPlus r -> Ast.NBound "op_plus"
  | Cst.OpPower r -> Ast.NBound "op_power"
  | Cst.OpTimes r -> Ast.NBound "op_times"
  | Cst.OpMinus r -> Ast.NBound "op_minus"
  | Cst.OpDivide r -> Ast.NBound "op_divide"
  | Cst.OpEqual r -> Ast.NBound "op_equal"
  | Cst.OpNotEqual r -> Ast.NBound "op_not_equal"
  | Cst.OpGreaterOrEqual r -> Ast.NBound "op_greater_or_equal"
  | Cst.OpGreater r -> Ast.NBound "op_greater"
  | Cst.OpLessOrEqual r -> Ast.NBound "op_less_or_equal"
  | Cst.OpLess r -> Ast.NBound "op_less"

let nameAtPut r = Ast.NBound "op_at_put"

let nameAt r = Ast.NBound "op_at"

let lowerMeta (m:Cst.Metadata) : Ast.Metadata =
  { documentation = m.documentation }

let lowerModuleId (id:Cst.ModuleId) : Ast.ModuleId =
  {
    range = id.range
    names = id.names |> Array.toList |> List.map nameToString
  }

let nameModule (m:Ast.ModuleId) =
  m.names |> List.tryLast |> Option.defaultValue "ref"

let checkBindingArity (l:Cst.BindingSignature) (r:Cst.BindingSignature) =
  match (l, r) with
  | Cst.BS_Unary(_, opl, _), Cst.BS_Unary(_, opr, _) when opl = opr ->
      (l, r)
  | Cst.BS_Binary(_, opl, _, _), Cst.BS_Binary(_, opr, _, _) when opl = opr ->
      (l, r)
  | Cst.BS_AtPut _, Cst.BS_AtPut _
  | Cst.BS_At _, Cst.BS_At _
  | Cst.BS_Name _, Cst.BS_Name _ ->
      (l, r)
  | _, _ ->
      failwithf "[ERROR] You may only rename a binding if the arity remains the same %s" l.Range.ToLocationString

let lowerBindingSignature (s:Cst.BindingSignature) : Ast.Name =
  match s with
  | Cst.BS_Unary(r, op, _) -> lowerUnaryOp op
  | Cst.BS_Binary(r, op, _, _) -> lowerBinaryOp op
  | Cst.BS_AtPut(r, _, _, _) -> nameAtPut r
  | Cst.BS_At(r, _, _) -> nameAt r
  | Cst.BS_Name(_, n) -> lowerName n
      


let lowerImportBinding (name:Ast.Name) (binding:Cst.ImportBinding) =
  match binding with
  | Cst.IB_Open(r, local) ->
      let n = lowerName local
      Ast.Define(r, emptyMeta, n, unknown, Ast.LoadLocal(r, name))

  | Cst.IB_Alias(r, ext, local) ->
      let (ext, local) = checkBindingArity ext local
      let extName = lowerBindingSignature ext
      let localName = lowerBindingSignature local
      Ast.Define(r, emptyMeta, localName, unknown, 
        Ast.Get(r, Ast.LoadLocal(R_Unknown, name), astNameToString extName))


let lowerDeclaration (declaration:Cst.Declaration) : Ast.Declaration list =
  match declaration with
  | Cst.Import(r, id, binds) ->
      let id = lowerModuleId id
      let name = nameModule id
      let bind = Ast.NFresh (Ast.Fresh(name))
      Ast.Import(r, id, bind) :: (List.map (lowerImportBinding bind) (List.ofArray binds))

let lowerDeclarations (declarations:Cst.Declaration list) =
  declarations |> List.collect lowerDeclaration

let lowerModule (m:Cst.Module) : Ast.Module = 
  {
    range = m.range
    meta = lowerMeta m.meta
    id = lowerModuleId m.id
    declarations = lowerDeclarations (Array.toList m.declarations)
  }