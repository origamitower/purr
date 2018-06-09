exports.Union = (id, cases) => {
  const tagNames = cases.map(x => x[0]);
  const tags = `
export enum ${id}_TAG {
  ${tagNames.join(', ')}
}`;
  
  const mainClass = `
export class ${id} {
  readonly "origami/type" = "${id}";
  abstract "origami/tag": ${id}_TAG;

${cases.map(([n, xs]) => {
  const args = xs.map(x => `${x}: any`).join(', ');
  const ns = xs.join(', ');
  return `  static ${n}(${args}) {\n    return new ${id}_${n}(${ns});\n  }`
}).join('\n\n')}
}`

  const subClasses = cases.map(([n, xs]) => {
    const args = xs.map(x => `readonly ${x}: any`).join(', ');

    return `
class ${id}_${n} extends ${id} {
  readonly "origami/tag" = ${id}_TAG.${n};

  constructor(${args}) {}
}`
  });

  return `${tags}\n${mainClass}\n${subClasses.join('\n\n')}\n`;
}


exports.Define = (name, params, body) => {
  return `
export function ${mangle(name)}(${params.join(', ')}) {
  return ${body};
}`
}



function mangle(name) {
  switch (name) {
    case '===': return '$equals';
    case '=/=': return '$not_equals';
    case '>':   return '$gt';
    case '<':   return '$lt';
    case '>=':  return '$gte';
    case '<=':  return '$lte';
    case '+':   return '$plus';
    case '-':   return '$minus';
    case '*':   return '$mul';
    case '/':   return '$div';

    default: return name;
  }
}