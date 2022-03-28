import { autorun, computed, makeObservable, observable } from "mobx";

export function mobx_cyclic() {
  class Store {
    constructor() {
      makeObservable(this, {
        a: observable.ref,
        b: computed,
        c: computed,
      });
    }
    a = 0;
    get b(): number {
      return this.a + this.c;
    }
    get c(): number {
      return this.a + this.b;
    }
  }

  const store = new Store();
  autorun(() => {
    console.log({
      a: store.a,
      b: store.b,
      c: store.c,
    });
  });
}
