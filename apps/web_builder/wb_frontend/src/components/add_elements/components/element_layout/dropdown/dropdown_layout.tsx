import React, { useState } from "react";
import { useNode, useEditor } from "@craftjs/core";
import { DeleteContextMenu } from "../../../delete_context_menu/delete-context-menu";
import { getDropdownPropertiesDefaults } from "./dropdown_properties";
import { DropdownProperties } from "./dropdown_properties_panel";

interface DropdownProps extends Partial<ReturnType<typeof getDropdownPropertiesDefaults>> {
  options?: string[]; // Danh sách các tùy chọn trong dropdown
  placeholder?: string; // Văn bản placeholder
}

export const DropdownLayout: React.FC<DropdownProps> & { craft: any } = (props) => {
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

  const defaultProps = getDropdownPropertiesDefaults();
  const {
    options = ["Option 1", "Option 2", "Option 3"], // Mặc định có 3 tùy chọn
    placeholder = "Select an option",
    fontFamily = defaultProps.fontFamily,
    fontSize = defaultProps.fontSize,
    fontWeight = defaultProps.fontWeight,
    color = defaultProps.color,
    backgroundColor = defaultProps.backgroundColor,
    borderWidth = defaultProps.borderWidth,
    borderColor = defaultProps.borderColor,
    borderStyle = defaultProps.borderStyle,
    borderRadius = defaultProps.borderRadius,
    padding = defaultProps.padding,
    width = defaultProps.width,
    height = defaultProps.height,
    optionHoverColor = defaultProps.optionHoverColor,
    placeholderColor = defaultProps.placeholderColor,
    arrowColor = defaultProps.arrowColor,
  } = props;

  const dropdownStyle = {
    fontFamily,
    fontSize,
    fontWeight,
    color,
    backgroundColor,
    border: `${borderWidth} ${borderStyle} ${borderColor}`,
    borderRadius,
    padding,
    width,
    maxHeight: height,
    outline: selected ? "2px solid gray" : "none",
    cursor: "pointer",
    position: "relative" as const,
    appearance: "none" as const, // Loại bỏ style mặc định của trình duyệt
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    actions.selectNode(id);
    console.log("DropdownLayout selected:", id, "Selected state:", selected);
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
      ref={(ref) => { if (ref) connect(drag(ref)); }}
      className={`relative cursor-pointer transition-all ${isHovered || selected ? "border border-d Washed border-gray-400" : ""}`}
      onContextMenu={handleContextMenu}
      onClick={handleCloseContextMenu}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <select
        style={dropdownStyle}
        onClick={handleClick}
      >
        <option value="" disabled selected style={{ color: placeholderColor }}>
          {placeholder}
        </option>
        {options.map((option, index) => (
          <option
            key={index}
            value={option}
            style={{
              backgroundColor: "inherit",
              color,
              fontFamily,
              fontSize,
              fontWeight,
            }}
          >
            {option}
          </option>
        ))}
      </select>
      {/* Tùy chỉnh mũi tên dropdown */}
      <span
        style={{
          position: "absolute",
          right: "10px",
          top: "50%",
          transform: "translateY(-50%)",
          width: "0",
          height: "0",
          borderLeft: "5px solid transparent",
          borderRight: "5px solid transparent",
          borderTop: `5px solid ${arrowColor}`,
          pointerEvents: "none",
        }}
      />
      <DeleteContextMenu
        nodeId={id}
        onClose={handleCloseContextMenu}
        position={contextMenu}
        onDelete={() => {
          actions.delete(id);
        }}
      />
    </div>
  );
};

DropdownLayout.craft = {
  displayName: "DropdownLayout",
  props: getDropdownPropertiesDefaults(),
  rules: {
    canDrag: () => true,
    canDrop: () => true,
  },
  related: {
    toolbar: DropdownProperties,
  },
};