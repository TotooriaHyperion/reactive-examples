export type EventContext = "input" | "reset" | "reload" | undefined;

let eventContext: EventContext;
export function createAction<T>(
  handler: (v: T) => void,
  currCtx: EventContext = eventContext,
) {
  return (v: T) => {
    runInContext(() => handler(v), currCtx);
  };
}

export function getEventContext() {
  return eventContext;
}

export function runInContext(
  handler: () => void,
  ctx: EventContext = eventContext,
) {
  const prev = eventContext;
  eventContext = ctx;
  handler();
  eventContext = prev;
}

export function isInput() {
  return eventContext === "input";
}
