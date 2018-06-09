require('ometajs');
const { OrigamiParser } = require('./parser.ometajs');
const { OrigamiCompiler } = require('./compiler.ometajs');

function parse(code) {
  return OrigamiParser.matchAll(code, 'Module');
}

function compile(ast) {
  return OrigamiCompiler.match(ast, 'compile');
}

// Test
const fs = require('fs');
const program = fs.readFileSync(__dirname + '/teste.ori', 'utf8');
const ast = parse(program);
console.log(JSON.stringify(ast, null, 2));

console.log('\n\n');

const result = compile(ast);
console.log(result);