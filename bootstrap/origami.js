#!/usr/bin/env node
const { parse } = require("./parser");
const { compileModule, generate } = require("./codegen");
const babel = require("@babel/core");
const { inspect } = require("util");
const fs = require("fs");
const path = require("path");

function read(f) {
  return fs.readFileSync(f, "utf8");
}

function compile(program) {
  const js = generate(parse(program)).code;
  return `${runtime}\n${js}`;
}

function compileToNode(program) {
  const jsAst = compileModule(parse(program));
  const js = babel.transformFromAstSync(jsAst, null, {
    plugins: ["@babel/plugin-transform-modules-commonjs"]
  });
  return `${runtime}\n${js.code}`;
}

const runtime = read(path.join(__dirname, "runtime.js"));

// CLI
require("yargs")
  .command("ast <file>", "shows the ast for <file>", {}, argv => {
    const program = read(argv.file);
    console.log(inspect(parse(program), false, null, true));
  })
  .command("compile <file>", "compiles <file> to JavaScript", {}, argv => {
    const program = read(argv.file);
    console.log(compile(program));
  })
  .command("run <file>", "runs the main() declaration in <file>", {}, argv => {
    const params = argv.params || [];
    require.extensions[".origami"] = (mod, file) => {
      const program = read(file);
      mod._compile(compileToNode(program), file);
    };
    const mod = require(argv.file);
    mod.main(params);
  })
  .help()
  .strict()
  .demandCommand(1).argv;
