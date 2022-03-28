import { mobx_cyclic } from "./mobx";
import { render } from "./react";
import { rxjs_cyclic } from "./rxjs";

const btn1 = document.querySelector("button.btn1")!;
const btn2 = document.querySelector("button.btn2")!;
const btn3 = document.querySelector("button.btn3")!;

btn1.addEventListener("click", rxjs_cyclic);
btn2.addEventListener("click", mobx_cyclic);
btn3.addEventListener("click", render);
