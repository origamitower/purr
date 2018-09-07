function mangle(name) {
  switch (name) {
    case "===":
      return "origami$equals";

    case "=/=":
      return "origami$notEquals";

    case "==>":
      return "origami$imply";

    case ">=":
      return "origami$gte";

    case ">>":
      return "origami$composeRight";

    case ">":
      return "origami$gt";

    case "<=":
      return "origami$lte";

    case "<<":
      return "origami$composeLeft";

    case "<":
      return "origami$lt";

    case "++":
      return "origami$concat";

    case "+":
      return "origami$plus";

    case "-":
      return "origami$minus";

    case "**":
      return "origami$power";

    case "*":
      return "origami$multiply";

    case "/":
      return "origami$divide";

    case "and":
    case "or":
    case "not":
      return `origami$${name}`;

    case "[]":
      return `origami$at`;

    case "[]<-":
      return `origami$atPut`;

    default:
      throw new Error(`Unknown operator ${name}`);
  }
}

module.exports = { mangle };
