import React from "react";
import { useEditor, Canvas } from "@craftjs/core";
import { elementConfigs } from "../../../data"; // Giả sử bạn vẫn dùng file này
import { ColumnLayout } from "./column-layout";

export const ColumnIcon: React.FC = () => {
  const { connectors } = useEditor();
  const containerData = elementConfigs.find((el) => el.name === "Column") || {
    name: "Column",
    iconUrl: "default-icon-url", // Thay bằng URL icon mặc định nếu cần
  };

  return (
    <div
      className="flex flex-col items-center gap-2 p-1 cursor-pointer"
      ref={(ref) => {
        if (ref) {
          connectors.create(
            ref,
            <Canvas is={ColumnLayout} columnCount={3} /> // Chỉ tạo ColumnLayout trống với 3 cột
          );
        }
      }}
    >
      <img src={containerData.iconUrl} alt={containerData.name} className="w-6 h-6" />
      <span className="text-xs font-medium">{containerData.name}</span>
    </div>
  );
};