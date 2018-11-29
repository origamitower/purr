// This code was automatically generated from a grammar definition by Fohm.
module Fohm.Generated.Origami

type Offset = 
  { line: int; column: int }

type OffsetRecord<'a> =
  { start: 'a; ``end``: 'a }

type Position = 
  {
    offset: unit -> OffsetRecord<int>
    position: unit -> OffsetRecord<Offset>
    sourceSlice: string
    sourceString: string
    filename: string option
  }

type Meta = 
  { source: Position; children: Position[] }

type ParseOptions =
  { filename: string option }


open Origami.Compiler.Syntax.Range
open Origami.Compiler.Syntax.Cst
open Fable.Core
open Fable.Core.JsInterop
open System.Text.RegularExpressions

let positionToRange (m:Position) : Range =
  let offset = m.offset()
  let position = m.position()
  R_Known({
    span = (offset.start, offset.``end``)
    start = (position.start.line, position.start.column)
    stop = (position.``end``.line, position.``end``.column)
    source = m.sourceString
    filename = m.filename
  })

let range (m:Meta) = positionToRange m.source

let crange (m:Meta) idx = positionToRange m.children.[idx]

let contract (x:Contract option) =
  match x with
  | Some v -> v
  | None -> C_Unknown(R_Unknown)

let assocLeft f (initial:'u) (xs:'t[]) =
  match List.ofArray xs with
  | [] -> initial
  | first :: rest -> List.fold f (f initial first) rest

let binaryL =
  assocLeft <| fun l (op, r) -> BinaryExpr(R_Unknown, op, l, r)

let fixDigits xs =
  xs |> Array.filter (fun x -> x <> "_")
     |> String.concat ""


[<Emit("parseInt($1, $0)")>]
let parseInt radix x = jsNative

[<Emit("JSON.parse($0)")>]
let parseJsonStringPrim s = jsNative

let parseJsonString (s:string) =
  let s = Regex.Replace(Regex.Replace(s, "\\r", "\\r"), "\\n", "\\n")
  in parseJsonStringPrim s

let makeInt r xs = xs |> fixDigits |> parseInt r |> (fun x -> x.ToString())
let octal = makeInt 8
let binary = makeInt 2
let hex = makeInt 16
let decimal = makeInt 10

let trimSome (n:int) (s:string) =
  let pattern = sprintf "^\\s{0,%d}" n
  Regex.Replace(s, pattern, "")

let fixRawString (m:Range) xs =
  let str = String.concat "" xs
  let trimmer = match m with
                | R_Known i -> trimSome (snd i.start)
                | R_Unknown -> id
  let lines = str.Split([|'\n'|])
  

  lines |> Array.map trimmer
        |> String.concat "\n"



open Fable.Core
open Fable.Core.JsInterop

[<Import("makeParser", from="./fohm-runtime.js")>]
let private makeParser (source: string, visitor: obj): obj = jsNative

let private visitor = 
  createObj [
    "Module_alt0" ==> fun (meta:Meta) _0 m _2 id defs _5 ->
      
              {
                range = range meta
                meta = m
                id = id
                declarations = defs
              }
            
              
    "Meta_alt0" ==> fun (meta:Meta) doc ->
      
              {
                documentation = doc
              }
            
              
    "ModuleId_alt0" ==> fun (meta:Meta) n ->
      
              {
                range = range meta
                names = n
              }
            
              
    "ImportDefinition_alt0" ==> fun (meta:Meta) _0 id _2 binds ->
       Import(range meta, id, binds) 
              
    "Binding_alt0" ==> fun (meta:Meta) e _1 l ->
       IB_Alias(range meta, e, l) 
              
    "Binding_alt1" ==> fun (meta:Meta) l _1 _2 ->
       IB_Open(range meta, l) 
              
    "Binding_alt2" ==> fun (meta:Meta) l ->
       IB_Alias(range meta, l, l) 
              
    "ExportBinding_alt0" ==> fun (meta:Meta) e _1 a ->
       EB_Alias(range meta, e, a) 
              
    "ExportBinding_alt1" ==> fun (meta:Meta) _0 _1 n ->
       EB_Object(range meta, n) 
              
    "ExportBinding_alt2" ==> fun (meta:Meta) _0 ->
       EB_ReExport(range meta) 
              
    "ExportBinding_alt3" ==> fun (meta:Meta) n ->
       EB_Alias(range meta, n, n) 
              
    "ExportLocalBinding_alt0" ==> fun (meta:Meta) l _1 a ->
       ELB_Alias(range meta, l, a) 
              
    "ExportLocalBinding_alt1" ==> fun (meta:Meta) l ->
       ELB_Alias(range meta, l, l) 
              
    "Signature_alt0" ==> fun (meta:Meta) _0 op n _3 ->
       BS_Unary(range meta, op, n) 
              
    "Signature_alt1" ==> fun (meta:Meta) _0 l op r _4 ->
       BS_Binary(range meta, op, l, r) 
              
    "Signature_alt2" ==> fun (meta:Meta) _0 o _2 k _4 _5 v _7 ->
       BS_AtPut(range meta, o, k, v) 
              
    "Signature_alt3" ==> fun (meta:Meta) _0 o _2 k _4 _5 ->
       BS_At(range meta, o, k) 
              
    "Signature_alt4" ==> fun (meta:Meta) n ->
       BS_Name(range meta, n) 
              
    "ExportDefinition_alt0" ==> fun (meta:Meta) _0 id _2 binds ->
       Export(range meta, id, binds) 
              
    "ExportDefinition_alt1" ==> fun (meta:Meta) _0 binds ->
       ExportLocal(range meta, binds) 
              
    "FFIDefinition_alt0" ==> fun (meta:Meta) m _1 id _3 sigs _5 ->
       FFI(range meta, m, id, sigs) 
              
    "ExternalSignature_alt0" ==> fun (meta:Meta) m _1 k signature t ffi ->
       FFI_Function(range meta, m, k, signature, contract t, ffi) 
              
    "ExternalSignature_alt1" ==> fun (meta:Meta) m _1 n t ffi ->
       FFI_Define(range meta, m, n, contract t, ffi) 
              
    "ExternalSignatureName_alt0" ==> fun (meta:Meta) _0 n ->
       box <| fun _ -> { range = crange meta 1; value = n } 
              
    "StructureDefinition_alt0" ==> fun (meta:Meta) m _1 ctor ->
       
              let (name, fields) = ctor
              in Record(range meta, m, name, fields) 
            
              
    "UnionDefinition_alt0" ==> fun (meta:Meta) m _1 n _3 cs _5 ->
       Union(range meta, m, n, cs) 
              
    "DataConstructor_alt0" ==> fun (meta:Meta) n _1 fields _3 _4 ->
       (n, fields) 
              
    "UnionCase_alt0" ==> fun (meta:Meta) m ctor ->
      
              let (name, fields) = ctor
              in { range = range meta; meta = m; name = name; fields = fields }
            
              
    "Field_alt0" ==> fun (meta:Meta) m mut n t i ->
      
              {
                range = range meta
                meta = m
                isMutable = Option.isSome mut
                name = n
                contract = contract t
                initializer = i
              }
            
              
    "Initializer_alt0" ==> fun (meta:Meta) _0 e ->
       Some e 
              
    "Initializer_alt1" ==> fun (meta:Meta)  ->
       None 
              
    "FunctionDefinition_alt0" ==> fun (meta:Meta) m _1 k signature t b ->
       Function(range meta, m, k, signature, contract t, b) 
              
    "FunctionKind_alt0" ==> fun (meta:Meta) _0 ->
       FK_Generator 
              
    "FunctionKind_alt1" ==> fun (meta:Meta)  ->
       FK_Function 
              
    "FunctionSignature_alt0" ==> fun (meta:Meta) op p ->
       FS_Unary(range meta, op, p) 
              
    "FunctionSignature_alt1" ==> fun (meta:Meta) l op r ->
       FS_Binary(range meta, op, l, r) 
              
    "FunctionSignature_alt2" ==> fun (meta:Meta) o _1 k _3 _4 v ->
       FS_AtPut(range meta, o, k, v) 
              
    "FunctionSignature_alt3" ==> fun (meta:Meta) o _1 k _3 ->
       FS_At(range meta, o, k) 
              
    "FunctionSignature_alt4" ==> fun (meta:Meta) n ps ->
       FS_Named(range meta, n, ps) 
              
    "ParamList_alt0" ==> fun (meta:Meta) _0 ps _2 _3 s _5 ->
       FS_Variadic(range meta, ps, s) 
              
    "ParamList_alt1" ==> fun (meta:Meta) _0 _1 s _3 ->
       FS_Variadic(range meta, [||], s) 
              
    "ParamList_alt2" ==> fun (meta:Meta) _0 ps _2 ns _4 ->
       FS_Keyword(range meta, ps, ns) 
              
    "ParamList_alt3" ==> fun (meta:Meta) _0 ns _2 ->
       FS_Keyword(range meta, [||], ns) 
              
    "ParamList_alt4" ==> fun (meta:Meta) _0 ps _2 ->
       FS_Fixed(range meta, ps) 
              
    "PParam_alt0" ==> fun (meta:Meta) _0 n t _3 ->
      
              {
                range = range meta
                name = n
                contract = t
              }
            
              
    "PParam_alt1" ==> fun (meta:Meta) n ->
      
              {
                range = range meta
                name = n
                contract = contract None
              }
            
              
    "Param_alt0" ==> fun (meta:Meta) n t ->
      
              {
                range = range meta
                name = n
                contract = t
              }
            
              
    "Param_alt1" ==> fun (meta:Meta) n ->
      
              {
                range = range meta
                name = n
                contract = contract None
              }
            
              
    "NamedParam_alt0" ==> fun (meta:Meta) k _1 n t i ->
      
              {
                range = range meta
                key = k
                name = n
                contract = contract t
                initializer = i
              }
            
              
    "FunctionBody_alt0" ==> fun (meta:Meta) _0 e ->
       [| e |] 
              
    "FunctionBody_alt1" ==> fun (meta:Meta) _0 xs _2 ->
       xs 
              
    "LetDefinition_alt0" ==> fun (meta:Meta) m _1 n t _4 e _6 ->
       Define(range meta, m, n, contract t, e) 
              
    "Statement_alt6" ==> fun (meta:Meta) e _1 ->
       ExprStmt(range meta, e) 
              
    "LetStatement_alt0" ==> fun (meta:Meta) _0 mut n t _4 e _6 ->
      
              match mut with
              | Some _ -> LetMutable(range meta, n, contract t, e)
              | None   -> Let(range meta, n, contract t, e)
            
              
    "AssertStatement_alt0" ==> fun (meta:Meta) _0 e _2 ->
       Assert(range meta, e) 
              
    "AssertStatement_alt1" ==> fun (meta:Meta) _0 s _2 ->
       Unreachable(range meta, { range = crange meta 1; value = s }) 
              
    "LoopStatement_alt0" ==> fun (meta:Meta) _0 _1 n t _4 e b ->
       Foreach(range meta, n, contract t, e, b) 
              
    "LoopStatement_alt1" ==> fun (meta:Meta) _0 _1 e b ->
       While(range meta, e, b) 
              
    "LoopStatement_alt2" ==> fun (meta:Meta) _0 _1 e b ->
       Until(range meta, e, b) 
              
    "LoopStatement_alt3" ==> fun (meta:Meta) _0 _1 n t _4 s _6 e b ->
       For(range meta, n, contract t, s, e, b) 
              
    "LoopStatement_alt4" ==> fun (meta:Meta) _0 _1 n t _4 s _6 e _8 by b ->
       ForBy(range meta, n, contract t, s, e, by, b) 
              
    "LoopStatement_alt5" ==> fun (meta:Meta) _0 b ->
       Repeat(range meta, b) 
              
    "AssignStatement_alt0" ==> fun (meta:Meta) n _1 e _3 ->
       Assign(range meta, n, e) 
              
    "Block_alt0" ==> fun (meta:Meta) _0 xs _2 ->
       xs 
              
    "IfExpression_alt0" ==> fun (meta:Meta) _0 t _2 c _4 a ->
       IfThenElse(range meta, t, c, a) 
              
    "PipeExpression_alt0" ==> fun (meta:Meta) l _1 r ->
       Pipe(range meta, l, r) 
              
    "YieldExpression_alt0" ==> fun (meta:Meta) _0 _1 e ->
       YieldAll(range meta, e) 
              
    "YieldExpression_alt1" ==> fun (meta:Meta) _0 e ->
       Yield(range meta, e) 
              
    "BinaryExpression_alt0" ==> fun (meta:Meta) l t ->
       binaryL l t 
              
    "BinaryExpression_alt1" ==> fun (meta:Meta) l t ->
       binaryL l t 
              
    "BinaryExpression_alt2" ==> fun (meta:Meta) l t ->
       binaryL l t 
              
    "BinaryExpression_alt3" ==> fun (meta:Meta) l t ->
       binaryL l t 
              
    "BinaryExpression_alt4" ==> fun (meta:Meta) l t ->
       binaryL l t 
              
    "BinaryExpression_alt5" ==> fun (meta:Meta) l _1 r ->
       BinaryExpr(range meta, OpIn(crange meta 1), l, r) 
              
    "BinaryExpression_alt6" ==> fun (meta:Meta) l _1 r ->
       BinaryExpr(range meta, OpImplies(crange meta 1), l, r) 
              
    "BinaryExpression_alt7" ==> fun (meta:Meta) l t ->
       binaryL l t 
              
    "BinaryExpression_alt8" ==> fun (meta:Meta) l _1 r ->
       BinaryExpr(range meta, OpPower(crange meta 1), l, r) 
              
    "BinaryExpression_alt9" ==> fun (meta:Meta) l t ->
       binaryL l t 
              
    "BinaryExpression_alt10" ==> fun (meta:Meta) l _1 r ->
       BinaryExpr(range meta, OpMinus(crange meta 1), l, r) 
              
    "BinaryExpression_alt11" ==> fun (meta:Meta) l _1 r ->
       BinaryExpr(range meta, OpDivide(crange meta 1), l, r) 
              
    "BinaryExpression_alt12" ==> fun (meta:Meta) l _1 r ->
       BinaryExpr(range meta, OpEqual(crange meta 1), l, r) 
              
    "BinaryExpression_alt13" ==> fun (meta:Meta) l _1 r ->
       BinaryExpr(range meta, OpNotEqual(crange meta 1), l, r) 
              
    "BinaryExpression_alt14" ==> fun (meta:Meta) l _1 r ->
       BinaryExpr(range meta, OpGreaterOrEqual(crange meta 1), l, r) 
              
    "BinaryExpression_alt15" ==> fun (meta:Meta) l _1 r ->
       BinaryExpr(range meta, OpLessOrEqual(crange meta 1), l, r) 
              
    "BinaryExpression_alt16" ==> fun (meta:Meta) l _1 r ->
       BinaryExpr(range meta, OpGreater(crange meta 1), l, r) 
              
    "BinaryExpression_alt17" ==> fun (meta:Meta) l _1 r ->
       BinaryExpr(range meta, OpLess(crange meta 1), l, r) 
              
    "BinaryExpressionTrail_alt0" ==> fun (meta:Meta) op o ->
       (op, o) 
              
    "UnaryExpression_alt0" ==> fun (meta:Meta) _0 e ->
       EffectExpr(range meta, e) 
              
    "SimpleUnaryExpression_alt0" ==> fun (meta:Meta) _0 e ->
       UnaryExpr(range meta, OpNot(crange meta 0), e) 
              
    "SendExpression_alt0" ==> fun (meta:Meta) s k ->
       k (range meta) s 
              
    "SendContinuation_alt0" ==> fun (meta:Meta) a ->
       box <| fun r m -> Call(r, m, a) 
              
    "SendContinuation_alt1" ==> fun (meta:Meta) _0 msg a ->
       box <| fun r m -> MethodCall(r, m, msg, a) 
              
    "SendContinuation_alt2" ==> fun (meta:Meta) _0 k _2 _3 v ->
       box <| fun r o -> AtPut(r, o, k, v) 
              
    "SendContinuation_alt3" ==> fun (meta:Meta) _0 k _2 ->
       box <| fun r o -> At(r, o, k) 
              
    "SendContinuation_alt4" ==> fun (meta:Meta) _0 n _2 v ->
       box <| fun r o -> Set(r, o, n, v) 
              
    "SendContinuation_alt5" ==> fun (meta:Meta) _0 n ->
       box <| fun r o -> Get(r, o, n) 
              
    "UpdateExpression_alt0" ==> fun (meta:Meta) m _1 e ->
      
              match m with
              | Get(_, o, p) -> Set(range meta, o, p, e)
              | At(_, o, k) -> AtPut(range meta, o, k, e)
              | _ -> 
                match range meta with
                | R_Known(v) -> failwithf "a <- b is only valid in an expression if `a` is a member expression (at line %d, column %d in %s)" (fst v.start) (snd v.start) (Option.defaultValue "(unknown file)" v.filename)
                | R_Unknown -> failwithf "a <- b is only valid in an expression if `a` is a member expression."
            
              
    "MemberExpression_alt0" ==> fun (meta:Meta) o _1 k _3 ->
       At(range meta, o, k) 
              
    "MemberExpression_alt1" ==> fun (meta:Meta) o _1 n ->
       Get(range meta, o, n) 
              
    "NewExpression_alt0" ==> fun (meta:Meta) _0 c a ->
       New(range meta, c, a) 
              
    "NewExpression_alt1" ==> fun (meta:Meta) _0 c r ->
       NewRecord(range meta, c, r) 
              
    "PrimaryExpression_alt3" ==> fun (meta:Meta) n ->
       Var(range meta, n) 
              
    "PrimaryExpression_alt4" ==> fun (meta:Meta) _0 ->
       PartialHole(range meta) 
              
    "PrimaryExpression_alt5" ==> fun (meta:Meta) l ->
       LitExpr(range meta, l) 
              
    "PrimaryExpression_alt8" ==> fun (meta:Meta) _0 e _2 ->
       Parens(range meta, e) 
              
    "ArrayExpression_alt0" ==> fun (meta:Meta) mut _1 items _3 ->
       ArrayExpr(range meta, Option.isSome mut, items) 
              
    "ArrayItem_alt0" ==> fun (meta:Meta) _0 e ->
       AI_Spread(range meta, e) 
              
    "ArrayItem_alt1" ==> fun (meta:Meta) e ->
       AI_Item(range meta, e) 
              
    "RecordExpression_alt0" ==> fun (meta:Meta) mut pairs ->
       RecordExpr(range meta, Option.isSome mut, pairs) 
              
    "RecordPairs_alt0" ==> fun (meta:Meta) _0 ps _2 ->
       ps 
              
    "RecordPair_alt0" ==> fun (meta:Meta) n _1 e ->
      
              {
                range = range meta
                key = n
                value = e
              }
            
              
    "FunctionExpression_alt0" ==> fun (meta:Meta) p k t b ->
       ArrowFn(range meta, k, p, contract t, b) 
              
    "FexprBlock_alt0" ==> fun (meta:Meta) _0 e ->
       [| e |] 
              
    "FexprBlock_alt1" ==> fun (meta:Meta) _0 _1 xs _3 ->
       xs 
              
    "String_alt0" ==> fun (meta:Meta) s ->
       L_String(range meta, s) 
              
    "Null_alt0" ==> fun (meta:Meta) _0 ->
       L_Null(range meta) 
              
    "ArgList_alt0" ==> fun (meta:Meta) _0 xs _2 ->
       xs 
              
    "Argument_alt0" ==> fun (meta:Meta) _0 e ->
       A_Spread(range meta, e) 
              
    "Argument_alt1" ==> fun (meta:Meta) k _1 e ->
       A_Named(range meta, k, e) 
              
    "Argument_alt2" ==> fun (meta:Meta) e ->
       A_Positional(range meta, e) 
              
    "Match_alt0" ==> fun (meta:Meta) _0 e _2 cs _4 ->
       MatchExpr(range meta, e, cs) 
              
    "MatchCase_alt0" ==> fun (meta:Meta) _0 p _2 e _4 b ->
       MC_Guarded(range meta, p, e, b) 
              
    "MatchCase_alt1" ==> fun (meta:Meta) _0 p _2 b ->
       MC_Unguarded(range meta, p, b) 
              
    "MatchCase_alt2" ==> fun (meta:Meta) _0 _1 b ->
       MC_Default(range meta, b) 
              
    "Pattern_alt0" ==> fun (meta:Meta) l ->
       P_Literal(range meta, l) 
              
    "Pattern_alt1" ==> fun (meta:Meta) _0 k _2 ->
       k (range meta) 
              
    "Pattern_alt2" ==> fun (meta:Meta) _0 ps _2 ->
       P_Record(range meta, ps) 
              
    "Pattern_alt3" ==> fun (meta:Meta) o _1 ps _3 ->
       P_Extractor(range meta, o, ps) 
              
    "Pattern_alt4" ==> fun (meta:Meta) p t ->
       P_Guarded(range meta, p, t) 
              
    "Pattern_alt5" ==> fun (meta:Meta) n ->
       P_Bind(range meta, n) 
              
    "ArrayPattern_alt0" ==> fun (meta:Meta) items _1 _2 s ->
       box <| fun r -> P_SpreadArray(r, items, s) 
              
    "ArrayPattern_alt1" ==> fun (meta:Meta) _0 s ->
       box <| fun r -> P_SpreadArray(r, [||], s) 
              
    "ArrayPattern_alt2" ==> fun (meta:Meta) items ->
       box <| fun r -> P_FixedArray(r, items) 
              
    "PairPattern_alt0" ==> fun (meta:Meta) k _1 p ->
      
              {
                range = range meta
                key = k
                pattern = p
              }
            
              
    "DoBlock_alt0" ==> fun (meta:Meta) _0 e _2 xs _4 ->
       Do(range meta, e, xs) 
              
    "Name_alt0" ==> fun (meta:Meta) id ->
       N_Id(range meta, id) 
              
    "Name_alt1" ==> fun (meta:Meta) _0 ids _2 ->
       N_Quoted(range meta, ids) 
              
    "Contract_alt0" ==> fun (meta:Meta) _0 t ->
       t 
              
    "TypeExpression_alt0" ==> fun (meta:Meta) t _1 ->
       C_Option(range meta, t) 
              
    "TypeExpression_alt1" ==> fun (meta:Meta) l _1 r ->
       C_Or(range meta, l, r) 
              
    "TypeExpression_alt2" ==> fun (meta:Meta) n _1 ts _3 ->
       C_Apply(range meta, n, ts) 
              
    "TypeExpression_alt3" ==> fun (meta:Meta) t _1 n ->
       C_Project(range meta, t, n) 
              
    "TypeExpression_alt4" ==> fun (meta:Meta) n ->
       C_Named(range meta, n) 
              
    "binary_operator_alt0" ==> fun (meta:Meta) _0 ->
       OpEqual(range meta) 
              
    "binary_operator_alt1" ==> fun (meta:Meta) _0 ->
       OpGreaterOrEqual(range meta) 
              
    "binary_operator_alt2" ==> fun (meta:Meta) _0 ->
       OpComposeRight(range meta) 
              
    "binary_operator_alt3" ==> fun (meta:Meta) _0 ->
       OpGreater(range meta) 
              
    "binary_operator_alt4" ==> fun (meta:Meta) _0 ->
       OpLessOrEqual(range meta) 
              
    "binary_operator_alt5" ==> fun (meta:Meta) _0 ->
       OpComposeLeft(range meta) 
              
    "binary_operator_alt6" ==> fun (meta:Meta) _0 ->
       OpLess(range meta) 
              
    "binary_operator_alt7" ==> fun (meta:Meta) _0 ->
       OpConcat(range meta) 
              
    "binary_operator_alt8" ==> fun (meta:Meta) _0 ->
       OpPlus(range meta) 
              
    "binary_operator_alt9" ==> fun (meta:Meta) _0 ->
       OpImplies(range meta) 
              
    "binary_operator_alt10" ==> fun (meta:Meta) _0 ->
       OpMinus(range meta) 
              
    "binary_operator_alt11" ==> fun (meta:Meta) _0 ->
       OpPower(range meta) 
              
    "binary_operator_alt12" ==> fun (meta:Meta) _0 ->
       OpTimes(range meta) 
              
    "binary_operator_alt13" ==> fun (meta:Meta) _0 ->
       OpNotEqual(range meta) 
              
    "binary_operator_alt14" ==> fun (meta:Meta) _0 ->
       OpDivide(range meta) 
              
    "binary_operator_alt15" ==> fun (meta:Meta) _0 ->
       OpAnd(range meta) 
              
    "binary_operator_alt16" ==> fun (meta:Meta) _0 ->
       OpOr(range meta) 
              
    "binary_operator_alt17" ==> fun (meta:Meta) _0 ->
       OpIn(range meta) 
              
    "unary_operator_alt0" ==> fun (meta:Meta) _0 ->
       OpNot(range meta) 
              
    "integral_number_alt0" ==> fun (meta:Meta) _0 xs ->
       octal xs 
              
    "integral_number_alt1" ==> fun (meta:Meta) _0 xs ->
       hex xs 
              
    "integral_number_alt2" ==> fun (meta:Meta) _0 xs ->
       binary xs 
              
    "integral_number_alt3" ==> fun (meta:Meta) xs ->
       decimal xs 
              
    "integer_alt0" ==> fun (meta:Meta) _0 x ->
       L_Number(range meta, Negative, x, "0", Integer) 
              
    "integer_alt1" ==> fun (meta:Meta) _0 x ->
       L_Number(range meta, Positive, x, "0", Integer) 
              
    "integer_alt2" ==> fun (meta:Meta) x ->
       L_Number(range meta, Unsigned, x, "0", Integer) 
              
    "decimal_alt0" ==> fun (meta:Meta) _0 i _2 d s ->
       L_Number(range meta, Negative, decimal i, decimal d, s) 
              
    "decimal_alt1" ==> fun (meta:Meta) _0 i _2 d s ->
       L_Number(range meta, Positive, decimal i, decimal d, s) 
              
    "decimal_alt2" ==> fun (meta:Meta) i _1 d s ->
       L_Number(range meta, Unsigned, decimal i, decimal d, s) 
              
    "suffix_alt0" ==> fun (meta:Meta) _0 ->
       Float64 
              
    "suffix_alt1" ==> fun (meta:Meta)  ->
       Decimal 
              
    "boolean_alt0" ==> fun (meta:Meta) _0 ->
       L_Boolean(range meta, true) 
              
    "boolean_alt1" ==> fun (meta:Meta) _0 ->
       L_Boolean(range meta, false) 
              
    "raw_string_alt0" ==> fun (meta:Meta) _0 xs _2 ->
       fixRawString (range meta) xs 
              
    "string_alt1" ==> fun (meta:Meta) x ->
       parseJsonString x 
              
  ]

let private primParser: obj  =
  makeParser(
    """
    Origami {
      Module =
        | Header* Meta module_ ModuleId Definition* end -- alt0
              
      
      Meta =
        | doc_comment? -- alt0
              
      
      ModuleId =
        | QualifiedName -- alt0
              
      
      Header =
        | "%" id ":" HeaderExpr -- alt0
              
      
      HeaderExpr =
        | Decimal -- alt0
        | Integer -- alt1
        | String -- alt2
        | Boolean -- alt3
        | id -- alt4
              
      
      Definition =
        | ImportDefinition -- alt0
        | ExportDefinition -- alt1
        | StructureDefinition -- alt2
        | UnionDefinition -- alt3
        | FunctionDefinition -- alt4
        | LetDefinition -- alt5
        | FFIDefinition -- alt6
              
      
      ImportDefinition =
        | import_ ModuleId exposing_ NonemptyListOf<Binding, ","> -- alt0
              
      
      Binding =
        | Signature as_ Signature -- alt0
        | everything_ as_ Name -- alt1
        | Signature -- alt2
              
      
      ExportBinding =
        | Signature as_ Signature -- alt0
        | everything_ as_ Name -- alt1
        | everything_ -- alt2
        | Signature -- alt3
              
      
      ExportLocalBinding =
        | Signature as_ Signature -- alt0
        | Signature -- alt1
              
      
      Signature =
        | "(" UnaryOp Name ")" -- alt0
        | "(" Name BinaryOp Name ")" -- alt1
        | "(" Name "[" Name "]" "<-" Name ")" -- alt2
        | "(" Name "[" Name "]" ")" -- alt3
        | Name -- alt4
              
      
      ExportDefinition =
        | export_ ModuleId exposing_ NonemptyListOf<ExportBinding, ","> -- alt0
        | export_ NonemptyListOf<ExportLocalBinding, ","> -- alt1
              
      
      FFIDefinition =
        | Meta external_ String "{" ExternalSignature+ "}" -- alt0
              
      
      ExternalSignature =
        | Meta function_ FunctionKind FunctionSignature Contract? ExternalSignatureName -- alt0
        | Meta define_ Name Contract? ExternalSignatureName -- alt1
              
      
      ExternalSignatureName =
        | "=" string -- alt0
              
      
      StructureDefinition =
        | Meta record_ DataConstructor -- alt0
              
      
      UnionDefinition =
        | Meta union_ Name "{" UnionCase+ "}" -- alt0
              
      
      DataConstructor =
        | Name "(" ListOf<Field, ";"> ";"? ")" -- alt0
              
      
      UnionCase =
        | Meta DataConstructor -- alt0
              
      
      Field =
        | Meta mutable_? Name Contract? Initializer -- alt0
              
      
      Initializer =
        | "=" Expression -- alt0
        |  -- alt1
              
      
      FunctionDefinition =
        | Meta function_ FunctionKind FunctionSignature Contract? FunctionBody -- alt0
              
      
      FunctionKind =
        | "*" -- alt0
        |  -- alt1
              
      
      FunctionSignature =
        | UnaryOp PParam -- alt0
        | PParam BinaryOp PParam -- alt1
        | PParam "[" Param "]" "<-" PParam -- alt2
        | PParam "[" Param "]" -- alt3
        | Name ParamList -- alt4
              
      
      ParamList =
        | "(" NonemptyListOf<Param, ","> "," "..." Param ")" -- alt0
        | "(" "..." Param ")" -- alt1
        | "(" NonemptyListOf<Param, ","> "," NonemptyListOf<NamedParam, ","> ")" -- alt2
        | "(" NonemptyListOf<NamedParam, ","> ")" -- alt3
        | "(" ListOf<Param, ","> ")" -- alt4
              
      
      PParam =
        | "(" Name Contract ")" -- alt0
        | Name -- alt1
              
      
      Param =
        | Name Contract -- alt0
        | Name ~":" -- alt1
              
      
      NamedParam =
        | Name ":" Name Contract? Initializer -- alt0
              
      
      FunctionBody =
        | "=" Expression -- alt0
        | "{" Statement* "}" -- alt1
              
      
      LetDefinition =
        | Meta define_ Name Contract? "=" Expression ";" -- alt0
              
      
      Statement =
        | LetStatement -- alt0
        | AssertStatement -- alt1
        | LoopStatement -- alt2
        | Match -- alt3
        | DoBlock -- alt4
        | AssignStatement -- alt5
        | Expression ";" -- alt6
              
      
      LetStatement =
        | let_ mutable_? Name Contract? "=" Expression ";" -- alt0
              
      
      AssertStatement =
        | assert_ Expression ";" -- alt0
        | unreachable_ string ";" -- alt1
              
      
      LoopStatement =
        | for_ each_ Name Contract? of_ Expression Block -- alt0
        | repeat_ while_ Expression Block -- alt1
        | repeat_ until_ Expression Block -- alt2
        | repeat_ with_ Name Contract? from_ Expression to_ Expression Block -- alt3
        | repeat_ with_ Name Contract? from_ Expression to_ Expression by_ Expression Block -- alt4
        | repeat_ Block -- alt5
              
      
      AssignStatement =
        | Name "<-" Expression ";" -- alt0
              
      
      Block =
        | "{" Statement* "}" -- alt0
              
      
      Expression =
        | IfExpression -- alt0
        | PipeExpression -- alt1
              
      
      IfExpression =
        | if_ Expression then_ Expression else_ Expression -- alt0
              
      
      PipeExpression =
        | PipeExpression "|>" BinaryExpression -- alt0
        | YieldExpression -- alt1
              
      
      YieldExpression =
        | yield_ "*" SendExpression -- alt0
        | yield_ SendExpression -- alt1
        | BinaryExpression -- alt2
              
      
      BinaryExpression =
        | UnaryExpression BinaryExpressionTrail<and_>+ -- alt0
        | UnaryExpression BinaryExpressionTrail<or_>+ -- alt1
        | UnaryExpression BinaryExpressionTrail<"++">+ -- alt2
        | UnaryExpression BinaryExpressionTrail<">>">+ -- alt3
        | UnaryExpression BinaryExpressionTrail<"<<">+ -- alt4
        | UnaryExpression in_ UnaryExpression -- alt5
        | UnaryExpression "-->" UnaryExpression -- alt6
        | UnaryExpression BinaryExpressionTrail<"+">+ -- alt7
        | UnaryExpression "**" UnaryExpression -- alt8
        | UnaryExpression BinaryExpressionTrail<"*">+ -- alt9
        | UnaryExpression "-" UnaryExpression -- alt10
        | UnaryExpression "/" UnaryExpression -- alt11
        | UnaryExpression "==" UnaryExpression -- alt12
        | UnaryExpression "/=" UnaryExpression -- alt13
        | UnaryExpression ">=" UnaryExpression -- alt14
        | UnaryExpression "<=" UnaryExpression -- alt15
        | UnaryExpression ">" UnaryExpression -- alt16
        | UnaryExpression "<" UnaryExpression -- alt17
        | UnaryExpression -- alt18
              
      
      BinaryExpressionTrail<operator> =
        | operator UnaryExpression -- alt0
              
      
      UnaryExpression =
        | "!" SimpleUnaryExpression -- alt0
        | SimpleUnaryExpression -- alt1
              
      
      SimpleUnaryExpression =
        | not_ SendExpression -- alt0
        | SendExpression -- alt1
              
      
      SendExpression =
        | SendExpression SendContinuation -- alt0
        | UpdateExpression -- alt1
              
      
      SendContinuation =
        | ArgList -- alt0
        | "." Name ArgList -- alt1
        | "[" Expression "]" "<-" Expression -- alt2
        | "[" Expression "]" -- alt3
        | "." Name "<-" Expression -- alt4
        | "." Name -- alt5
              
      
      UpdateExpression =
        | MemberExpression "<-" Expression -- alt0
        | MemberExpression -- alt1
              
      
      MemberExpression =
        | MemberExpression "[" Expression "]" -- alt0
        | MemberExpression "." Name -- alt1
        | NewExpression -- alt2
              
      
      NewExpression =
        | new_ MemberExpression ArgList -- alt0
        | new_ MemberExpression RecordPairs -- alt1
        | PrimaryExpression -- alt2
              
      
      PrimaryExpression =
        | FunctionExpression -- alt0
        | Match -- alt1
        | DoBlock -- alt2
        | ~reserved_var Name -- alt3
        | "_" -- alt4
        | Literal -- alt5
        | ArrayExpression -- alt6
        | RecordExpression -- alt7
        | "(" Expression ")" -- alt8
              
      
      ArrayExpression =
        | mutable_? "[" ListOf<ArrayItem, ","> "]" -- alt0
              
      
      ArrayItem =
        | "..." Expression -- alt0
        | Expression -- alt1
              
      
      RecordExpression =
        | mutable_? RecordPairs -- alt0
              
      
      RecordPairs =
        | "{" ListOf<RecordPair, ","> "}" -- alt0
              
      
      RecordPair =
        | Name ":" Expression -- alt0
              
      
      FunctionExpression =
        | ParamList FunctionKind Contract? FexprBlock -- alt0
              
      
      FexprBlock =
        | "=>" Expression -- alt0
        | "=>" "{" Statement* "}" -- alt1
              
      
      Literal =
        | String -- alt0
        | Boolean -- alt1
        | Decimal -- alt2
        | Integer -- alt3
        | Null -- alt4
              
      
      String =
        | string -- alt0
              
      
      Boolean =
        | boolean -- alt0
              
      
      Decimal =
        | decimal -- alt0
              
      
      Integer =
        | integer -- alt0
              
      
      Null =
        | null_ -- alt0
              
      
      ArgList =
        | "(" ListOf<Argument, ","> ")" -- alt0
              
      
      Argument =
        | "..." Expression -- alt0
        | Name ":" Expression -- alt1
        | Expression -- alt2
              
      
      Match =
        | match_ Expression "{" MatchCase* "}" -- alt0
              
      
      MatchCase =
        | case_ Pattern when_ Expression ":" Statement* -- alt0
        | case_ Pattern ":" Statement* -- alt1
        | default_ ":" Statement* -- alt2
              
      
      Pattern =
        | Literal -- alt0
        | "[" ArrayPattern "]" -- alt1
        | "{" ListOf<PairPattern, ","> "}" -- alt2
        | MemberExpression "(" ListOf<Pattern, ","> ")" -- alt3
        | Pattern Contract -- alt4
        | Name -- alt5
              
      
      ArrayPattern =
        | NonemptyListOf<Pattern, ","> "," "..." Pattern -- alt0
        | "..." Pattern -- alt1
        | ListOf<Pattern, ","> -- alt2
              
      
      PairPattern =
        | Name ":" Pattern -- alt0
              
      
      DoBlock =
        | do_ Expression? "{" Statement* "}" -- alt0
              
      
      Name =
        | ~reserved id -- alt0
        | "`" id+ "`" -- alt1
              
      
      QualifiedName =
        | NonemptyListOf<Name, "."> -- alt0
              
      
      UnaryOp =
        | unary_operator -- alt0
              
      
      BinaryOp =
        | binary_operator -- alt0
              
      
      Contract =
        | "::" TypeExpression -- alt0
              
      
      TypeExpression =
        | TypeExpression "?" -- alt0
        | TypeExpression "|" TypeExpression -- alt1
        | Name "<" NonemptyListOf<TypeExpression, ","> ">" -- alt2
        | TypeExpression "." Name -- alt3
        | Name -- alt4
              
      
      newline =
        | "\n" -- alt0
        | "\r" -- alt1
              
      
      line =
        | (~newline any)* -- alt0
              
      
      comment =
        | "//" line -- alt0
              
      
      doc_comment =
        | "/*" (~"*/" any)* "*/" -- alt0
              
      
      space +=
        | comment -- alt0
              
      
      id_start =
        | letter -- alt0
        | "_" -- alt1
              
      
      id_rest =
        | id_start -- alt0
        | digit -- alt1
              
      
      id =
        | id_start id_rest* -- alt0
              
      
      kw<word> =
        | word ~id_rest -- alt0
              
      
      reserved_var =
        | "_" ~id_rest -- alt0
              
      
      binary_operator =
        | "==" -- alt0
        | ">=" -- alt1
        | ">>" -- alt2
        | ">" -- alt3
        | "<=" -- alt4
        | "<<" -- alt5
        | "<" -- alt6
        | "++" -- alt7
        | "+" -- alt8
        | "-->" -- alt9
        | "-" -- alt10
        | "**" -- alt11
        | "*" -- alt12
        | "/=" -- alt13
        | "/" -- alt14
        | and_ -- alt15
        | or_ -- alt16
        | in_ -- alt17
              
      
      unary_operator =
        | not_ -- alt0
              
      
      octal_digit =
        | "0".."7" -- alt0
        | "_" -- alt1
              
      
      hex_digit =
        | raw_hex_digit -- alt0
        | "_" -- alt1
              
      
      raw_hex_digit =
        | "0".."9" -- alt0
        | "a".."f" -- alt1
        | "A".."F" -- alt2
              
      
      bin_digit =
        | "0" -- alt0
        | "1" -- alt1
        | "_" -- alt2
              
      
      decimal_digit =
        | "0".."9" -- alt0
        | "_" -- alt1
              
      
      integral_number =
        | "0o" octal_digit+ -- alt0
        | "0x" hex_digit+ -- alt1
        | "0b" bin_digit+ -- alt2
        | ~"_" decimal_digit+ -- alt3
              
      
      integer =
        | "-" integral_number -- alt0
        | "+" integral_number -- alt1
        | integral_number -- alt2
              
      
      decimal =
        | "-" decimal_digit+ "." decimal_digit+ suffix -- alt0
        | "+" decimal_digit+ "." decimal_digit+ suffix -- alt1
        | ~"_" decimal_digit+ "." decimal_digit+ suffix -- alt2
              
      
      suffix =
        | "f" -- alt0
        |  -- alt1
              
      
      boolean =
        | true_ -- alt0
        | false_ -- alt1
              
      
      raw_character =
        | ~"\"\"\"" any -- alt0
              
      
      escape_sequence =
        | "b" -- alt0
        | "f" -- alt1
        | "n" -- alt2
        | "r" -- alt3
        | "t" -- alt4
        | "u" unicode_escape -- alt5
        | "\"" -- alt6
        | "\\" -- alt7
              
      
      unicode_escape =
        | raw_hex_digit raw_hex_digit raw_hex_digit raw_hex_digit -- alt0
              
      
      string_character =
        | ~("\"" | "\\") any -- alt0
        | "\\" escape_sequence -- alt1
              
      
      double_string =
        | "\"" string_character* "\"" -- alt0
              
      
      raw_string =
        | "\"\"\"" raw_character* "\"\"\"" -- alt0
              
      
      string =
        | raw_string -- alt0
        | double_string -- alt1
              
      
      import_ =
        | kw<"import"> -- alt0
              
      
      exposing_ =
        | kw<"exposing"> -- alt0
              
      
      as_ =
        | kw<"as"> -- alt0
              
      
      everything_ =
        | kw<"everything"> -- alt0
              
      
      export_ =
        | kw<"export"> -- alt0
              
      
      external_ =
        | kw<"external"> -- alt0
              
      
      module_ =
        | kw<"module"> -- alt0
              
      
      record_ =
        | kw<"record"> -- alt0
              
      
      union_ =
        | kw<"union"> -- alt0
              
      
      mutable_ =
        | kw<"mutable"> -- alt0
              
      
      function_ =
        | kw<"function"> -- alt0
              
      
      define_ =
        | kw<"define"> -- alt0
              
      
      let_ =
        | kw<"let"> -- alt0
              
      
      assert_ =
        | kw<"assert"> -- alt0
              
      
      unreachable_ =
        | kw<"unreachable"> -- alt0
              
      
      for_ =
        | kw<"for"> -- alt0
              
      
      each_ =
        | kw<"each"> -- alt0
              
      
      of_ =
        | kw<"of"> -- alt0
              
      
      repeat_ =
        | kw<"repeat"> -- alt0
              
      
      while_ =
        | kw<"while"> -- alt0
              
      
      until_ =
        | kw<"until"> -- alt0
              
      
      with_ =
        | kw<"with"> -- alt0
              
      
      from_ =
        | kw<"from"> -- alt0
              
      
      to_ =
        | kw<"to"> -- alt0
              
      
      by_ =
        | kw<"by"> -- alt0
              
      
      yield_ =
        | kw<"yield"> -- alt0
              
      
      if_ =
        | kw<"if"> -- alt0
              
      
      then_ =
        | kw<"then"> -- alt0
              
      
      else_ =
        | kw<"else"> -- alt0
              
      
      in_ =
        | kw<"in"> -- alt0
              
      
      and_ =
        | kw<"and"> -- alt0
              
      
      or_ =
        | kw<"or"> -- alt0
              
      
      not_ =
        | kw<"not"> -- alt0
              
      
      new_ =
        | kw<"new"> -- alt0
              
      
      lambda_ =
        | kw<"fun"> -- alt0
              
      
      do_ =
        | kw<"do"> -- alt0
              
      
      null_ =
        | kw<"null"> -- alt0
              
      
      true_ =
        | kw<"true"> -- alt0
              
      
      false_ =
        | kw<"false"> -- alt0
              
      
      match_ =
        | kw<"match"> -- alt0
              
      
      case_ =
        | kw<"case"> -- alt0
              
      
      default_ =
        | kw<"default"> -- alt0
              
      
      when_ =
        | kw<"when"> -- alt0
              
      
      reserved =
        | assert_ -- alt0
        | as_ -- alt1
        | and_ -- alt2
        | by_ -- alt3
        | case_ -- alt4
        | define_ -- alt5
        | default_ -- alt6
        | do_ -- alt7
        | exposing_ -- alt8
        | everything_ -- alt9
        | export_ -- alt10
        | each_ -- alt11
        | else_ -- alt12
        | external_ -- alt13
        | function_ -- alt14
        | for_ -- alt15
        | from_ -- alt16
        | false_ -- alt17
        | import_ -- alt18
        | if_ -- alt19
        | in_ -- alt20
        | let_ -- alt21
        | lambda_ -- alt22
        | mutable_ -- alt23
        | match_ -- alt24
        | module_ -- alt25
        | null_ -- alt26
        | not_ -- alt27
        | new_ -- alt28
        | of_ -- alt29
        | or_ -- alt30
        | record_ -- alt31
        | repeat_ -- alt32
        | to_ -- alt33
        | then_ -- alt34
        | true_ -- alt35
        | union_ -- alt36
        | unreachable_ -- alt37
        | until_ -- alt38
        | while_ -- alt39
        | with_ -- alt40
        | when_ -- alt41
        | yield_ -- alt42
              
    }
      
    """, 
    visitor
  )

let parse (rule: string) (source: string) (options: ParseOptions): Result<Module, string> = 
  let (success, value) = !!(primParser$(source, rule, options))
  if success then Ok(!!value)
  else Error(!!value)
  