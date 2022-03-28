import { combineLatest, Subject } from "rxjs";
import { map } from "rxjs/operators";

export function getDataSource() {
  const a$ = new Subject<number>();
  const b$ = a$.pipe(map((v) => 2 * v));
  const c$ = combineLatest([a$, b$]).pipe(map(([a, b]) => a + b));
  return {
    a$,
    b$,
    c$,
  };
}
