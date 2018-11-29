const path = require("path");

function resolve(relativePath) {
  return path.join(__dirname, relativePath);
}

module.exports = {
  entry: resolve("Compiler.fsproj"),
  outDir: resolve("../build/package"),
  babel: {
    presets: [["@babel/env", { modules: "commonjs" }]],
    sourceMaps: true
  },
  fable: {
    define: ["DEBUG"]
  }
};
