import { action, autorun, computed, makeObservable, observable } from "mobx";

export class Store {
  a = 1;
  constructor() {
    makeObservable(this, {
      a: observable.ref,
      b: computed,
      c: computed,
      inc: action,
    });
  }
  get b() {
    return this.a * 2;
  }
  get c() {
    return this.a + this.b;
  }
  inc = () => {
    this.a++;
  };
}

export function runMobx() {
  const store = new Store();
  const btn = document.querySelector("button.btn3")!;
  const display = document.querySelector(".display3")! as HTMLDivElement;
  autorun(() => {
    display.innerHTML += `<p>c:${store.c}</p>`;
  });
  btn.addEventListener("click", store.inc);
}
