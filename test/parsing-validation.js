const fs = require("fs");
const path = require("path");
const { parse } = require("../bootstrap/parser");

describe("Parsing (validation only)", () => {
  const root = path.join(__dirname, "fixtures/parsing");
  const files = fs.readdirSync(root).map(name => ({
    name: name,
    contents: fs.readFileSync(path.join(root, name), "utf8")
  }));

  for (const file of files) {
    it(file.name, () => {
      parse(file.contents);
    });
  }
});
