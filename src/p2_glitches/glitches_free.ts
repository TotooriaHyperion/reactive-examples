import { getDataSource } from "./rxdatasource";

export function runGlitches_free() {
  const { a$, c$ } = getDataSource();
  let initial = 1;
  const btn2 = document.querySelector("button.btn2")!;
  const display2 = document.querySelector(".display2")! as HTMLDivElement;
  let latest = "";
  const flush = () => {
    display2.innerHTML += `<p>c:${latest}</p>`;
  };
  function runInAction(handler: () => void) {
    handler();
    flush();
  }

  // render
  c$.subscribe((c) => {
    latest = `${c}`;
  });

  // action
  btn2.addEventListener("click", () => {
    runInAction(() => {
      initial++;
      a$.next(initial);
    });
  });
  // initial render
  runInAction(() => {
    a$.next(initial);
  });
}
