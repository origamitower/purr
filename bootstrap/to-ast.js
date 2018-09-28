// This code is based on Ohm's built-in toAST semantics
// with a slight change on how lexical rules without a
// semantic action defined are handled. This allows
// lexical rules to be handled by semantic actions as well
// in non-confusing ways.

// Original from https://github.com/harc/ohm/blob/master/extras/semantics-toAST.js
// MIT licensed, Copyright (c) 2014-2016 Alessandro Warth and the Ohm project contributors.

"use strict";

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var pexprs = require("ohm-js/src/pexprs");
var MatchResult = require("ohm-js/src/MatchResult");
var Grammar = require("ohm-js/src/Grammar");
var extend = require("util-extend");

// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------

var defaultOperation = {
  _terminal: function() {
    return this.primitiveValue;
  },

  _nonterminal: function(children) {
    var ctorName = this._node.ctorName;
    var mapping = this.args.mapping;

    // without customization
    if (!mapping.hasOwnProperty(ctorName)) {
      // intermediate node
      if (
        this._node instanceof pexprs.Alt ||
        this._node instanceof pexprs.Apply
      ) {
        return children[0].toAST(mapping);
      }

      // lexical rule
      if (this.isLexical()) {
        if (children.length === 1) {
          return children[0].toAST(mapping);
        } else {
          return this.sourceString;
        }
      }

      // singular node (e.g. only surrounded by literals or lookaheads)
      var realChildren = children.filter(function(child) {
        return !child.isTerminal();
      });
      if (realChildren.length === 1) {
        return realChildren[0].toAST(mapping);
      }

      // rest: terms with multiple children
    }

    // direct forward
    if (typeof mapping[ctorName] === "number") {
      return children[mapping[ctorName]].toAST(mapping);
    }

    // named/mapped children or unnamed children ('0', '1', '2', ...)
    var propMap = mapping[ctorName] || children;
    var node = {
      type: ctorName
    };
    for (var prop in propMap) {
      var mappedProp = mapping[ctorName] && mapping[ctorName][prop];
      if (typeof mappedProp === "number") {
        // direct forward
        node[prop] = children[mappedProp].toAST(mapping);
      } else if (
        typeof mappedProp === "string" ||
        typeof mappedProp === "boolean" ||
        mappedProp === null
      ) {
        // primitive value
        node[prop] = mappedProp;
      } else if (
        typeof mappedProp === "object" &&
        mappedProp instanceof Number
      ) {
        // primitive number (must be unboxed)
        node[prop] = Number(mappedProp);
      } else if (typeof mappedProp === "function") {
        // computed value
        node[prop] = mappedProp.call(this, children);
      } else if (mappedProp === undefined) {
        if (children[prop] && !children[prop].isTerminal()) {
          node[prop] = children[prop].toAST(mapping);
        } else {
          // delete predefined 'type' properties, like 'type', if explicitely removed
          delete node[prop];
        }
      }
    }
    return node;
  },

  _iter: function(children) {
    if (this._node.isOptional()) {
      if (this.numChildren === 0) {
        return null;
      } else {
        return children[0].toAST(this.args.mapping);
      }
    }

    return children.map(function(child) {
      return child.toAST(this.args.mapping);
    }, this);
  },

  listOf: function(node) {
    if (node.children.length === 0) {
      return [];
    } else if (node.children.length === 1) {
      return [node.children[0].toAST(this.args.mapping)];
    } else {
      const [first, _, rest] = node.children;
      return [first.toAST(this.args.mapping)].concat(
        rest.toAST(this.args.mapping)
      );
    }
  },

  NonemptyListOf: function(first, sep, rest) {
    return [first.toAST(this.args.mapping)].concat(
      rest.toAST(this.args.mapping)
    );
  },

  EmptyListOf: function() {
    return [];
  }
};

// Returns a plain JavaScript object that includes an abstract syntax tree (AST)
// for the given match result `res` containg a concrete syntax tree (CST) and grammar.
// The optional `mapping` parameter can be used to customize how the nodes of the CST
// are mapped to the AST (see /doc/extras.md#toastmatchresult-mapping).
function toAST(res, mapping) {
  if (!(res instanceof MatchResult) || res.failed()) {
    throw new Error(
      "toAST() expects a succesfull MatchResult as first parameter"
    );
  }

  mapping = extend({}, mapping);
  var operation = extend({}, defaultOperation);
  for (var termName in mapping) {
    if (typeof mapping[termName] === "function") {
      operation[termName] = mapping[termName];
      delete mapping[termName];
    }
  }
  var g = res._cst.grammar;
  var s = g.createSemantics().addOperation("toAST(mapping)", operation);
  return s(res).toAST(mapping);
}

// Returns a semantics containg the toAST(mapping) operation for the given grammar g.
function semanticsForToAST(g) {
  if (!(g instanceof Grammar)) {
    throw new Error("semanticsToAST() expects a Grammar as parameter");
  }

  return g.createSemantics().addOperation("toAST(mapping)", defaultOperation);
}

module.exports = {
  helper: toAST,
  semantics: semanticsForToAST
};
