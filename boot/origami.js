const { parse } = require('./parser');
const { inspect } = require('util');
const fs = require('fs');

const [file] = process.argv.slice(2);
const source = fs.readFileSync(file, 'utf8');
const ast = parse(source);
console.log(inspect(ast, false, null, true));