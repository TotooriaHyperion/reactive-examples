import { BehaviorSubject, Subscription } from "rxjs";
import { addEvent, getDoms, listenInput } from "./dom";

export function runRxjs() {
  const store = new BehaviorSubject("abc");
  const doms = getDoms(document.querySelector(".rxjs")!);
  const render = (value: string) => {
    doms.display.innerHTML = value;
    doms.ipt.value = value;
  };
  const sub = new Subscription();
  // render
  sub.add(store.subscribe(render));
  // action
  sub.add(listenInput(doms.ipt, (v) => store.next(v)));
  sub.add(addEvent(doms.btn, "click", () => store.next("abc")));

  return () => sub.unsubscribe();
}
