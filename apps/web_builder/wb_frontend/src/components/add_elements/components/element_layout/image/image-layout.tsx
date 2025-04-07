import React, { useState } from "react";
import { useNode, useEditor } from "@craftjs/core";
import { getImagePropertiesDefaults } from "./image-properties";
import { ImageProperties } from "./properties-image-panel";
import { DeleteContextMenu } from "../../../delete_context_menu/delete-context-menu";

interface ImageProps {
  src?: string;
  alt?: string;
  width?: string;
  height?: string;
  padding?: string;
  margin?: string;
  border?: string;
  backgroundColor?: string;
  children?: React.ReactNode;
}

export const ImageLayout: React.FC<ImageProps> & { craft: any } = (props) => {
  const {
    connectors: { connect, drag },
    selected,
    id,
    hasChildren, // Thêm để kiểm tra nếu có phần tử con
  } = useNode((node) => ({
    selected: node.events.selected,
    id: node.id,
    hasChildren: node.data.nodes && node.data.nodes.length > 0,
  }));

  const { actions } = useEditor();
  const [isHovered, setIsHovered] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);

  const defaultProps = getImagePropertiesDefaults();
  const {
    src = defaultProps.src,
    alt = defaultProps.alt,
    width = defaultProps.width,
    height = defaultProps.height,
    padding = defaultProps.padding,
    margin = defaultProps.margin,
    border = defaultProps.border,
    backgroundColor = defaultProps.backgroundColor,
    children,
  } = props;

  const imageStyle = {
    width,
    height,
    padding,
    margin,
    border,
    backgroundColor,
    display: "block",
    objectFit: "cover" as const,
    position: "relative" as const, 
    zIndex: 1, 
  };

  const containerStyle = {
    position: "relative" as const,
    width,
    height,
    display: "block",
    outline: selected ? "2px solid #3b82f6" : "none",
    transition: "outline 0.2s ease",
  };

  const contentStyle = {
    position: "absolute" as const,
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
    pointerEvents: "none" as const,
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    actions.selectNode(id);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.pageX, y: e.pageY });
  };

  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); 
  };

  return (
    <div
      ref={(ref) => ref && connect(drag(ref))}
      style={containerStyle}
      className={`relative cursor-move transition-all ${
        isHovered || selected ? "border border-dashed border-gray-400" : ""
      }`}
      onContextMenu={handleContextMenu}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <img
        src={src}
        alt={alt}
        style={imageStyle}
        onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/300x200?text=Image+Not+Found")}
      />
      {children && (
        <div style={contentStyle}>
          {React.Children.map(children, (child) => (
            <div style={{ pointerEvents: "auto" }}>{child}</div> 
          ))}
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

ImageLayout.craft = {
  displayName: "ImageLayout",
  props: getImagePropertiesDefaults(),
  rules: {
    canDrag: () => true,
    canDrop: () => true,
    canMoveIn: () => true, 
    canMoveOut: () => true, 
  },
  related: {
    toolbar: ImageProperties,
  },
  isCanvas: true,
};