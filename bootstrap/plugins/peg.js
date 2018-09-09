const ohm = require("ohm-js");
const { toAST } = require("ohm-js/extras");
const { flatmap } = require("../utils");
const { inspect } = require("util");

module.exports = ast => {
  const {
    visitor: origamiVisitor,
    grammar: origamiGrammar
  } = require("../parser");

  const grammar = ohm.grammar(
    `
    Peg <: Origami {
      PegGrammar
        = Name "{" PegRule* "}"
  
      PegRule
        = Name PegParams? PegDescription? "=" PegAlternative ";"
  
      PegDescription
        = "(" (~")" any)* ")"
  
      PegParams
        = "<" ListOf<Name, ","> ">"
  
      PegAlternative
        = NonemptyListOf<PegAction, "/">
  
      PegAction
        = PegSequence Block    -- action
        | PegSequence          -- no_action
  
      PegSequence
        = PegBinding+

      PegBinding
        = Name ":" PegExpr    -- named
        | PegExpr             -- unnamed
  
      PegExpr
        = PegExpr "*"                           -- repeat0
        | PegExpr "+"                           -- repeat1
        | PegExpr "?"                           -- optional
        | "&" PegExpr                           -- lookahead
        | "~" PegExpr                           -- negation
        | "#" PegExpr                           -- lexify
        | PegTerm                               -- term
  
      PegTerm
        = Name "<" ListOf<PegExpr, ","> ">"   -- apply
        | Name                                -- name
        | String                              -- literal
        | String ".." String                  -- range
        | "(" PegExpr+ ")"                    -- group
    }
  `,
    { Origami: origamiGrammar }
  );

  const visitor = {
    ...origamiVisitor,
    PegGrammar(name, _1, rules, _2) {
      return {
        type: "Grammar",
        name: name.toAST(visitor),
        rules: rules.toAST(visitor)
      };
    },
    PegRule(nameNode, params, desc, _1, alts, _2) {
      const name = nameNode.toAST(visitor);
      return {
        type: "Rule",
        name: name,
        params: params.toAST(visitor),
        description: desc.toAST(visitor),
        alternatives: alts
          .toAST(visitor)
          .map((x, i) => Object.assign(x, { index: i }))
      };
    },
    PegDescription(_1, desc, _2) {
      return desc.toAST(visitor).join("");
    },
    PegParams(_1, params, _2) {
      return params.toAST(visitor);
    },
    PegAction_action(seq, block) {
      return {
        type: "Action",
        sequence: seq.toAST(visitor),
        block: block.toAST(visitor)
      };
    },
    PegAction_no_action(seq) {
      return {
        type: "Action",
        sequence: seq.toAST(visitor)
      };
    },
    PegBinding_named(name, _, expr) {
      return {
        type: "Binding",
        name: name.toAST(visitor),
        expr: expr.toAST(visitor)
      };
    },
    PegBinding_unnamed(expr) {
      return {
        type: "Binding",
        expr: expr.toAST(visitor)
      };
    },
    PegExpr_repeat0(term, _) {
      return {
        type: "Repeat0",
        term: term.toAST(visitor)
      };
    },
    PegExpr_repeat1(term, _) {
      return {
        type: "Repeat1",
        term: term.toAST(visitor)
      };
    },
    PegExpr_optional(term, _) {
      return {
        type: "Optional",
        term: term.toAST(visitor)
      };
    },
    PegExpr_lookahead(_, term) {
      return {
        type: "Lookahead",
        term: term.toAST(visitor)
      };
    },
    PegExpr_negation(_, term) {
      return {
        type: "Negation",
        term: term.toAST(visitor)
      };
    },
    PegExpr_lexify(_, term) {
      return {
        type: "Lexify",
        term: term.toAST(visitor)
      };
    },
    PegTerm_apply(name, _1, args, _2) {
      return {
        type: "Apply",
        name: name.toAST(visitor),
        args: args.toAST(visitor)
      };
    },
    PegTerm_name(name) {
      return {
        type: "Name",
        name: name.toAST(visitor)
      };
    },
    PegTerm_literal(str) {
      return {
        type: "Literal",
        value: str.toAST(visitor)
      };
    },
    PegTerm_range(start, _, end) {
      return {
        type: "Range",
        start: start.toAST(visitor),
        end: end.toAST(visitor)
      };
    },
    PegTerm_group: 1
  };

  function parse(source) {
    const match = grammar.match(source, "PegGrammar");
    if (match.failed()) {
      throw new Error(match.message);
    }

    return toAST(match, visitor);
  }

  function compileAction(rule) {
    return flatmap(rule.alternatives, (x, i) => {
      if (x.block) {
        const names = x.sequence.map((a, i) => (a.name ? a.name : `$${i}`));
        return [
          [
            `${rule.name}_alt${i}`,
            {
              type: "FunctionExpression",
              params: {
                positional: ["meta", ...names],
                named: []
              },
              block: x.block
            }
          ]
        ];
      } else {
        return [];
      }
    });
  }

  function compile(node) {
    switch (node.type) {
      case "Grammar":
        return {
          name: node.name,
          code: `${node.name} {\n${node.rules.map(compile).join("\n\n")}\n}`,
          actions: flatmap(node.rules, compileAction)
        };

      case "Rule":
        const params = node.params ? `<${node.params.join(", ")}>` : "";
        const desc = node.description ? `(${node.description})` : "";
        return `${node.name}${params} ${desc} = \n   ${node.alternatives
          .map(compile)
          .join("\n  | ")}`;

      case "Binding":
        return compile(node.expr);

      case "Action":
        return `${node.sequence.map(compile).join(" ")} -- alt${node.index}`;

      case "Repeat0":
        return `(${compile(node.term)})*`;

      case "Repeat1":
        return `(${compile(node.term)})+`;

      case `Optional`:
        return `(${compile(node.term)})?`;

      case `Lookahead`:
        return `&(${compile(node.term)})`;

      case `Negation`:
        return `~(${compile(node.term)})`;

      case `Lexify`:
        return `#(${compile(node.term)})`;

      case `Apply`:
        return `${node.name}<${node.args.join(", ")}>`;

      case "Name":
        return node.name;

      case "Literal":
        return JSON.stringify(node.value.value);

      case "Range":
        return `${node.start.value}..${node.end.value}`;

      default:
        throw new Error(`Unknown node ${node.type}`);
    }
  }

  if (ast.type !== "String") {
    throw new TypeError(`origami.grammar.peg can only be used with strings`);
  }

  const source = ast.value;
  const pegAst = parse(source);
  const { code, actions } = compile(pegAst);

  return {
    type: "MethodCallExpression",
    object: {
      type: "VariableExpression",
      name: "$rt"
    },
    method: "$$makeParser",
    params: {
      named: [],
      positional: [
        {
          type: "LiteralExpression",
          literal: {
            type: "String",
            value: code
          }
        },
        {
          type: "ObjectExpression",
          pairs: actions.map(([k, v]) => {
            return {
              name: k,
              expression: v
            };
          })
        }
      ]
    }
  };
};
