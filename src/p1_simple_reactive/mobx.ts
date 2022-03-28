import { makeObservable, observable, action, autorun } from "mobx";
import { Subscription } from "rxjs";
import { addEvent, getDoms, listenInput } from "./dom";

export class Store {
  value = "abc";
  constructor() {
    makeObservable(this, {
      value: observable.ref,
      reset: action,
      input: action,
    });
  }
  reset = () => {
    this.value = "abc";
  };
  input = (v: string) => {
    this.value = v;
  };
}

export function runMobx() {
  const store = new Store();
  const doms = getDoms(document.querySelector(".mobx")!);
  const sub = new Subscription();
  const render = () => {
    doms.display.innerHTML = store.value;
    doms.ipt.value = store.value;
  };
  // render
  sub.add(autorun(render));
  // action
  sub.add(listenInput(doms.ipt, store.input));
  sub.add(addEvent(doms.btn, "click", store.reset));

  return () => sub.unsubscribe();
}
