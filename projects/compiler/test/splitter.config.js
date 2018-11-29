const path = require("path");

function resolve(relativePath) {
  return path.join(__dirname, relativePath);
}

module.exports = {
  entry: resolve("Compiler.test.fsproj"),
  outDir: resolve("../build/test"),
  babel: {
    presets: [["@babel/env", { modules: "commonjs" }]],
    sourceMaps: true
  },
  fable: {
    define: ["DEBUG"]
  }
};
