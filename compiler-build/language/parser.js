"use strict"; const $rt = require('@origamitower/origami/runtime');
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Grammar = void 0;

var ast = _interopRequireWildcard(require("./ast"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

const Grammar = (() => {
  const $exports = {};

  const assocLeft = function (initial, xs, f) {
    if (!(arguments.length === 3)) throw new Error("This function takes 3 arguments, but got " + arguments.length);
    let $$ref_2 = false,
        $$ref_3 = xs,
        $$ref_4,
        $$ref_5;

    if (Array.isArray($$ref_3) && $$ref_3.length >= 1) {
      const $$ref_7 = $$ref_3[0];
      const first = $$ref_7;
      {
        const $$ref_6 = $$ref_3.slice(1);
        const rest = $$ref_6;
        {
          $$ref_2 = true;
          $$ref_4 = first;
          $$ref_5 = rest;
        }
      }
    }

    if (!$$ref_2) throw new Error("Pattern matching failed.");
    const first = $$ref_4,
          rest = $$ref_5;
    return rest.reduce(f, f(initial, first));
  };

  const binaryL = function (l, ops) {
    if (!(arguments.length === 2)) throw new Error("This function takes 2 arguments, but got " + arguments.length);
    return assocLeft(l, ops, function (l, x) {
      if (!(arguments.length === 2)) throw new Error("This function takes 2 arguments, but got " + arguments.length);
      return new ast.Expression.Binary(l, x.operator, x.expression);
    });
  };

  const sameOperator = function (xs) {
    if (!(arguments.length === 1)) throw new Error("This function takes 1 arguments, but got " + arguments.length);
    let $$ref_8 = false,
        $$ref_9 = xs,
        $$ref_10,
        $$ref_11,
        $$ref_12;

    if (Array.isArray($$ref_9) && $$ref_9.length >= 1) {
      const $$ref_14 = $$ref_9[0];

      if (Array.isArray($$ref_14) && $$ref_14.length === 2) {
        const $$ref_16 = $$ref_14[0];
        const op = $$ref_16;
        {
          const $$ref_15 = $$ref_14[1];
          const $$ignore_1 = $$ref_15;
          {
            const $$ref_13 = $$ref_9.slice(1);
            const rest = $$ref_13;
            {
              $$ref_8 = true;
              $$ref_10 = op;
              $$ref_11 = $$ignore_1;
              $$ref_12 = rest;
            }
          }
        }
      }
    }

    if (!$$ref_8) throw new Error("Pattern matching failed.");
    const op = $$ref_10,
          $$ignore_1 = $$ref_11,
          rest = $$ref_12;
    return rest.every(function (pair) {
      if (!(arguments.length === 1)) throw new Error("This function takes 1 arguments, but got " + arguments.length);
      return $rt.$equals($rt.$at(pair, 0), op);
    });
  };

  const fixDigits = function (xs) {
    if (!(arguments.length === 1)) throw new Error("This function takes 1 arguments, but got " + arguments.length);
    const re = new RegExp("_", "g");
    const digits = xs.join("").replace(re, "");
    return digits;
  };

  const grammar = $rt.$$makeParser("Origami {\nProgram  = \n   (Header)* (Definition)* end -- alt0\n\nHeader  = \n   \"%\" id \":\" line -- alt0\n\nDefinition  = \n   Import -- alt0\n  | Export -- alt1\n  | Function -- alt2\n  | Class -- alt3\n  | Module -- alt4\n\nImport  = \n   import_ String \";\" -- alt0\n  | import_ String as_ Name \";\" -- alt1\n  | import_ String exposing_ NonemptyListOf<Binding, \",\"> \";\" -- alt2\n  | import_ Name as_ Name \";\" -- alt3\n  | import_ Name exposing_ NonemptyListOf<Binding, \",\"> \";\" -- alt4\n\nBinding  = \n   Name as_ Name -- alt0\n  | default_ as_ Name -- alt1\n  | Name -- alt2\n\nExport  = \n   export_ Name as_ Name \";\" -- alt0\n  | export_ Name \";\" -- alt1\n\nFunction  = \n   Meta function_ FunctionSignature FunctionBody -- alt0\n\nFunctionBody  = \n   \"=\" Expression \";\" -- alt0\n  | Block -- alt1\n\nFunctionSignature  = \n   FunctionType Name ParamList -- alt0\n\nParamList  = \n   \"(\" \"...\" Name \")\" -- alt0\n  | \"(\" NonemptyListOf<ParamName, \",\"> \",\" \"...\" Name \")\" -- alt1\n  | \"(\" NonemptyListOf<NamedParam, \",\"> \")\" -- alt2\n  | \"(\" NonemptyListOf<ParamName, \",\"> \",\" NonemptyListOf<NamedParam, \",\"> \")\" -- alt3\n  | \"(\" ListOf<ParamName, \",\"> \")\" -- alt4\n\nParamName  = \n   Name ~(\":\") -- alt0\n\nNamedParam  = \n   Name \":\" Name \"=\" Expression -- alt0\n  | Name \":\" Name -- alt1\n\nFunctionType  = \n   (FunctionType1)? -- alt0\n\nFunctionType1  = \n   \"*\" -- alt0\n  | async_ -- alt1\n\nModule  = \n   Meta module_ Name \"{\" (ModuleDeclaration)* \"}\" -- alt0\n\nModuleDeclaration  = \n   Class -- alt0\n  | Function -- alt1\n  | Module -- alt2\n  | Export -- alt3\n  | Statement -- alt4\n\nClass  = \n   Meta data_ ClassDeclaration -- alt0\n  | Meta ClassDeclaration -- alt1\n\nClassDeclaration  = \n   class_ Name ParamList (SuperClass)? \"{\" (ClassField)* (Statement)* (ClassMember)* \"}\" -- alt0\n\nSuperClass  = \n   extends_ MemberExpression ArgList -- alt0\n\nClassField  = \n   Meta field_ Name \"=\" Expression \";\" -- alt0\n\nClassMember  = \n   Meta static_ MemberDeclaration -- alt0\n  | Meta member_ MemberDeclaration -- alt1\n\nMemberDeclaration  = \n   FunctionType Name \".\" Name ParamList MemberBlock -- alt0\n  | Name \".\" Name \"<-\" Name MemberBlock -- alt1\n  | Name \".\" Name MemberBlock -- alt2\n  | Name \"[\" Name \"]\" \"<-\" Name MemberBlock -- alt3\n  | Name \"[\" Name \"]\" MemberBlock -- alt4\n  | Name in_ Name MemberBlock -- alt5\n  | Name operator Name MemberBlock -- alt6\n  | not_ Name MemberBlock -- alt7\n\nMemberBlock  = \n   FunctionBody -- alt0\n\nMeta  = \n   (doc_comment)? (Decorator)* -- alt0\n\nDecorator  = \n   \"@\" QualifiedName CompileTimeArgList -- alt0\n\nBlock  = \n   \"{\" (Statement)* \"}\" -- alt0\n\nStatement  = \n   LetStatement -- alt0\n  | AssertStatement -- alt1\n  | LoopStatement -- alt2\n  | IfStatement -- alt3\n  | MatchStatement -- alt4\n  | Expression \";\" -- alt5\n\nLetStatement  = \n   let_ mutable_ Name \"=\" Expression \";\" -- alt0\n  | let_ Name \"=\" Expression \";\" -- alt1\n  | let_ Pattern \"=\" Expression \";\" -- alt2\n\nAssertStatement  = \n   assert_ Expression \";\" -- alt0\n\nLoopStatement  = \n   for_ each_ Name of_ Expression Block -- alt0\n  | repeat_ while_ Expression Block -- alt1\n  | repeat_ until_ Expression Block -- alt2\n  | repeat_ with_ Name from_ Expression to_ Expression Block -- alt3\n  | repeat_ with_ Name from_ Expression to_ Expression by_ Expression Block -- alt4\n  | repeat_ Block -- alt5\n\nIfStatement  = \n   if_ Expression Block AlternateStatement -- alt0\n  | if_ Expression Block -- alt1\n\nAlternateStatement  = \n   else_ IfStatement -- alt0\n  | else_ Block -- alt1\n\nMatchStatement  = \n   match_ Expression \"{\" (MatchCase)* \"}\" -- alt0\n\nMatchCase  = \n   case_ Pattern when_ Expression \":\" (Statement)* -- alt0\n  | case_ Pattern \":\" (Statement)* -- alt1\n  | default_ \":\" (Statement)* -- alt2\n\nPattern  = \n   Literal -- alt0\n  | \"[\" ArrayPattern \"]\" -- alt1\n  | \"{\" ListOf<PairPattern, \",\"> \"}\" -- alt2\n  | MemberExpression \"(\" ListOf<Pattern, \",\"> \")\" -- alt3\n  | Name -- alt4\n\nArrayPattern  = \n   NonemptyListOf<Pattern, \",\"> \",\" \"...\" Pattern -- alt0\n  | \"...\" Pattern -- alt1\n  | ListOf<Pattern, \",\"> -- alt2\n\nPairPattern  = \n   Name \":\" Pattern -- alt0\n\nExpression  = \n   IfExpression -- alt0\n  | PipeExpression -- alt1\n\nIfExpression  = \n   if_ Expression then_ Expression else_ Expression -- alt0\n\nPipeExpression  = \n   PipeExpression \"|>\" BinaryExpression -- alt0\n  | YieldAwait -- alt1\n\nYieldAwait  = \n   await_ SendExpression -- alt0\n  | yield_ \"*\" SendExpression -- alt1\n  | yield_ SendExpression -- alt2\n  | BinaryExpression -- alt3\n\nBinaryExpression  = \n   UnaryExpression (BinaryExpressionTrail<and_>)+ -- alt0\n  | UnaryExpression (BinaryExpressionTrail<or_>)+ -- alt1\n  | not_ UnaryExpression -- alt2\n  | UnaryExpression (BinaryExpressionTrail<\"++\">)+ -- alt3\n  | UnaryExpression (BinaryExpressionTrail<\">>\">)+ -- alt4\n  | UnaryExpression (BinaryExpressionTrail<\"<<\">)+ -- alt5\n  | UnaryExpression \"->\" UnaryExpression -- alt6\n  | UnaryExpression (BinaryExpressionTrail<\"+\">)+ -- alt7\n  | UnaryExpression \"**\" UnaryExpression -- alt8\n  | UnaryExpression (BinaryExpressionTrail<\"*\">)+ -- alt9\n  | UnaryExpression \"-\" UnaryExpression -- alt10\n  | UnaryExpression \"/\" UnaryExpression -- alt11\n  | UnaryExpression \"===\" UnaryExpression -- alt12\n  | UnaryExpression \"=/=\" UnaryExpression -- alt13\n  | UnaryExpression \">=\" UnaryExpression -- alt14\n  | UnaryExpression \"<=\" UnaryExpression -- alt15\n  | UnaryExpression \">\" UnaryExpression -- alt16\n  | UnaryExpression \"<\" UnaryExpression -- alt17\n\nBinaryExpressionTrail<operator>  = \n   operator UnaryExpression -- alt0\n\nUnaryExpression  = \n   SendExpression -- alt0\n\nSendExpression  = \n   SendExpression SendContinuation -- alt0\n  | AssignExpression -- alt1\n\nSendContinuation  = \n   ArgList -- alt0\n  | \".\" Name ArgList -- alt1\n  | \"[\" Expression \"]\" \"<-\" Expression -- alt2\n  | \"[\" Expression \"]\" -- alt3\n  | \".\" Name \"<-\" Expression -- alt4\n  | \".\" Name -- alt5\n\nAssignExpression  = \n   MemberExpression \"<-\" Expression -- alt0\n  | MemberExpression -- alt1\n\nMemberExpression  = \n   MemberExpression \"[\" Expression \"]\" -- alt0\n  | MemberExpression \".\" Name -- alt1\n  | NewExpression -- alt2\n\nNewExpression  = \n   new_ MemberExpression ArgList -- alt0\n  | PrimaryExpression -- alt1\n\nPrimaryExpression  = \n   ~(reserved_var) Name ~(\":\") -- alt0\n  | super_ -- alt1\n  | \"_\" -- alt2\n  | Literal -- alt3\n  | ArrayExpression -- alt4\n  | ObjectExpression -- alt5\n  | FunctionExpression -- alt6\n  | ClassExpression -- alt7\n  | \"(\" Expression \")\" -- alt8\n\nClassExpression  = \n   Class -- alt0\n\nArrayExpression  = \n   \"[\" ListOf<ArrayItem, \",\"> \"]\" -- alt0\n\nArrayItem  = \n   \"...\" Expression -- alt0\n  | Expression -- alt1\n\nObjectExpression  = \n   \"{\" ListOf<Pair, \",\"> \"}\" -- alt0\n\nFunctionExpression  = \n   FunctionType ParamList \"=>\" Block -- alt0\n  | FunctionType ParamList \"=>\" Expression -- alt1\n\nLiteral  = \n   String -- alt0\n  | Boolean -- alt1\n  | Decimal -- alt2\n  | Integer -- alt3\n  | null_ -- alt4\n\nString  = \n   string -- alt0\n\nBoolean  = \n   boolean -- alt0\n\nDecimal  = \n   decimal -- alt0\n\nInteger  = \n   integer -- alt0\n\nArgList  = \n   \"(\" ListOf<Argument, \",\"> \")\" -- alt0\n\nArgument  = \n   \"...\" Expression -- alt0\n  | Name \":\" Expression -- alt1\n  | Expression -- alt2\n\nCompileTimeArgList  = \n   \"(\" ListOf<CompileTimeArg, \",\"> \")\" -- alt0\n\nCompileTimeArg  = \n   \"[\" ListOf<CompileTimeArg, \",\"> \"]\" -- alt0\n  | \"{\" ListOf<CompileTimePair, \",\"> \"}\" -- alt1\n  | Literal -- alt2\n\nCompileTimePair  = \n   Name \":\" CompileTimeArg -- alt0\n\nPair  = \n   Name \":\" Expression -- alt0\n\nName  = \n   ~(reserved) id -- alt0\n\nQualifiedName  = \n   NonemptyListOf<Name, \".\"> -- alt0\n\nnewline  = \n   \"\\n\" -- alt0\n  | \"\\r\" -- alt1\n\nline  = \n   (~(newline) any)* -- alt0\n\ncomment  = \n   \"//\" line -- alt0\n\ndoc_comment  = \n   \"/*\" (~(\"*/\") any)* \"*/\" -- alt0\n\nspace  += \n   comment -- alt0\n\nid_start  = \n   letter -- alt0\n  | \"_\" -- alt1\n\nid_rest  = \n   id_start -- alt0\n  | digit -- alt1\n\nid  = \n   id_start (id_rest)* -- alt0\n\nkw<word>  = \n   word ~(id_rest) -- alt0\n\nreserved_var  = \n   \"_\" ~(id_rest) -- alt0\n\noperator  = \n   \"===\" -- alt0\n  | \"=/=\" -- alt1\n  | \">=\" -- alt2\n  | \">>\" -- alt3\n  | \">\" -- alt4\n  | \"<=\" -- alt5\n  | \"<<\" -- alt6\n  | \"<\" -- alt7\n  | \"++\" -- alt8\n  | \"+\" -- alt9\n  | \"->\" -- alt10\n  | \"-\" -- alt11\n  | \"**\" -- alt12\n  | \"*\" -- alt13\n  | \"/\" -- alt14\n  | and_ -- alt15\n  | or_ -- alt16\n\noctal_digit  = \n   \"0\"..\"7\" -- alt0\n  | \"_\" -- alt1\n\nhex_digit  = \n   raw_hex_digit -- alt0\n  | \"_\" -- alt1\n\nraw_hex_digit  = \n   \"0\"..\"9\" -- alt0\n  | \"a\"..\"f\" -- alt1\n  | \"A\"..\"F\" -- alt2\n\nbin_digit  = \n   \"0\" -- alt0\n  | \"1\" -- alt1\n  | \"_\" -- alt2\n\ndecimal_digit  = \n   \"0\"..\"9\" -- alt0\n  | \"_\" -- alt1\n\nintegral_number  = \n   \"0o\" (octal_digit)+ -- alt0\n  | \"0x\" (hex_digit)+ -- alt1\n  | \"0b\" (bin_digit)+ -- alt2\n  | ~(\"_\") (decimal_digit)+ -- alt3\n\nraw_character  = \n   ~(\"\\\"\\\"\\\"\") any -- alt0\n\nescape_sequence  = \n   \"b\" -- alt0\n  | \"f\" -- alt1\n  | \"n\" -- alt2\n  | \"r\" -- alt3\n  | \"t\" -- alt4\n  | \"u\" unicode_escape -- alt5\n  | \"\\\"\" -- alt6\n  | \"\\\\\" -- alt7\n\nstring_character  = \n   ~(\"\\\"\" | \"\\\\\") any -- alt0\n  | \"\\\\\" escape_sequence -- alt1\n\nunicode_escape  = \n   raw_hex_digit raw_hex_digit raw_hex_digit raw_hex_digit -- alt0\n\nstring  = \n   \"\\\"\\\"\\\"\" (raw_character)* \"\\\"\\\"\\\"\" -- alt0\n  | \"\\\"\" (string_character)* \"\\\"\" -- alt1\n\ninteger  = \n   \"-\" integral_number -- alt0\n  | \"+\" integral_number -- alt1\n  | integral_number -- alt2\n\ndecimal  = \n   \"-\" (decimal_digit)+ \".\" (decimal_digit)+ -- alt0\n  | \"+\" (decimal_digit)+ \".\" (decimal_digit)+ -- alt1\n  | ~(\"_\") (decimal_digit)+ \".\" (decimal_digit)+ -- alt2\n\nboolean  = \n   true_ -- alt0\n  | false_ -- alt1\n\nimport_  = \n   kw<\"import\"> -- alt0\n\nexposing_  = \n   kw<\"exposing\"> -- alt0\n\nas_  = \n   kw<\"as\"> -- alt0\n\nfunction_  = \n   kw<\"function\"> -- alt0\n\nasync_  = \n   kw<\"async\"> -- alt0\n\ndata_  = \n   kw<\"data\"> -- alt0\n\nclass_  = \n   kw<\"class\"> -- alt0\n\nabstract_  = \n   kw<\"abstract\"> -- alt0\n\nextends_  = \n   kw<\"extends\"> -- alt0\n\nstatic_  = \n   kw<\"static\"> -- alt0\n\nmember_  = \n   kw<\"member\"> -- alt0\n\nfield_  = \n   kw<\"field\"> -- alt0\n\nlet_  = \n   kw<\"let\"> -- alt0\n\nmutable_  = \n   kw<\"mutable\"> -- alt0\n\nassert_  = \n   kw<\"assert\"> -- alt0\n\nif_  = \n   kw<\"if\"> -- alt0\n\nthen_  = \n   kw<\"then\"> -- alt0\n\nelse_  = \n   kw<\"else\"> -- alt0\n\nand_  = \n   kw<\"and\"> -- alt0\n\nor_  = \n   kw<\"or\"> -- alt0\n\nnot_  = \n   kw<\"not\"> -- alt0\n\nawait_  = \n   kw<\"await\"> -- alt0\n\nyield_  = \n   kw<\"yield\"> -- alt0\n\nnew_  = \n   kw<\"new\"> -- alt0\n\nsuper_  = \n   kw<\"super\"> -- alt0\n\nfor_  = \n   kw<\"for\"> -- alt0\n\neach_  = \n   kw<\"each\"> -- alt0\n\nof_  = \n   kw<\"of\"> -- alt0\n\nrepeat_  = \n   kw<\"repeat\"> -- alt0\n\nwith_  = \n   kw<\"with\"> -- alt0\n\nwhile_  = \n   kw<\"while\"> -- alt0\n\nuntil_  = \n   kw<\"until\"> -- alt0\n\nfrom_  = \n   kw<\"from\"> -- alt0\n\nto_  = \n   kw<\"to\"> -- alt0\n\nby_  = \n   kw<\"by\"> -- alt0\n\ntrue_  = \n   kw<\"true\"> -- alt0\n\nfalse_  = \n   kw<\"false\"> -- alt0\n\ntry_  = \n   kw<\"try\"> -- alt0\n\nfinally_  = \n   kw<\"finally\"> -- alt0\n\ncatch_  = \n   kw<\"catch\"> -- alt0\n\nmatch_  = \n   kw<\"match\"> -- alt0\n\ncase_  = \n   kw<\"case\"> -- alt0\n\nwhen_  = \n   kw<\"when\"> -- alt0\n\ndefault_  = \n   kw<\"default\"> -- alt0\n\nnull_  = \n   kw<\"null\"> -- alt0\n\nmodule_  = \n   kw<\"module\"> -- alt0\n\nexport_  = \n   kw<\"export\"> -- alt0\n\nin_  = \n   kw<\"in\"> -- alt0\n\nreserved  = \n   abstract_ -- alt0\n  | and_ -- alt1\n  | assert_ -- alt2\n  | async_ -- alt3\n  | as_ -- alt4\n  | await_ -- alt5\n  | by_ -- alt6\n  | case_ -- alt7\n  | catch_ -- alt8\n  | class_ -- alt9\n  | data_ -- alt10\n  | default_ -- alt11\n  | each_ -- alt12\n  | else_ -- alt13\n  | export_ -- alt14\n  | exposing_ -- alt15\n  | extends_ -- alt16\n  | false_ -- alt17\n  | field_ -- alt18\n  | finally_ -- alt19\n  | for_ -- alt20\n  | from_ -- alt21\n  | function_ -- alt22\n  | if_ -- alt23\n  | import_ -- alt24\n  | in_ -- alt25\n  | let_ -- alt26\n  | match_ -- alt27\n  | member_ -- alt28\n  | module_ -- alt29\n  | mutable_ -- alt30\n  | new_ -- alt31\n  | not_ -- alt32\n  | null_ -- alt33\n  | of_ -- alt34\n  | or_ -- alt35\n  | repeat_ -- alt36\n  | static_ -- alt37\n  | super_ -- alt38\n  | then_ -- alt39\n  | to_ -- alt40\n  | true_ -- alt41\n  | try_ -- alt42\n  | until_ -- alt43\n  | with_ -- alt44\n  | when_ -- alt45\n  | while_ -- alt46\n  | yield_ -- alt47\n}", {
    Program_alt0: function (meta, h, d, $2) {
      if (!(arguments.length === 4)) throw new Error("This function takes 4 arguments, but got " + arguments.length);
      return new ast.Program(h, d);
    },
    Header_alt0: function (meta, $0, n, $2, l) {
      if (!(arguments.length === 5)) throw new Error("This function takes 5 arguments, but got " + arguments.length);
      return new ast.Header(n, l);
    },
    Import_alt0: function (meta, $0, id, $2) {
      if (!(arguments.length === 4)) throw new Error("This function takes 4 arguments, but got " + arguments.length);
      return new ast.Definition.ImportEffect(id);
    },
    Import_alt1: function (meta, $0, id, $2, n, $4) {
      if (!(arguments.length === 6)) throw new Error("This function takes 6 arguments, but got " + arguments.length);
      return new ast.Definition.Import(id, n, []);
    },
    Import_alt2: function (meta, $0, id, $2, b, $4) {
      if (!(arguments.length === 6)) throw new Error("This function takes 6 arguments, but got " + arguments.length);
      return new ast.Definition.Import(id, null, b);
    },
    Import_alt3: function (meta, $0, id, $2, n, $4) {
      if (!(arguments.length === 6)) throw new Error("This function takes 6 arguments, but got " + arguments.length);
      return new ast.Definition.ImportCore(id, n, []);
    },
    Import_alt4: function (meta, $0, id, $2, b, $4) {
      if (!(arguments.length === 6)) throw new Error("This function takes 6 arguments, but got " + arguments.length);
      return new ast.Definition.ImportCore(id, null, b);
    },
    Binding_alt0: function (meta, e, $1, l) {
      if (!(arguments.length === 4)) throw new Error("This function takes 4 arguments, but got " + arguments.length);
      return new ast.ImportBinding.Alias(e, l);
    },
    Binding_alt1: function (meta, $0, $1, l) {
      if (!(arguments.length === 4)) throw new Error("This function takes 4 arguments, but got " + arguments.length);
      return new ast.ImportBinding.Default(l);
    },
    Binding_alt2: function (meta, n) {
      if (!(arguments.length === 2)) throw new Error("This function takes 2 arguments, but got " + arguments.length);
      return new ast.ImportBinding.Alias(n, n);
    },
    Export_alt0: function (meta, $0, l, $2, e, $4) {
      if (!(arguments.length === 6)) throw new Error("This function takes 6 arguments, but got " + arguments.length);
      return new ast.Definition.ExportLocal(l, e);
    },
    Export_alt1: function (meta, $0, n, $2) {
      if (!(arguments.length === 4)) throw new Error("This function takes 4 arguments, but got " + arguments.length);
      return new ast.Definition.ExportLocal(n, n);
    },
    Function_alt0: function (meta, m, $1, s, b) {
      if (!(arguments.length === 5)) throw new Error("This function takes 5 arguments, but got " + arguments.length);
      return new ast.Definition.Function(m, s, b);
    },
    FunctionBody_alt0: function (meta, $0, e, $2) {
      if (!(arguments.length === 4)) throw new Error("This function takes 4 arguments, but got " + arguments.length);
      return [new ast.FunctionBody.Expression(e)];
    },
    FunctionBody_alt1: function (meta, b) {
      if (!(arguments.length === 2)) throw new Error("This function takes 2 arguments, but got " + arguments.length);
      return new ast.FunctionBody.Block(b);
    },
    FunctionSignature_alt0: function (meta, t, n, p) {
      if (!(arguments.length === 4)) throw new Error("This function takes 4 arguments, but got " + arguments.length);
      return new ast.FunctionSignature(t, n, p);
    },
    ParamList_alt0: function (meta, $0, $1, n, $3) {
      if (!(arguments.length === 5)) throw new Error("This function takes 5 arguments, but got " + arguments.length);
      return new ast.Parameters.Spread([], n);
    },
    ParamList_alt1: function (meta, $0, p, $2, $3, n, $5) {
      if (!(arguments.length === 7)) throw new Error("This function takes 7 arguments, but got " + arguments.length);
      return new ast.Parameters.Spread(p, n);
    },
    ParamList_alt2: function (meta, $0, np, $2) {
      if (!(arguments.length === 4)) throw new Error("This function takes 4 arguments, but got " + arguments.length);
      return new ast.Parameters.Regular([], np);
    },
    ParamList_alt3: function (meta, $0, p, $2, np, $4) {
      if (!(arguments.length === 6)) throw new Error("This function takes 6 arguments, but got " + arguments.length);
      return new ast.Parameters.Regular(p, np);
    },
    ParamList_alt4: function (meta, $0, p, $2) {
      if (!(arguments.length === 4)) throw new Error("This function takes 4 arguments, but got " + arguments.length);
      return new ast.Parameters.Regular(p, []);
    },
    ParamName_alt0: function (meta, n) {
      if (!(arguments.length === 2)) throw new Error("This function takes 2 arguments, but got " + arguments.length);
      return n;
    },
    NamedParam_alt0: function (meta, k, $1, v, $3, e) {
      if (!(arguments.length === 6)) throw new Error("This function takes 6 arguments, but got " + arguments.length);
      return new ast.NamedParameter(k, v, e);
    },
    NamedParam_alt1: function (meta, k, $1, v) {
      if (!(arguments.length === 4)) throw new Error("This function takes 4 arguments, but got " + arguments.length);
      return new ast.NamedParameter(k, v, new ast.Literal.Null());
    },
    FunctionType_alt0: function (meta, t) {
      if (!(arguments.length === 2)) throw new Error("This function takes 2 arguments, but got " + arguments.length);
      return $rt.$equals(t, null) ? new ast.FunctionKind.Regular() : t;
    },
    FunctionType1_alt0: function (meta, $0) {
      if (!(arguments.length === 2)) throw new Error("This function takes 2 arguments, but got " + arguments.length);
      return new ast.FunctionKind.Regular();
    },
    FunctionType1_alt1: function (meta, $0) {
      if (!(arguments.length === 2)) throw new Error("This function takes 2 arguments, but got " + arguments.length);
      return new ast.FunctionKind.Async();
    },
    Module_alt0: function (meta, m, $1, n, $3, d, $5) {
      if (!(arguments.length === 7)) throw new Error("This function takes 7 arguments, but got " + arguments.length);
      return new ast.Definition.Module(m, n, d);
    },
    ModuleDeclaration_alt0: function (meta, c) {
      if (!(arguments.length === 2)) throw new Error("This function takes 2 arguments, but got " + arguments.length);
      return new ast.ModuleDeclaration.Definition(c);
    },
    ModuleDeclaration_alt1: function (meta, f) {
      if (!(arguments.length === 2)) throw new Error("This function takes 2 arguments, but got " + arguments.length);
      return new ast.ModuleDeclaration.Definition(f);
    },
    ModuleDeclaration_alt2: function (meta, m) {
      if (!(arguments.length === 2)) throw new Error("This function takes 2 arguments, but got " + arguments.length);
      return new ast.ModuleDeclaration.Definition(m);
    },
    ModuleDeclaration_alt3: function (meta, e) {
      if (!(arguments.length === 2)) throw new Error("This function takes 2 arguments, but got " + arguments.length);
      return new ast.ModuleDeclaration.Definition(e);
    },
    ModuleDeclaration_alt4: function (meta, l) {
      if (!(arguments.length === 2)) throw new Error("This function takes 2 arguments, but got " + arguments.length);
      return new ast.ModuleDeclaration.Statement(l);
    },
    Class_alt0: function (meta, m, $1, c) {
      if (!(arguments.length === 4)) throw new Error("This function takes 4 arguments, but got " + arguments.length);
      return new ast.Definition.DataClass(m, c);
    },
    Class_alt1: function (meta, m, c) {
      if (!(arguments.length === 3)) throw new Error("This function takes 3 arguments, but got " + arguments.length);
      return new ast.Definition.Class(m, c);
    },
    ClassDeclaration_alt0: function (meta, $0, n, p, s, $4, f, b, m, $8) {
      if (!(arguments.length === 10)) throw new Error("This function takes 10 arguments, but got " + arguments.length);
      return new ast.Class(n, p, s, f, b, m);
    },
    SuperClass_alt0: function (meta, $0, o, a) {
      if (!(arguments.length === 4)) throw new Error("This function takes 4 arguments, but got " + arguments.length);
      return new ast.Superclass(o, a);
    },
    ClassField_alt0: function (meta, m, $1, n, $3, e, $5) {
      if (!(arguments.length === 7)) throw new Error("This function takes 7 arguments, but got " + arguments.length);
      return new ast.ClassField(m, n, e);
    },
    ClassMember_alt0: function (meta, m, $1, d) {
      if (!(arguments.length === 4)) throw new Error("This function takes 4 arguments, but got " + arguments.length);
      return new ast.ClassMember(m, new ast.MemberKind.Static(), d);
    },
    ClassMember_alt1: function (meta, m, $1, d) {
      if (!(arguments.length === 4)) throw new Error("This function takes 4 arguments, but got " + arguments.length);
      return new ast.ClassMember(m, new ast.MemberKind.Instance(), d);
    },
    MemberDeclaration_alt0: function (meta, t, s, $2, m, p, b) {
      if (!(arguments.length === 7)) throw new Error("This function takes 7 arguments, but got " + arguments.length);
      return new ast.MemberDeclaration.Method(t, s, m, p, b);
    },
    MemberDeclaration_alt1: function (meta, s, $1, n, $3, p, b) {
      if (!(arguments.length === 7)) throw new Error("This function takes 7 arguments, but got " + arguments.length);
      return new ast.MemberDeclaration.Setter(s, n, p, b);
    },
    MemberDeclaration_alt2: function (meta, s, $1, n, b) {
      if (!(arguments.length === 5)) throw new Error("This function takes 5 arguments, but got " + arguments.length);
      return new ast.MemberDeclaration.Getter(s, n, b);
    },
    MemberDeclaration_alt3: function (meta, s, $1, k, $3, $4, p, b) {
      if (!(arguments.length === 8)) throw new Error("This function takes 8 arguments, but got " + arguments.length);
      return new ast.MemberDeclaration.AtPut(s, k, p, b);
    },
    MemberDeclaration_alt4: function (meta, s, $1, k, $3, b) {
      if (!(arguments.length === 6)) throw new Error("This function takes 6 arguments, but got " + arguments.length);
      return new ast.MemberDeclaration.At(s, k, b);
    },
    MemberDeclaration_alt5: function (meta, p, $1, s, b) {
      if (!(arguments.length === 5)) throw new Error("This function takes 5 arguments, but got " + arguments.length);
      return new ast.MemberDeclaration.In(s, p, b);
    },
    MemberDeclaration_alt6: function (meta, s, o, p, b) {
      if (!(arguments.length === 5)) throw new Error("This function takes 5 arguments, but got " + arguments.length);
      return new ast.MemberDeclaration.Binary(s, o, p, b);
    },
    MemberDeclaration_alt7: function (meta, $0, s, b) {
      if (!(arguments.length === 4)) throw new Error("This function takes 4 arguments, but got " + arguments.length);
      return new ast.MemberDeclaration.Unary(s, "not", b);
    },
    Meta_alt0: function (meta, c, d) {
      if (!(arguments.length === 3)) throw new Error("This function takes 3 arguments, but got " + arguments.length);
      return new ast.Metadata(c, d);
    },
    Decorator_alt0: function (meta, $0, q, a) {
      if (!(arguments.length === 4)) throw new Error("This function takes 4 arguments, but got " + arguments.length);
      return new ast.Decorator(q, a);
    },
    Block_alt0: function (meta, $0, s, $2) {
      if (!(arguments.length === 4)) throw new Error("This function takes 4 arguments, but got " + arguments.length);
      return s;
    },
    Statement_alt5: function (meta, e, $1) {
      if (!(arguments.length === 3)) throw new Error("This function takes 3 arguments, but got " + arguments.length);
      return new ast.Statement.Expression(e);
    },
    LetStatement_alt0: function (meta, $0, $1, n, $3, e, $5) {
      if (!(arguments.length === 7)) throw new Error("This function takes 7 arguments, but got " + arguments.length);
      return new ast.Statement.LetMutable(n, e);
    },
    LetStatement_alt1: function (meta, $0, n, $2, e, $4) {
      if (!(arguments.length === 6)) throw new Error("This function takes 6 arguments, but got " + arguments.length);
      return new ast.Statement.Let(n, e);
    },
    LetStatement_alt2: function (meta, $0, p, $2, e, $4) {
      if (!(arguments.length === 6)) throw new Error("This function takes 6 arguments, but got " + arguments.length);
      return new ast.Statement.LetMatch(p, e);
    },
    AssertStatement_alt0: function (meta, $0, e, $2) {
      if (!(arguments.length === 4)) throw new Error("This function takes 4 arguments, but got " + arguments.length);
      return new ast.Statement.Assert(e);
    },
    LoopStatement_alt0: function (meta, $0, $1, n, $3, e, b) {
      if (!(arguments.length === 7)) throw new Error("This function takes 7 arguments, but got " + arguments.length);
      return new ast.Statement.Foreach(n, e, b);
    },
    LoopStatement_alt1: function (meta, $0, $1, e, b) {
      if (!(arguments.length === 5)) throw new Error("This function takes 5 arguments, but got " + arguments.length);
      return new ast.Statement.While(e, b);
    },
    LoopStatement_alt2: function (meta, $0, $1, e, b) {
      if (!(arguments.length === 5)) throw new Error("This function takes 5 arguments, but got " + arguments.length);
      return new ast.Statement.Until(e, b);
    },
    LoopStatement_alt3: function (meta, $0, $1, n, $3, s, $5, e, b) {
      if (!(arguments.length === 9)) throw new Error("This function takes 9 arguments, but got " + arguments.length);
      const one = new ast.Expression.Literal(new ast.Literal.Integer(new ast.Sign.Unsigned(), "1"));
      return new ast.Statement.For(n, s, e, one, b);
    },
    LoopStatement_alt4: function (meta, $0, $1, n, $3, s, $5, e, $7, st, b) {
      if (!(arguments.length === 11)) throw new Error("This function takes 11 arguments, but got " + arguments.length);
      return new ast.Statement.For(n, s, e, st, b);
    },
    LoopStatement_alt5: function (meta, $0, b) {
      if (!(arguments.length === 3)) throw new Error("This function takes 3 arguments, but got " + arguments.length);
      return new ast.Statement.Repeat(b);
    },
    IfStatement_alt0: function (meta, $0, t, b, a) {
      if (!(arguments.length === 5)) throw new Error("This function takes 5 arguments, but got " + arguments.length);
      return new ast.Statement.IfElse(t, b, a);
    },
    IfStatement_alt1: function (meta, $0, t, b) {
      if (!(arguments.length === 4)) throw new Error("This function takes 4 arguments, but got " + arguments.length);
      return new ast.Statement.If(t, b);
    },
    AlternateStatement_alt0: function (meta, $0, i) {
      if (!(arguments.length === 3)) throw new Error("This function takes 3 arguments, but got " + arguments.length);
      return new ast.Alternate.If(i);
    },
    AlternateStatement_alt1: function (meta, $0, b) {
      if (!(arguments.length === 3)) throw new Error("This function takes 3 arguments, but got " + arguments.length);
      return new ast.Alternate.Block(b);
    },
    MatchStatement_alt0: function (meta, $0, e, $2, c, $4) {
      if (!(arguments.length === 6)) throw new Error("This function takes 6 arguments, but got " + arguments.length);
      return new ast.Statement.Match(e, c);
    },
    MatchCase_alt0: function (meta, $0, p, $2, t, $4, b) {
      if (!(arguments.length === 7)) throw new Error("This function takes 7 arguments, but got " + arguments.length);
      return new ast.MatchCase.When(p, t, b);
    },
    MatchCase_alt1: function (meta, $0, p, $2, b) {
      if (!(arguments.length === 5)) throw new Error("This function takes 5 arguments, but got " + arguments.length);
      return new ast.MatchCase.Case(p, b);
    },
    MatchCase_alt2: function (meta, $0, $1, b) {
      if (!(arguments.length === 4)) throw new Error("This function takes 4 arguments, but got " + arguments.length);
      return new ast.MatchCase.Default(b);
    },
    Pattern_alt0: function (meta, l) {
      if (!(arguments.length === 2)) throw new Error("This function takes 2 arguments, but got " + arguments.length);
      return new ast.Pattern.Literal(l);
    },
    Pattern_alt1: function (meta, $0, a, $2) {
      if (!(arguments.length === 4)) throw new Error("This function takes 4 arguments, but got " + arguments.length);
      return new ast.Pattern.Array(a);
    },
    Pattern_alt2: function (meta, $0, p, $2) {
      if (!(arguments.length === 4)) throw new Error("This function takes 4 arguments, but got " + arguments.length);
      return new ast.Pattern.Object(p);
    },
    Pattern_alt3: function (meta, o, $1, p, $3) {
      if (!(arguments.length === 5)) throw new Error("This function takes 5 arguments, but got " + arguments.length);
      return new ast.Pattern.Extractor(o, p);
    },
    Pattern_alt4: function (meta, n) {
      if (!(arguments.length === 2)) throw new Error("This function takes 2 arguments, but got " + arguments.length);
      return new ast.Pattern.Bind(n);
    },
    ArrayPattern_alt0: function (meta, h, $1, $2, t) {
      if (!(arguments.length === 5)) throw new Error("This function takes 5 arguments, but got " + arguments.length);
      return new ast.ArrayPattern.Spread(h, t);
    },
    ArrayPattern_alt1: function (meta, $0, p) {
      if (!(arguments.length === 3)) throw new Error("This function takes 3 arguments, but got " + arguments.length);
      return new ast.ArrayPattern.Spread([], p);
    },
    ArrayPattern_alt2: function (meta, p) {
      if (!(arguments.length === 2)) throw new Error("This function takes 2 arguments, but got " + arguments.length);
      return new ast.ArrayPattern.Fixed(p);
    },
    PairPattern_alt0: function (meta, n, $1, p) {
      if (!(arguments.length === 4)) throw new Error("This function takes 4 arguments, but got " + arguments.length);
      return new ast.PairPattern(n, p);
    },
    IfExpression_alt0: function (meta, $0, t, $2, c, $4, a) {
      if (!(arguments.length === 7)) throw new Error("This function takes 7 arguments, but got " + arguments.length);
      return new ast.Expression.IfThenElse(t, c, a);
    },
    PipeExpression_alt0: function (meta, l, $1, r) {
      if (!(arguments.length === 4)) throw new Error("This function takes 4 arguments, but got " + arguments.length);
      return new ast.Expression.Pipe(l, r);
    },
    YieldAwait_alt0: function (meta, $0, e) {
      if (!(arguments.length === 3)) throw new Error("This function takes 3 arguments, but got " + arguments.length);
      return new ast.Expression.Await(e);
    },
    YieldAwait_alt1: function (meta, $0, $1, e) {
      if (!(arguments.length === 4)) throw new Error("This function takes 4 arguments, but got " + arguments.length);
      return new ast.Expression.YieldAll(e);
    },
    YieldAwait_alt2: function (meta, $0, e) {
      if (!(arguments.length === 3)) throw new Error("This function takes 3 arguments, but got " + arguments.length);
      return new ast.Expression.Yield(e);
    },
    BinaryExpression_alt0: function (meta, l, t) {
      if (!(arguments.length === 3)) throw new Error("This function takes 3 arguments, but got " + arguments.length);
      return binaryL(l, t);
    },
    BinaryExpression_alt1: function (meta, l, t) {
      if (!(arguments.length === 3)) throw new Error("This function takes 3 arguments, but got " + arguments.length);
      return binaryL(l, t);
    },
    BinaryExpression_alt2: function (meta, $0, e) {
      if (!(arguments.length === 3)) throw new Error("This function takes 3 arguments, but got " + arguments.length);
      return new ast.Expression.Unary("not", e);
    },
    BinaryExpression_alt3: function (meta, l, t) {
      if (!(arguments.length === 3)) throw new Error("This function takes 3 arguments, but got " + arguments.length);
      return binaryL(l, t);
    },
    BinaryExpression_alt4: function (meta, l, t) {
      if (!(arguments.length === 3)) throw new Error("This function takes 3 arguments, but got " + arguments.length);
      return binaryL(l, t);
    },
    BinaryExpression_alt5: function (meta, l, t) {
      if (!(arguments.length === 3)) throw new Error("This function takes 3 arguments, but got " + arguments.length);
      return binaryL(l, t);
    },
    BinaryExpression_alt6: function (meta, l, $1, r) {
      if (!(arguments.length === 4)) throw new Error("This function takes 4 arguments, but got " + arguments.length);
      return new ast.Expression.Binary("->", l, r);
    },
    BinaryExpression_alt7: function (meta, l, t) {
      if (!(arguments.length === 3)) throw new Error("This function takes 3 arguments, but got " + arguments.length);
      return binaryL(l, t);
    },
    BinaryExpression_alt8: function (meta, l, $1, r) {
      if (!(arguments.length === 4)) throw new Error("This function takes 4 arguments, but got " + arguments.length);
      return new ast.Expression.Binary("**", l, r);
    },
    BinaryExpression_alt9: function (meta, l, t) {
      if (!(arguments.length === 3)) throw new Error("This function takes 3 arguments, but got " + arguments.length);
      return binaryL(l, t);
    },
    BinaryExpression_alt10: function (meta, l, $1, r) {
      if (!(arguments.length === 4)) throw new Error("This function takes 4 arguments, but got " + arguments.length);
      return new ast.Expression.Binary("-", l, r);
    },
    BinaryExpression_alt11: function (meta, l, $1, r) {
      if (!(arguments.length === 4)) throw new Error("This function takes 4 arguments, but got " + arguments.length);
      return new ast.Expression.Binary("/", l, r);
    },
    BinaryExpression_alt12: function (meta, l, $1, r) {
      if (!(arguments.length === 4)) throw new Error("This function takes 4 arguments, but got " + arguments.length);
      return new ast.Expression.Binary("===", l, r);
    },
    BinaryExpression_alt13: function (meta, l, $1, r) {
      if (!(arguments.length === 4)) throw new Error("This function takes 4 arguments, but got " + arguments.length);
      return new ast.Expression.Binary("=/=", l, r);
    },
    BinaryExpression_alt14: function (meta, l, $1, r) {
      if (!(arguments.length === 4)) throw new Error("This function takes 4 arguments, but got " + arguments.length);
      return new ast.Expression.Binary(">=", l, r);
    },
    BinaryExpression_alt15: function (meta, l, $1, r) {
      if (!(arguments.length === 4)) throw new Error("This function takes 4 arguments, but got " + arguments.length);
      return new ast.Expression.Binary("<=", l, r);
    },
    BinaryExpression_alt16: function (meta, l, $1, r) {
      if (!(arguments.length === 4)) throw new Error("This function takes 4 arguments, but got " + arguments.length);
      return new ast.Expression.Binary(">", l, r);
    },
    BinaryExpression_alt17: function (meta, l, $1, r) {
      if (!(arguments.length === 4)) throw new Error("This function takes 4 arguments, but got " + arguments.length);
      return new ast.Expression.Binary("<", l, r);
    },
    BinaryExpressionTrail_alt0: function (meta, op, e) {
      if (!(arguments.length === 3)) throw new Error("This function takes 3 arguments, but got " + arguments.length);
      return {
        operator: op,
        expression: e
      };
    },
    SendExpression_alt0: function (meta, s, k) {
      if (!(arguments.length === 3)) throw new Error("This function takes 3 arguments, but got " + arguments.length);
      return k(s);
    },
    SendContinuation_alt0: function (meta, a) {
      if (!(arguments.length === 2)) throw new Error("This function takes 2 arguments, but got " + arguments.length);
      return function (x) {
        if (!(arguments.length === 1)) throw new Error("This function takes 1 arguments, but got " + arguments.length);
        return new ast.Expression.Call(x, a);
      };
    },
    SendContinuation_alt1: function (meta, $0, m, a) {
      if (!(arguments.length === 4)) throw new Error("This function takes 4 arguments, but got " + arguments.length);
      return function (x) {
        if (!(arguments.length === 1)) throw new Error("This function takes 1 arguments, but got " + arguments.length);
        return new ast.Expression.MethodCall(x, m, a);
      };
    },
    SendContinuation_alt2: function (meta, $0, k, $2, $3, v) {
      if (!(arguments.length === 6)) throw new Error("This function takes 6 arguments, but got " + arguments.length);
      return function (x) {
        if (!(arguments.length === 1)) throw new Error("This function takes 1 arguments, but got " + arguments.length);
        return new ast.Expression.AtPut(x, k, v);
      };
    },
    SendContinuation_alt3: function (meta, $0, k, $2) {
      if (!(arguments.length === 4)) throw new Error("This function takes 4 arguments, but got " + arguments.length);
      return function (x) {
        if (!(arguments.length === 1)) throw new Error("This function takes 1 arguments, but got " + arguments.length);
        return new ast.Expression.At(x, k);
      };
    },
    SendContinuation_alt4: function (meta, $0, n, $2, v) {
      if (!(arguments.length === 5)) throw new Error("This function takes 5 arguments, but got " + arguments.length);
      return function (x) {
        if (!(arguments.length === 1)) throw new Error("This function takes 1 arguments, but got " + arguments.length);
        return new ast.Expression.Set(x, n, v);
      };
    },
    SendContinuation_alt5: function (meta, $0, n) {
      if (!(arguments.length === 3)) throw new Error("This function takes 3 arguments, but got " + arguments.length);
      return function (x) {
        if (!(arguments.length === 1)) throw new Error("This function takes 1 arguments, but got " + arguments.length);
        return new ast.Expression.Get(x, n);
      };
    },
    AssignExpression_alt0: function (meta, m, $1, e) {
      if (!(arguments.length === 4)) throw new Error("This function takes 4 arguments, but got " + arguments.length);
      {
        const $$ref_17 = m;
        let $$ref_18 = false;
        {
          const $$ref_19 = ast.Expression.Get.unapply($$ref_17);

          if ($$ref_19 != null) {
            if (!Array.isArray($$ref_19)) throw new Error("unapply() must return null or an array");
            {
              const $$ref_21 = $$ref_19[0];
              const o = $$ref_21;
              {
                const $$ref_20 = $$ref_19[1];
                const p = $$ref_20;
                {
                  return new ast.Expression.Set(o, p, e);
                  $$ref_18 = true;
                }
              }
            }
          }
        }
        {
          const $$ref_22 = ast.Expression.At.unapply($$ref_17);

          if ($$ref_22 != null) {
            if (!Array.isArray($$ref_22)) throw new Error("unapply() must return null or an array");
            {
              const $$ref_24 = $$ref_22[0];
              const o = $$ref_24;
              {
                const $$ref_23 = $$ref_22[1];
                const k = $$ref_23;
                {
                  return new ast.Expression.AtPut(o, k, e);
                  $$ref_18 = true;
                }
              }
            }
          }
        }
        {
          const $$ref_25 = ast.Expression.Variable.unapply($$ref_17);

          if ($$ref_25 != null) {
            if (!Array.isArray($$ref_25)) throw new Error("unapply() must return null or an array");
            {
              const $$ref_26 = $$ref_25[0];
              const n = $$ref_26;
              {
                return new ast.Expression.Assign(m, e);
                $$ref_18 = true;
              }
            }
          }
        }
        if (!$$ref_18) throw new Error("Pattern matching failed");
      }
    },
    MemberExpression_alt0: function (meta, m, $1, k, $3) {
      if (!(arguments.length === 5)) throw new Error("This function takes 5 arguments, but got " + arguments.length);
      return new ast.Expression.At(m, k);
    },
    MemberExpression_alt1: function (meta, m, $1, n) {
      if (!(arguments.length === 4)) throw new Error("This function takes 4 arguments, but got " + arguments.length);
      return new ast.Expression.Get(m, n);
    },
    NewExpression_alt0: function (meta, $0, m, a) {
      if (!(arguments.length === 4)) throw new Error("This function takes 4 arguments, but got " + arguments.length);
      return new ast.Expression.New(m, a);
    },
    PrimaryExpression_alt0: function (meta, n) {
      if (!(arguments.length === 2)) throw new Error("This function takes 2 arguments, but got " + arguments.length);
      return new ast.Expression.Variable(n);
    },
    PrimaryExpression_alt1: function (meta, $0) {
      if (!(arguments.length === 2)) throw new Error("This function takes 2 arguments, but got " + arguments.length);
      return new ast.Expression.Super();
    },
    PrimaryExpression_alt2: function (meta, $0) {
      if (!(arguments.length === 2)) throw new Error("This function takes 2 arguments, but got " + arguments.length);
      return new ast.Expression.Hole();
    },
    PrimaryExpression_alt3: function (meta, l) {
      if (!(arguments.length === 2)) throw new Error("This function takes 2 arguments, but got " + arguments.length);
      return new ast.Expression.Literal(l);
    },
    PrimaryExpression_alt8: function (meta, $0, e, $2) {
      if (!(arguments.length === 4)) throw new Error("This function takes 4 arguments, but got " + arguments.length);
      return e;
    },
    ClassExpression_alt0: function (meta, c) {
      if (!(arguments.length === 2)) throw new Error("This function takes 2 arguments, but got " + arguments.length);
      return new ast.Expression.Class(c);
    },
    ArrayExpression_alt0: function (meta, $0, xs, $2) {
      if (!(arguments.length === 4)) throw new Error("This function takes 4 arguments, but got " + arguments.length);
      return new ast.Expression.Array(xs);
    },
    ArrayItem_alt0: function (meta, $0, e) {
      if (!(arguments.length === 3)) throw new Error("This function takes 3 arguments, but got " + arguments.length);
      return new ast.SequenceItem.Spread(e);
    },
    ArrayItem_alt1: function (meta, e) {
      if (!(arguments.length === 2)) throw new Error("This function takes 2 arguments, but got " + arguments.length);
      return new ast.SequenceItem.Element(e);
    },
    ObjectExpression_alt0: function (meta, $0, p, $2) {
      if (!(arguments.length === 4)) throw new Error("This function takes 4 arguments, but got " + arguments.length);
      return new ast.Expression.Object(p);
    },
    FunctionExpression_alt0: function (meta, t, p, $2, b) {
      if (!(arguments.length === 5)) throw new Error("This function takes 5 arguments, but got " + arguments.length);
      return new ast.Expression.Function(t, p, new ast.FunctionBody.Block(b));
    },
    FunctionExpression_alt1: function (meta, t, p, $2, e) {
      if (!(arguments.length === 5)) throw new Error("This function takes 5 arguments, but got " + arguments.length);
      return new ast.Expression.Function(t, p, new ast.FunctionBody.Expression(e));
    },
    Literal_alt4: function (meta, $0) {
      if (!(arguments.length === 2)) throw new Error("This function takes 2 arguments, but got " + arguments.length);
      return new ast.Literal.Null();
    },
    ArgList_alt0: function (meta, $0, x, $2) {
      if (!(arguments.length === 4)) throw new Error("This function takes 4 arguments, but got " + arguments.length);
      const positional = x.filter(function (x) {
        if (!(arguments.length === 1)) throw new Error("This function takes 1 arguments, but got " + arguments.length);
        return $rt.$not($rt.$is(x, ast.NamedParameter));
      });
      const named = x.filter(function (x) {
        if (!(arguments.length === 1)) throw new Error("This function takes 1 arguments, but got " + arguments.length);
        return $rt.$is(x, ast.NamedParameter);
      });
      return new ast.Arguments(positional, named);
    },
    Argument_alt0: function (meta, $0, e) {
      if (!(arguments.length === 3)) throw new Error("This function takes 3 arguments, but got " + arguments.length);
      return new ast.Argument.Spread(e);
    },
    Argument_alt1: function (meta, n, $1, e) {
      if (!(arguments.length === 4)) throw new Error("This function takes 4 arguments, but got " + arguments.length);
      return new ast.Argument.Named(n, e);
    },
    Argument_alt2: function (meta, e) {
      if (!(arguments.length === 2)) throw new Error("This function takes 2 arguments, but got " + arguments.length);
      return new ast.Argument.Positional(e);
    },
    CompileTimeArg_alt0: function (meta, $0, x, $2) {
      if (!(arguments.length === 4)) throw new Error("This function takes 4 arguments, but got " + arguments.length);
      return new ast.MacroLiteral.Array(x);
    },
    CompileTimeArg_alt1: function (meta, $0, x, $2) {
      if (!(arguments.length === 4)) throw new Error("This function takes 4 arguments, but got " + arguments.length);
      return new ast.MacroLiteral.Object(x);
    },
    CompileTimeArg_alt2: function (meta, l) {
      if (!(arguments.length === 2)) throw new Error("This function takes 2 arguments, but got " + arguments.length);
      return new ast.MacroLiteral.Literal(x);
    },
    CompileTimePair_alt0: function (meta, n, $1, e) {
      if (!(arguments.length === 4)) throw new Error("This function takes 4 arguments, but got " + arguments.length);
      return new ast.MacroPair(n, e);
    },
    Pair_alt0: function (meta, n, $1, e) {
      if (!(arguments.length === 4)) throw new Error("This function takes 4 arguments, but got " + arguments.length);
      return new ast.Pair(n, e);
    },
    Name_alt0: function (meta, n) {
      if (!(arguments.length === 2)) throw new Error("This function takes 2 arguments, but got " + arguments.length);
      return n;
    },
    QualifiedName_alt0: function (meta, x) {
      if (!(arguments.length === 2)) throw new Error("This function takes 2 arguments, but got " + arguments.length);
      return x;
    },
    integral_number_alt0: function (meta, $0, d) {
      if (!(arguments.length === 3)) throw new Error("This function takes 3 arguments, but got " + arguments.length);
      return String(parseInt(fixDigits(d), 8));
    },
    integral_number_alt1: function (meta, $0, d) {
      if (!(arguments.length === 3)) throw new Error("This function takes 3 arguments, but got " + arguments.length);
      return String(parseInt(fixDigits(d), 16));
    },
    integral_number_alt2: function (meta, $0, d) {
      if (!(arguments.length === 3)) throw new Error("This function takes 3 arguments, but got " + arguments.length);
      return String(parseInt(fixDigits(d), 2));
    },
    integral_number_alt3: function (meta, d) {
      if (!(arguments.length === 2)) throw new Error("This function takes 2 arguments, but got " + arguments.length);
      return fixDigits(d);
    },
    escape_sequence_alt0: function (meta, $0) {
      if (!(arguments.length === 2)) throw new Error("This function takes 2 arguments, but got " + arguments.length);
      return "\b";
    },
    escape_sequence_alt1: function (meta, $0) {
      if (!(arguments.length === 2)) throw new Error("This function takes 2 arguments, but got " + arguments.length);
      return "\f";
    },
    escape_sequence_alt2: function (meta, $0) {
      if (!(arguments.length === 2)) throw new Error("This function takes 2 arguments, but got " + arguments.length);
      return "\n";
    },
    escape_sequence_alt3: function (meta, $0) {
      if (!(arguments.length === 2)) throw new Error("This function takes 2 arguments, but got " + arguments.length);
      return "\r";
    },
    escape_sequence_alt4: function (meta, $0) {
      if (!(arguments.length === 2)) throw new Error("This function takes 2 arguments, but got " + arguments.length);
      return "\t";
    },
    escape_sequence_alt5: function (meta, $0, e) {
      if (!(arguments.length === 3)) throw new Error("This function takes 3 arguments, but got " + arguments.length);
      return String.fromCodePoint(parseInt(e, 16));
    },
    escape_sequence_alt6: function (meta, $0) {
      if (!(arguments.length === 2)) throw new Error("This function takes 2 arguments, but got " + arguments.length);
      return "\"";
    },
    escape_sequence_alt7: function (meta, $0) {
      if (!(arguments.length === 2)) throw new Error("This function takes 2 arguments, but got " + arguments.length);
      return "\\";
    },
    string_character_alt1: function (meta, $0, e) {
      if (!(arguments.length === 3)) throw new Error("This function takes 3 arguments, but got " + arguments.length);
      return e;
    },
    string_alt0: function (meta, $0, cs, $2) {
      if (!(arguments.length === 4)) throw new Error("This function takes 4 arguments, but got " + arguments.length);
      return cs.join("");
    },
    string_alt1: function (meta, $0, cs, $2) {
      if (!(arguments.length === 4)) throw new Error("This function takes 4 arguments, but got " + arguments.length);
      return cs.join("");
    },
    integer_alt0: function (meta, $0, i) {
      if (!(arguments.length === 3)) throw new Error("This function takes 3 arguments, but got " + arguments.length);
      return new ast.Literal.Integer(new ast.Sign.Negative(), i);
    },
    integer_alt1: function (meta, $0, i) {
      if (!(arguments.length === 3)) throw new Error("This function takes 3 arguments, but got " + arguments.length);
      return new ast.Literal.Integer(new ast.Sign.Positive(), i);
    },
    integer_alt2: function (meta, i) {
      if (!(arguments.length === 2)) throw new Error("This function takes 2 arguments, but got " + arguments.length);
      return new ast.Literal.Integer(new ast.Sign.Unsigned(), i);
    },
    decimal_alt0: function (meta, $0, i, $2, d) {
      if (!(arguments.length === 5)) throw new Error("This function takes 5 arguments, but got " + arguments.length);
      return new ast.Literal.Decimal(new ast.Sign.Negative(), fixDigits(i), fixDigits(d));
    },
    decimal_alt1: function (meta, $0, i, $2, d) {
      if (!(arguments.length === 5)) throw new Error("This function takes 5 arguments, but got " + arguments.length);
      return new ast.Literal.Decimal(new ast.Sign.Positive(), fixDigits(i), fixDigits(d));
    },
    decimal_alt2: function (meta, i, $1, d) {
      if (!(arguments.length === 4)) throw new Error("This function takes 4 arguments, but got " + arguments.length);
      return new ast.Literal.Decimal(new ast.Sign.Unsigned(), fixDigits(i), fixDigits(d));
    },
    boolean_alt0: function (meta, $0) {
      if (!(arguments.length === 2)) throw new Error("This function takes 2 arguments, but got " + arguments.length);
      return new ast.Literal.Boolean(true);
    },
    boolean_alt1: function (meta, $0) {
      if (!(arguments.length === 2)) throw new Error("This function takes 2 arguments, but got " + arguments.length);
      return new ast.Literal.Boolean(false);
    }
  });

  function parse(source) {
    if (!(arguments.length === 1)) throw new Error("parse takes 1 arguments, but got " + arguments.length);
    return grammar.parse(source);
  }

  $exports.parse = parse;
  return $exports;
})();

exports.Grammar = Grammar;
