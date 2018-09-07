#!/usr/bin/env node
const { parse } = require("./parser");
const { generate } = require("./codegen");
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
      mod._compile(compile(program), file);
    };
    const mod = require(argv.file);
    mod.main(params);
  })
  .help()
  .strict()
  .demandCommand(1).argv;
