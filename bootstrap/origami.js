#!/usr/bin/env node
const { inspect } = require("util");
const fs = require("fs");
const path = require("path");
const { parse, compileToNode, register } = require("./index");

function read(f) {
  return fs.readFileSync(f, "utf8");
}

// CLI
require("yargs")
  .command("ast <file>", "shows the ast for <file>", {}, argv => {
    const program = read(argv.file);
    console.log(inspect(parse(program), false, null, true));
  })
  .command("compile <file>", "compiles <file> to JavaScript", {}, argv => {
    const program = read(argv.file);
    console.log(compileToNode(program));
  })
  .command("run <file>", "runs the main() declaration in <file>", {}, argv => {
    const params = argv.params || [];
    register();
    const mod = require(path.join(process.cwd(), argv.file));
    mod.main(params);
  })
  .help()
  .strict()
  .demandCommand(1).argv;
