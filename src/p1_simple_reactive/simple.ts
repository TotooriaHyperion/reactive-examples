import { getDoms } from "./dom";

type View = ReturnType<typeof getDoms>;

class Model {
  state = {
    value: "abc",
  };

  onInput = (e: Event) => {
    const tar = e.target as HTMLInputElement;
    this.setState({ value: tar.value });
  };
  onReset = () => {
    this.setState({ value: "abc" });
  };

  doms!: View;
  // connect model to view
  connect = (doms: View) => {
    this.doms = doms;
    const { ipt, btn } = this.doms;
    ipt.addEventListener("input", this.onInput);
    btn.addEventListener("click", this.onReset);
    this.render();
    return () => {
      ipt.removeEventListener("input", this.onInput);
      btn.removeEventListener("click", this.onReset);
    };
  };

  setState = (v: Partial<{ value: string }>) => {
    this.state = {
      ...this.state,
      ...v,
    };
    this.render();
  };
  render = () => {
    const { value } = this.state;
    this.doms.ipt.value = value;
    this.doms.display.innerHTML = value;
  };
}

export function runSimple() {
  const model = new Model();
  // connect model to view
  return model.connect(getDoms(document.querySelector(".simple")!));
}
