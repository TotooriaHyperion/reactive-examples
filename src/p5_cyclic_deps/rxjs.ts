import { BehaviorSubject } from "rxjs";
import { map } from "rxjs/operators";

export function rxjs_cyclic() {
  const a$ = new BehaviorSubject<number>(1);

  const b$ = a$.pipe(map((v) => 2 * v));

  b$.subscribe((v) => {
    setTimeout(() => {
      a$.next(v);
    }, 500);
  });
  a$.subscribe((a) => {
    console.log({
      a,
    });
  });
  b$.subscribe((b) => {
    console.log({
      b,
    });
  });
}
