const path = require("path");

module.exports = {
  entry: path.join(__dirname, "Compiler.test.fsproj"),
  outDir: path.join(__dirname, "../build/test"),
  babel: {
    presets: [["@babel/env", { modules: "commonjs" }]],
    sourceMaps: true
  }
};
