import React, { useState } from "react";
import { Element, useNode, useEditor } from "@craftjs/core";
import { getGridPropertiesDefaults } from "./properties-grid";
import { GridProperties } from "./properties-grid-panel";
import { DeleteContextMenu } from "../../../delete_context_menu/delete-context-menu";

interface GridProps extends Partial<ReturnType<typeof getGridPropertiesDefaults>> {
  children?: React.ReactNode;
  gridTemplateColumns?: string | string[];
  gridTemplateRows?: string | string[];
  justifyItems?: string;
  alignItems?: string;
}

export const GridLayout: React.FC<GridProps> & { craft: any } = (props) => {
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

  const defaultProps = getGridPropertiesDefaults();
  const {
    columns = defaultProps.columns,
    rows = defaultProps.rows,
    gap = defaultProps.gap,
    padding = defaultProps.padding,
    margin = defaultProps.margin,
    backgroundColor = defaultProps.backgroundColor,
    border = defaultProps.border,
    gridTemplateColumns,
    gridTemplateRows,
    justifyItems = "stretch",
    alignItems = "stretch",
    children,
  } = props;

  const gridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: gridTemplateColumns
      ? Array.isArray(gridTemplateColumns)
        ? gridTemplateColumns.join(" ")
        : gridTemplateColumns
      : `repeat(${columns}, 1fr)`,
    gridTemplateRows: gridTemplateRows
      ? Array.isArray(gridTemplateRows)
        ? gridTemplateRows.join(" ")
        : gridTemplateRows
      : `repeat(${rows}, 1fr)`,
    gap,
    padding,
    margin,
    backgroundColor,
    border,
    justifyItems,
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
      style={gridStyle}
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
          {Array.from({ length: rows * columns }).map((_, index) => (
            <Element
              key={index}
              id={`grid-item-${index}`}
              is="GridItem"
              canvas
              className="p-4 border border-dashed border-gray-300 text-gray-500 flex items-center justify-center"
            >
              {`Cell ${index + 1}`}
            </Element>
          ))}
        </>
      )}
      {isHovered && (
        <div className="absolute top-0 left-0 p-1 bg-gray-800 text-white text-xs">
          {`${columns}x${rows}`}
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

GridLayout.craft = {
  displayName: "GridLayout",
  props: getGridPropertiesDefaults(),
  rules: {
    canDrag: () => true,
    canDrop: () => true,
  },
  related: {
    toolbar: GridProperties,
  },
};