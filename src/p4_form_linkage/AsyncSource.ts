import { makeObservable, observable, reaction, runInAction } from "mobx";
import { from, Observable, ObservableInput, Subject } from "rxjs";
import { materialize, switchMap, tap } from "rxjs/operators";

function sleep(time: number) {
  return new Promise((rs) => setTimeout(rs, time));
}

export interface IAsyncSource<T, P = {}> {
  params: P;
  loading: boolean;
  data: T | null | undefined;
  error: Error | null | undefined;

  readData: () => T | null | undefined;
  readLoading: () => boolean;
  readError: () => Error | null | undefined;

  fetch: (p: P) => Promise<T>;
  bootstrap: (fetch: (p: P) => ObservableInput<T>) => () => void;
  refresh: () => Promise<T>;
}

export function withAction(): <T>(obs: Observable<T>) => Observable<T> {
  return (obs) =>
    new Observable((observer) => {
      return obs.subscribe({
        next: (v) => runInAction(() => observer.next(v)),
        error: (v) => runInAction(() => observer.error(v)),
        complete: () => runInAction(() => observer.complete()),
      });
    });
}

export class AsyncSource<P, R> implements IAsyncSource<R, P> {
  constructor() {
    makeObservable(this, {
      loading: observable.ref,
      error: observable.ref,
      data: observable.ref,
    });
  }

  readData = () => this.data;
  readLoading = () => this.loading;
  readError = () => this.error;

  bootstrap: IAsyncSource<R, P>["bootstrap"] = (fetch) => {
    const sub = this.trigger
      .pipe(
        withAction(),
        tap(() => {
          this.loading = true;
          this.error = null;
        }),
        switchMap(() => {
          const params = this.params;
          return from(sleep(10)).pipe(
            // 这里 sleep 10 是为了把同步请求合并 - 这样外部就不需要做到对 deps 的精确 diff。
            // 异步请求本身已经由 switchMap 处理获取 latest 了
            switchMap(() => fetch(params)),
            materialize(),
            withAction(),
            tap((m) => {
              if (m.hasValue) {
                this.data = m.value!;
                this.error = null;
              } else {
                this.error = m.error;
              }
              this.loading = false;
            }),
          );
        }),
      )
      .subscribe();
    return () => sub.unsubscribe();
  };

  trigger = new Subject<void>();

  params: P = {} as any;
  loading: boolean = false;
  error: Error | null = null;
  data: R | null = null;

  protected doFetch = (): Promise<R> => {
    return new Promise<R>((resolve, reject) => {
      this.trigger.next();
      const cleanup = reaction(
        () => this.loading,
        (loading) => {
          if (!loading) {
            cleanup();
            if (this.error) {
              reject(this.error);
            } else {
              resolve(this.data!);
            }
          }
        },
      );
    });
  };

  fetch = (p: P) => {
    this.params = p;
    return this.doFetch();
  };

  refresh = () => {
    return this.doFetch();
  };
}
