export function getDoms(parent: HTMLElement) {
  const ipt = parent.querySelector("input")! as HTMLInputElement;
  const btn = parent.querySelector("button")! as HTMLButtonElement;
  const display = parent.querySelector(".display")!;
  return {
    ipt,
    btn,
    display,
  };
}

export function addEvent<
  T extends HTMLElement,
  K extends keyof HTMLElementEventMap,
>(dom: T, event: K, handler: (e: HTMLElementEventMap[K]) => void) {
  dom.addEventListener(event, handler);
  return () => {
    dom.removeEventListener(event, handler);
  };
}

export function listenInput<T extends HTMLElement>(
  dom: T,
  handler: (v: string) => void,
) {
  return addEvent(dom, "input", (e) => {
    const tar = e.target! as HTMLInputElement;
    handler(tar.value);
  });
}
