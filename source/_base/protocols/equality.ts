import { Protocol } from "../protocol";
import { typeOf } from "../type";

export interface IEquality<A> {
  equals(left: A, right: A): boolean;
  not_equals?(left: A, right: A): boolean;
}

export class Equality<A> extends Protocol<IEquality<A>> {
  get name() {
    return "[protocol Equality<A>]";
  }

  get default_implementation() {
    return {
      equals(left: A, right: A) {
        return left === right;
      },

      not_equals(left: A, right: A) {
        return left !== right;
      }
    };
  }

  equals(left: A, right: A): boolean {
    const methods = this.$select(typeOf(left));
    return methods.equals(left, right);
  }

  not_equals(left: A, right: A): boolean {
    const methods = this.$select(typeOf(left));
    if (methods.not_equals) {
      return methods.not_equals(left, right);
    } else {
      return !methods.equals(left, right);
    }
  }
}
