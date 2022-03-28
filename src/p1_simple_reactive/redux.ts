import { createStore } from "redux";
import { addEvent, listenInput, getDoms } from "./dom";

const store = createStore(
  (state, action: any) => {
    if (action.type === "changeValue") {
      return {
        ...state,
        value: action.payload,
      };
    }
    return state!;
  },
  {
    value: "abc",
  },
);

export function runRedux() {
  const doms = getDoms(document.querySelector(".redux")!);
  const render = () => {
    const state = store.getState();
    doms.display.innerHTML = state.value;
    doms.ipt.value = state.value;
  };
  const unsubscribe = store.subscribe(render);
  const cleanup1 = listenInput(doms.ipt, (v) =>
    store.dispatch({ type: "changeValue", payload: v }),
  );
  const cleanup2 = addEvent(doms.btn, "click", () =>
    store.dispatch({ type: "changeValue", payload: "abc" }),
  );

  render();
  return () => {
    unsubscribe();
    cleanup1();
    cleanup2();
  };
}
