import React from "react";
import { useNode } from "@craftjs/core";

export const Column: React.FC<{ children?: React.ReactNode }> & { craft: any } = ({ children }) => {
  const {
    connectors: { connect, drag },
  } = useNode();

  return (
    <div
      ref={(ref) => ref && connect(drag(ref))}
      style={{
        padding: "1rem",
        margin: "0.25rem",
        border: "1px dashed blue",
        flexGrow: 1,
        minHeight: "100px",
        boxSizing: "border-box" as const,
      }}
    >
      {children}
    </div>
  );
};

Column.craft = {
  displayName: "Column",
};