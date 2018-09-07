const { parse } = require("./parser");
const { generate } = require("./codegen");
const { inspect } = require("util");
const fs = require("fs");

const [file, compile] = process.argv.slice(2);
const source = fs.readFileSync(file, "utf8");
console.log("-- AST");
const ast = parse(source);
console.log(inspect(ast, false, null, true));
if (compile) {
  console.log("-- JS");
  const js = generate(ast).code;
  console.log(js);
}
