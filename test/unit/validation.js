const fs = require("fs");
const path = require("path");
const { parse, compile } = require("../../bootstrap");
const { shouldTest } = require("./utils");

const root = path.join(__dirname, "fixtures/parsing");
const files = fs.readdirSync(root).map(name => ({
  name: name,
  contents: fs.readFileSync(path.join(root, name), "utf8")
}));

if (shouldTest("bootstrap")) {
  describe("Compiler pipeline validation", () => {
    for (const file of files) {
      it(`Parsing ${file.name}`, () => {
        parse(file.contents);
      });

      it(`Compiling ${file.name}`, () => {
        compile(file.contents);
      });
    }
  });
}
