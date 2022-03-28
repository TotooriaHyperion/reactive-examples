import { makeAutoObservable, reaction } from "mobx";
import { observer } from "mobx-react-lite";
import { Button, Form } from "antd";
import { useEffect } from "react";

class Model {
  a = 0;
  b = 0;
  c = 0;
  d = 0;
  constructor() {
    makeAutoObservable(this);
  }
  setA(a: number) {
    this.a = a;
  }
  incA = () => {
    this.a += 1;
  };
  setB(b: number) {
    this.b = b;
  }
  setC(c: number) {
    this.c = c;
  }
  setD(d: number) {
    this.d = d;
  }
  incCnD = () => {
    this.c += 1;
    this.d += 1;
  };
  complextAsyncAction = () => {
    return Promise.resolve();
  };
  bootstrap = () => {
    return reaction(
      () => this.a,
      () => {
        this.setB(this.a);
      },
    );
  };
}

const store = new Model();

export const ExampleTransaction = observer(() => {
  const { a, b, c, d } = store;
  console.log("Render from reaction", { a, b, c, d });
  useEffect(() => store.bootstrap(), []);

  return (
    <Form style={{ width: "400px" }}>
      <Button onClick={store.incA}>A.inc</Button>
      <Button onClick={store.incCnD}>C.inc {`&`} D.inc</Button>
      <Button
        onClick={async () => {
          await Promise.resolve();
          store.incCnD();
        }}
      >
        C.inc {`&`} D.inc async
      </Button>
      <Form.Item label="a">{a}</Form.Item>
      <Form.Item label="b">{b}</Form.Item>
      <Form.Item label="c">{c}</Form.Item>
      <Form.Item label="d">{d}</Form.Item>
      <SubComponent />
    </Form>
  );
});

const SubComponent = () => {
  return (
    <Button
      onClick={() => {
        store.complextAsyncAction().then(() => {
          console.log({
            c: store.c,
          });
        });
      }}
    >
      Async Closure
    </Button>
  );
};
