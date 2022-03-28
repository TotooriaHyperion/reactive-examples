import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

export const CyclicDeps = () => {
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);
  useEffect(() => {
    setB(a + 1);
  }, [a]);
  return (
    <>
      <p>a:{a}</p>
      <p>b:{b}</p>
      <ChildComponent b={b} setA={setA} />
    </>
  );
};

const ChildComponent = ({
  b,
  setA,
}: {
  b: number;
  setA: React.Dispatch<React.SetStateAction<number>>;
}) => {
  useEffect(() => {
    setA(b + 1);
  }, [b]);
  return null;
};

export function render() {
  ReactDOM.render(<CyclicDeps />, document.querySelector("#app5")!);
}
