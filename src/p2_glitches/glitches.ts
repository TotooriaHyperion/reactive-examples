import { getDataSource } from "./rxdatasource";

export function runWithGlitches() {
  const { a$, c$ } = getDataSource();
  let initial = 1;
  const btn = document.querySelector("button.btn")!;
  const display = document.querySelector(".display")! as HTMLDivElement;

  // render
  c$.subscribe((c) => {
    display.innerHTML += `<p>c:${c}</p>`;
    console.log({
      c,
    });
  });
  // action
  btn.addEventListener("click", () => {
    initial++;
    a$.next(initial);
  });
  // initial render
  a$.next(initial);
}
