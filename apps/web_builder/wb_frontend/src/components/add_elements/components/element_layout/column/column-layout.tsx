import React, { useState } from "react";
import { Element, useNode, useEditor } from "@craftjs/core";
import { getColumnPropertiesDefaults } from "./properties-column";
import { ColumnProperties } from "./properties-column-panel";
import { DeleteContextMenu } from "../../../delete_context_menu/delete-context-menu";

interface ColumnProps extends Partial<ReturnType<typeof getColumnPropertiesDefaults>> {
  children?: React.ReactNode;
}

export const ColumnLayout: React.FC<ColumnProps> & { craft: any } = (props) => {
  const {
    connectors: { connect, drag },
    selected,
    id,
  } = useNode((node) => ({
    selected: node.events.selected,
    id: node.id,
  }));

  const { actions } = useEditor();
  const [isHovered, setIsHovered] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);

  const defaultProps = getColumnPropertiesDefaults();
  const {
    columnCount = defaultProps.columnCount,
    gap = defaultProps.gap,
    padding = defaultProps.padding,
    margin = defaultProps.margin,
    backgroundColor = defaultProps.backgroundColor,
    border = defaultProps.border,
    justifyContent = defaultProps.justifyContent,
    alignItems = defaultProps.alignItems,
    children,
  } = props;

  const columnStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap,
    padding,
    margin,
    backgroundColor,
    border,
    justifyContent,
    alignItems,
    minHeight: "200px",
    width: "100%",
    boxSizing: "border-box",
    position: "relative",
    outline: selected ? "2px solid #3b82f6" : isHovered ? "1px dashed #9ca3af" : "none",
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    actions.selectNode(id);
  };

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    setContextMenu({ x: event.pageX, y: event.pageY });
  };

  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };

  return (
    <div
      ref={(ref) => {
        if (ref) {
          connect(drag(ref));
        }
      }}
      style={columnStyle}
      className="relative cursor-move transition-all"
      onContextMenu={handleContextMenu}
      onClick={(e) => {
        handleCloseContextMenu();
        handleClick(e);
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children || (
        <>
          {Array.from({ length: columnCount }).map((_, index) => (
            <Element
              key={index}
              id={`column-item-${index}`}
              is="ColumnItem" // Sử dụng is="ColumnItem" tương tự GridItem
              canvas // Cho phép kéo thả nội dung bên trong
              className="p-4 border border-dashed border-gray-300 text-gray-500 flex items-center justify-center"
            >
              {`Item ${index + 1}`}
            </Element>
          ))}
        </>
      )}
      {isHovered && (
        <div className="absolute top-0 left-0 p-1 bg-gray-800 text-white text-xs">
          {`Columns: ${columnCount}`}
        </div>
      )}
      <DeleteContextMenu
        nodeId={id}
        onClose={handleCloseContextMenu}
        position={contextMenu}
        onDelete={() => actions.delete(id)}
      />
    </div>
  );
};

ColumnLayout.craft = {
  displayName: "ColumnLayout",
  props: getColumnPropertiesDefaults(),
  rules: {
    canDrag: () => true,
    canDrop: () => true,
  },
  related: {
    toolbar: ColumnProperties,
  },
};
const ColumnItem = () => <div>Column Item</div>;
ColumnLayout.craft.node = ColumnItem;