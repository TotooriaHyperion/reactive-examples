import { memo } from "react";
import "antd/dist/antd.min.css";
import { DataReaction } from "./DataReaction";
import { EventReaction } from "./EventReaction/View";

export const App = memo(() => {
  return (
    <div style={{ width: "500px" }}>
      <DataReaction />
      <EventReaction />
    </div>
  );
});
