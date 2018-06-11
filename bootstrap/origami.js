#!/usr/bin/env node
require("ometajs");
const { OrigamiParser } = require("./parser.ometajs");
const { OrigamiCompiler } = require("./compiler.ometajs");
const fs = require("fs");

const runtime = fs.readFileSync(__dirname + "/runtime.ts", "utf8");

function parse(code) {
  return OrigamiParser.matchAll(code, "Module");
}

function compile(ast) {
  return runtime + "\n\n" + OrigamiCompiler.match(ast, "compile");
}

// CLI
require("yargs")
  .command("ast <file>", "shows the ast for <file>", {}, argv => {
    const program = fs.readFileSync(argv.file, "utf8");
    console.log(JSON.stringify(parse(program), null, 2));
  })
  .command("compile <file>", "compiles <file>", {}, argv => {
    const program = fs.readFileSync(argv.file, "utf8");
    console.log(compile(parse(program)));
  })
  .help()
  .demandCommand().argv;
