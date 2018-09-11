# Modules

Origami supports first-class Modules in the ML-ish/Newspeak-ish sense. They are compiled to an IIFE returning an object that exposes the public names.

```
module Lambda {
  data class Var(name) {}
  data class Lam(param, body) {}
  data class App(callee, arg) {}
  data class Closure(env, param, body) {}

  data EmptyEnv() {
    member self[key] = fail("Unbound variable " + name);
  }

  data Env(parent, name, value) {
    member self[key] {
      if key === name then value
      else parent[key];
    }
  }

  function evaluate(term, env) {
    match term {
      case Var(name):
        env[name];

      case Lam(param, body):
        new Closure(env, param, body);

      case App(callee, arg):
        let value = evaluate(arg);
        let Closure(cenv, param, body) = evaluate(callee, env);
        evaluate(body, new Env(cenv, param, value));
    }
  }
}

function main(_) {
  let { Lam: Lam, Var: Var, App: App } = Lambda;
  Lambda.evaluate(
    new App(new Lam("x", new Var("x")), new Lam("y", new Var("y"))),
    new Lambda.EmptyEnv()
  );
}
```
