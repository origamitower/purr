const { shouldTest } = require("./utils");

if (shouldTest("new")) {
  const fs = require("fs");
  const path = require("path");
  const { Grammar } = require("../../compiler/build/language/parser");

  const root = path.join(__dirname, "fixtures/parsing");
  const files = fs.readdirSync(root).map(name => ({
    name: name,
    contents: fs.readFileSync(path.join(root, name), "utf8")
  }));

  describe("Validating the new compiler", () => {
    for (const file of files) {
      it(`Parsing ${file.name}`, () => {
        Grammar.parse(file.contents);
      });
    }
  });
}
