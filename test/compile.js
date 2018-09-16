const fs = require("fs");
const path = require("path");
const { register } = require("../bootstrap");
const { shouldTest } = require("./utils");

if (shouldTest("bootstrap")) {
  register();

  describe("Compiling", () => {
    const root = path.join(__dirname, "fixtures/compile");
    const files = fs
      .readdirSync(root)
      .filter(x => /\.origami$/.test(x))
      .map(name => ({
        name: name,
        path: path.join(root, name)
      }));

    for (const file of files) {
      describe(file.name, () => {
        const mod = require(file.path);
        for (const [name, fn] of Object.entries(mod)) {
          if (name.startsWith("test_")) {
            it(name.replace(/^test_/, "").replace(/_/g, " "), () => fn());
          }
        }
      });
    }
  });
}
