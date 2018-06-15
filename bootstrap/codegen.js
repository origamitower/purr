exports.Union = (id, cases) => {
  const tagNames = cases.map(x => x[0]);

  const mainClass = `
export class ${id} {
  readonly "origami/type" = "${id}";
  abstract "origami/tag": ${tagNames.map(JSON.stringify).join(" | ")};

${cases
    .map(([n, xs]) => {
      const args = xs.map(x => `${x}: any`).join(", ");
      const ns = xs.join(", ");
      return `  static ${n}(${args}) {\n    return new ${n}(${ns});\n  }`;
    })
    .join("\n\n")}
}`;

  const subClasses = cases.map(([n, xs]) => {
    const args = xs.map(x => `readonly ${x}: any`).join(", ");

    return `
class ${n} extends ${id} {
  readonly "origami/tag" = ${JSON.stringify(n)};

  constructor(${args}) {}
}`;
  });

  return `${mainClass}\n${subClasses.join("\n\n")}\n`;
};

exports.Define = (name, type, params, body) => {
  const prefix = type === "async" ? "async" : "";
  const suffix = type === "generator" ? "*" : "";

  return `
export ${prefix} function ${suffix} ${mangle(name)}(${params
    .map(x => `${x}: any`)
    .join(", ")}): any {
${body.map(x => `  ${x};`).join("\n")}
}`;
};

exports.Interface = function(name, _type, defs) {
  const includes = defs.filter(x => x[0] === "include").map(x => x[1]);
  const members = defs.filter(x => x[0] !== "include");

  return `
export interface ${name} {
  ${members
    .map(([t, [n, s]]) => {
      const s0 = t === "optional" ? "?" : "";
      return `${mangle(n)}${s0}${s}`;
    })
    .join(";\n  ")}
}
  `;
};

function compileBlock(block) {
  const [tag] = block;
}

exports.compileBlock = compileBlock;

function mangle(name) {
  switch (name) {
    case "===":
      return "$equals";
    case "=/=":
      return "$not_equals";
    case ">":
      return "$gt";
    case "<":
      return "$lt";
    case ">=":
      return "$gte";
    case "<=":
      return "$lte";
    case "+":
      return "$plus";
    case "-":
      return "$minus";
    case "*":
      return "$mul";
    case "/":
      return "$div";
    case "or":
      return "$or";
    case "and":
      return "$and";
    case "not":
      return "$not";

    default:
      return name;
  }
}

exports.mangle = mangle;
