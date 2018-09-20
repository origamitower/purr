"use strict"; const $rt = require('@origamitower/origami/runtime');
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.collectImports = collectImports;

var _language = require("../language");

var _array = require("../utils/array");

function collectImports(node) {
  if (!(arguments.length === 1)) throw new Error("collectImports takes 1 arguments, but got " + arguments.length);

  if (!$rt.$is(node, _language.ast.File)) {
    throw new Error("Assertion failed: node is ast.File");
  }

  const getImports = function (definition) {
    if (!(arguments.length === 1)) throw new Error("This function takes 1 arguments, but got " + arguments.length);
    {
      const $$ref_1 = definition;
      let $$ref_2 = false;
      {
        const $$ref_3 = _language.ast.Definition.Import.unapply($$ref_1);

        if ($$ref_3 != null) {
          if (!Array.isArray($$ref_3)) throw new Error("unapply() must return null or an array");
          {
            const $$ref_7 = $$ref_3[0];
            const meta = $$ref_7;
            {
              const $$ref_6 = $$ref_3[1];
              const id = $$ref_6;
              {
                const $$ref_5 = $$ref_3[2];
                const alias = $$ref_5;
                {
                  const $$ref_4 = $$ref_3[3];
                  const bindings = $$ref_4;
                  {
                    return [definition];
                    $$ref_2 = true;
                  }
                }
              }
            }
          }
        }
      }
      {
        const $$ref_8 = _language.ast.Definition.ImportCore.unapply($$ref_1);

        if ($$ref_8 != null) {
          if (!Array.isArray($$ref_8)) throw new Error("unapply() must return null or an array");
          {
            const $$ref_12 = $$ref_8[0];
            const meta = $$ref_12;
            {
              const $$ref_11 = $$ref_8[1];
              const name = $$ref_11;
              {
                const $$ref_10 = $$ref_8[2];
                const alias = $$ref_10;
                {
                  const $$ref_9 = $$ref_8[3];
                  const bindings = $$ref_9;
                  {
                    return [definition];
                    $$ref_2 = true;
                  }
                }
              }
            }
          }
        }
      }
      {
        const $$ref_13 = _language.ast.Definition.Module.unapply($$ref_1);

        if ($$ref_13 != null) {
          if (!Array.isArray($$ref_13)) throw new Error("unapply() must return null or an array");
          {
            const $$ref_16 = $$ref_13[0];
            const meta = $$ref_16;
            {
              const $$ref_15 = $$ref_13[1];
              const name = $$ref_15;
              {
                const $$ref_14 = $$ref_13[2];
                const definitions = $$ref_14;
                {
                  return (0, _array.flatmap)(definitions, getImports);
                  $$ref_2 = true;
                }
              }
            }
          }
        }
      }
      {
        return [];
        $$ref_2 = true;
      }
      if (!$$ref_2) throw new Error("Pattern matching failed");
    }
  };

  return new _language.ImportContext((0, _array.flatmap)(node.definitions, getImports));
}
