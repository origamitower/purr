const { parse } = require("./parser");
const { compileProgram, generate } = require("./codegen");
const fs = require("fs");
const path = require("path");

function read(f) {
  return fs.readFileSync(f, "utf8");
}

const runtime = read(path.join(__dirname, "runtime.js"));

function compile(program) {
  const js = generate(parse(program)).code;
  return `${runtime}\n${js}`;
}

function compileToNode(program) {
  const js = generate(parse(program));
  return `"use strict"; const $rt = require('@origamitower/origami/runtime');\n${
    js.code
  }`;
}

function register() {
  require.extensions[".origami"] = (mod, file) => {
    const program = read(file);
    mod._compile(compileToNode(program), file);
  };
}

module.exports = {
  parse,
  compile,
  compileToNode,
  register
};
