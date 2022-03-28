import { Button, Form } from "antd";
import "antd/dist/antd.min.css";
import React, { useContext, useEffect, useState } from "react";

export const ExampleHooks = () => {
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);
  const [c, setC] = useState(0);
  const [d, setD] = useState(0);
  useEffect(() => {
    setB(a);
  }, [a]);

  console.log("Render", { a, b, c, d });

  return (
    <Form style={{ width: "400px" }}>
      <Button onClick={() => setA((v) => v + 1)}>A.inc</Button>
      <Button
        onClick={() => {
          setC((v) => v + 1);
          setD((v) => v + 1);
        }}
      >
        C.inc {`&`} D.inc
      </Button>

      <Button
        onClick={async () => {
          await Promise.resolve();
          setC((v) => v + 1);
          setD((v) => v + 1);
        }}
      >
        C.inc {`&`} D.inc async
      </Button>
      <Form.Item label="a">{a}</Form.Item>
      <Form.Item label="b">{b}</Form.Item>
      <Form.Item label="c">{c}</Form.Item>
      <Form.Item label="d">{d}</Form.Item>
      <Context.Provider
        value={{
          value: c,
          complexAsyncAction: () => {
            setC((v) => v + 1);
            return Promise.resolve();
          },
        }}
      >
        <SubComponent />
      </Context.Provider>
    </Form>
  );
};

const Context = React.createContext<{
  value: number;
  complexAsyncAction: () => Promise<any>;
}>(null as any);

const SubComponent = () => {
  const { value, complexAsyncAction } = useContext(Context);
  return (
    <Button
      onClick={() => {
        complexAsyncAction().then(() => {
          console.log({
            c: value,
          });
        });
      }}
    >
      Async Closure
    </Button>
  );
};
