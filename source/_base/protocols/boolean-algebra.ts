import { Protocol, IProtocolImplementation } from "../protocol";
import { typeOf, origamiType } from "../type";

export interface IBooleanAlgebra<A> {
  or(left: A, right: A): A;
  and(left: A, right: A): A;
  not(left: A): A;
}

export class BooleanAlgebra<A> extends Protocol<IBooleanAlgebra<A>> {
  get name() {
    return "[protocol BooleanAlgebra<A>]";
  }

  or(left: A, right: A): A {
    const methods = this.$select(typeOf(left));
    return methods.or(left, right);
  }

  and(left: A, right: A): A {
    const methods = this.$select(typeOf(left));
    return methods.and(left, right);
  }

  not(left: A): A {
    const methods = this.$select(typeOf(left));
    return methods.not(left);
  }
}

export const BooleanAlgebra_Boolean: IProtocolImplementation<
  IBooleanAlgebra<boolean>
> = {
  type: origamiType(Boolean),
  methods: {
    not(left: boolean) {
      return !left;
    },

    or(left: boolean, right: boolean) {
      return left || right;
    },

    and(left: boolean, right: boolean) {
      return left && right;
    }
  }
};
