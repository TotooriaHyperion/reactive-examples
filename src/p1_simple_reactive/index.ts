import * as mobx from "mobx";
(window as any).mobx = mobx;
import { runMobx } from "./mobx";
import { runRedux } from "./redux";
import { runRxjs } from "./rxjs";
import { runSimple } from "./simple";

runSimple();
runRedux();
runRxjs();
runMobx();
export {};
