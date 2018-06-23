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

exports.Class = (name, type, params, ext, body, mems) => {
  const fields = params.map(x => `$$${x}`);
  const fieldDecl = fields.map(x => `private ${x}: any;`);
  const prelude = params.map(x => `let ${x} = this.$$${x};`).join("\n    ");

  const mfields = mems
    .filter(x => x[0] === "field")
    .map(([_, mut, n]) => `private ${mut ? "" : "readonly"} ${n}: any;`);

  const allmems = mems
    .filter(x => x[0] === "static" || x[0] === "member")
    .map(([t, v, m]) => compileMem(v, prelude, m));

  const extDecl = ext ? `extends ${ext}` : "";

  return `
export class ${name} ${extDecl} {
  constructor(${compileParams(params)}) {
    ${body.join("\n    ")}
  }
  ${fieldDecl.join("\n  ")}
  ${mfields.join("\n  ")}
  ${allmems.join("\n  ")}
}
  `;
};

function compileParams(xs) {
  return xs.map(x => `${x}: any`).join(", ");
}

function compileMem(v, prelude, member) {
  switch (member[0]) {
    case "meth": {
      const [_, kind, name, self, params, body] = member;
      const prefix = kind === "generator" ? "*" : kind || "";

      return `
  ${v} ${prefix} ${mangle(name)}(${compileParams(params)}): any {
    const ${self} = this;
    ${prelude}
    ${body.join("\n    ")}
  }
`;
    }

    case "set": {
      const [_, self, name, param, body] = member;

      return `
  ${v} set ${name}(${param}: any): void {
    const ${self} = this;
    ${prelude}
    ${body.join("\n    ")}
  }
`;
    }

    case "get": {
      const [_, self, name, body] = member;

      return `
  ${v} get ${name}(): any {
    const ${self} = this;
    ${prelude}
    ${body.join("\n    ")}
  }      
`;
    }

    case "fun": {
      const [_, kind, name, params, body] = member;
      const prefix = kind === "generator" ? "*" : kind || "";

      return `
  ${v} static ${mangle(name)}(${compileParams(params)}): any {
    ${body.join("\n    ")}
  }
`;
    }

    case "sset": {
      const [_, name, param, body] = member;

      return `
  ${v} static set ${name}(${param}: any): void {
    ${body.join("\n    ")}
  }      
`;
    }

    case "sget": {
      const [_, name, body] = member;

      return `
  ${v} static get ${name}(): any {
    ${body.join("\n    ")}
  }      
`;
    }

    default:
      throw new Error(`Unknown member ${member[0]}`);
  }
}

const freshBox = new class {
  id = 1;
  next() {
    return `$$${this.id++}`;
  }
}

exports.Match = (expr, cases) => {
  const name = freshBox.next();
  return `((${name}) => {
  ${cases.map(compileCase(name)).join('\n\n  ')} 
})(${expr})`;
};

function compileCase(id) {
  return (pattern, body) => {
    const [tag] = pattern;
    switch (tag) {
      case 'any':
        return `return ${body};`

      case 'eq': {
        const [_, val] = pattern;
        return `if (${mangle}('===')(${id}, ${val})) {
    return ${body};
  }`
      }

      case 'extract': {
        const [_, m, names] = pattern;
        const name = freshBox.next();
        return `const ${name} = ${m}; 
  if (${id} instanceof ${name}) { 
    const [${names.join(', ')}] = ${name}.unapply(${id}); 
    return ${body} ;
  }`;
      }

      case 'bind': {
        const [_, name] = pattern;
        return `const ${name} = ${id};
  return ${body};`
      }

      default:
        throw new Error(`No pattern ${tag}`);
    }
  }
}

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
