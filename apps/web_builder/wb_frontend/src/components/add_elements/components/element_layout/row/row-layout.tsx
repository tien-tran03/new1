import React, { useState } from "react";
import { Element, useNode, useEditor } from "@craftjs/core";
import { getRowPropertiesDefaults } from "./row-properties";
import { RowProperties } from "./properties-row-panel";
import { DeleteContextMenu } from "../../../delete_context_menu/delete-context-menu";

interface RowProps extends Partial<ReturnType<typeof getRowPropertiesDefaults>> {
  children?: React.ReactNode;
}

export const RowLayout: React.FC<RowProps> & { craft: any } = (props) => {
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

  const defaultProps = getRowPropertiesDefaults();
  const {
    rowCount = defaultProps.rowCount,
    gap = defaultProps.gap,
    padding = defaultProps.padding,
    margin = defaultProps.margin,
    backgroundColor = defaultProps.backgroundColor,
    border = defaultProps.border,
    justifyContent = defaultProps.justifyContent,
    alignItems = defaultProps.alignItems,
    children,
  } = props;

  const rowStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "row",
    gap,
    padding,
    margin,
    backgroundColor,
    border,
    justifyContent,
    alignItems,
    minHeight: "100px",
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
      style={rowStyle}
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
          {Array.from({ length: rowCount }).map((_, index) => (
            <Element
              key={index}
              id={`row-item-${index}`}
              is="RowItem"
              canvas 
              className="p-4 border border-dashed border-gray-300 text-gray-500 flex items-center justify-center"
            >
              {`Item ${index + 1}`}
            </Element>
          ))}
        </>
      )}
      {isHovered && (
        <div className="absolute top-0 left-0 p-1 bg-gray-800 text-white text-xs">
          {`Items: ${rowCount}`}
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

RowLayout.craft = {
  displayName: "RowLayout",
  props: getRowPropertiesDefaults(),
  rules: {
    canDrag: () => true,
    canDrop: () => true,
  },
  related: {
    toolbar: RowProperties,
  },
};

const RowItem = () => <div>Row Item</div>;
RowLayout.craft.node = RowItem;