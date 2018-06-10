export function $equals(left: any, right: any): boolean {
  if (left === null) {
    return right === null;
  } else if (typeof left === "object") {
    return $objectEquality(left, right);
  } else {
    return left === right;
  }
}

export function $notEquals(left: any, right: any): boolean {
  if (left === null) {
    return right !== null;
  } else if (typeof left === "object") {
    return $objectInequality(left, right);
  } else {
    return left !== right;
  }
}

export function $plus(left: any, right: any): any {
  return left + right;
}

export function $minus(left: any, right: any): any {
  return left - right;
}

export function $mul(left: any, right: any): any {
  return left * right;
}

export function $div(left: any, right: any): any {
  return left / right;
}
