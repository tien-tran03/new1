import React, { useState } from "react";
import { useEditor, useNode } from "@craftjs/core";
import { DeleteContextMenu } from "../../../delete_context_menu/delete-context-menu";
import { DefaultNavigationMenuProperties, getDefaultNavigationMenuProperties } from "./navigation-menu-properties";
import { NavigationMenuProperties } from "./properties-navigation-menu-panel";
import { Box, Button, TextField } from "@mui/material";

export const NavigationMenuLayout = (props: Partial<DefaultNavigationMenuProperties>) => {
  const { selected, id, data } = useNode((node) => ({
    selected: node.events.selected,
    id: node.id,
    data: node.data, 
  }));

  const { actions } = useEditor();
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);

  const [editingField, setEditingField] = useState<string | null>(null); 
  const [editValue, setEditValue] = useState<string>("");

  const {
    logoText = "Calendar",
    logoBackgroundColor = "rgba(200, 180, 255, 0.2)",
    logoTextColor = "rgba(255, 255, 255, 1)",
    menuBackgroundColor = "rgba(0, 0, 0, 0)",
    menuTextColor = "rgba(255, 255, 255, 0.7)",
    buttonBackgroundColor = "rgba(100, 50, 200, 1)",
    buttonTextColor = "rgba(255, 255, 255, 1)",
    padding = "10px 20px",
    margin = "0px",
    borderColor = "#CECECE",
    borderWidth = "0px",
    borderRadius = "0px",
    borderStyle = "solid",
    gap = "20px",
    items = getDefaultNavigationMenuProperties().items,
    children,
  } = props;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    actions.selectNode(id);
    console.log("Navigation Menu clicked and selected:", id);
  };

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    setContextMenu({ x: event.pageX, y: event.pageY });
  };

  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };

  const startEditing = (field: string, initialValue: string) => {
    setEditingField(field);
    setEditValue(initialValue);
  };

  const saveEdit = () => {
    if (editingField === "logoText") {
      actions.setProp(id, (props: DefaultNavigationMenuProperties) => {
        props.logoText = editValue;
      });
    } else if (editingField?.startsWith("item-")) {
      const itemIndex = parseInt(editingField.split("-")[1], 10);
      const updatedItems = [...items];
      updatedItems[itemIndex] = { ...updatedItems[itemIndex], label: editValue };

      actions.setProp(id, (props: DefaultNavigationMenuProperties) => {
        props.items = updatedItems;
      });
    }
    setEditingField(null); 
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      saveEdit();
    }
  };

  const handleBlur = () => {
    saveEdit();
  };

  return (
    <Box
      onContextMenu={handleContextMenu}
      onClick={handleClick}
      sx={{
        background: menuBackgroundColor,
        padding: padding,
        margin: margin,
        borderColor: borderColor,
        borderWidth: borderWidth,
        borderRadius: borderRadius,
        borderStyle: borderStyle,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        outline: selected ? "2px solid gray" : "none",
      }}
    >
      <Box
        sx={{
          background: logoBackgroundColor,
          color: logoTextColor,
          padding: "5px 10px",
          borderRadius: "4px",
        }}
      >
        {editingField === "logoText" ? (
          <TextField
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyPress={handleKeyPress}
            onBlur={handleBlur}
            autoFocus
            size="small"
            sx={{ width: "auto" }}
          />
        ) : (
          <Box
            onDoubleClick={() => startEditing("logoText", logoText)}
            sx={{ cursor: "pointer" }}
          >
            {logoText}
          </Box>
        )}
      </Box>

      <Box sx={{ display: "flex", gap: gap }}>
        {items.map((item, index) => (
          <Box key={index}>
            {editingField === `item-${index}` ? (
              <TextField
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyPress={handleKeyPress}
                onBlur={handleBlur}
                autoFocus
                size="small"
                sx={{ width: "auto" }}
              />
            ) : (
              <a
                href={item.url}
                style={{
                  color: menuTextColor,
                  textDecoration: "none",
                  padding: "5px 10px",
                }}
                onDoubleClick={() => startEditing(`item-${index}`, item.label)}
              >
                {item.label}
              </a>
            )}
          </Box>
        ))}
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
        {items.length > 0 && (
          <Button
            variant="contained"
            sx={{
              backgroundColor: buttonBackgroundColor,
              color: buttonTextColor,
              "&:hover": {
                backgroundColor: buttonBackgroundColor,
                opacity: 0.9,
              },
            }}
          >
            {items[items.length - 1].label}
          </Button>
        )}
      </Box>

      {children}
      <DeleteContextMenu
        nodeId={id}
        onClose={handleCloseContextMenu}
        position={contextMenu}
        onDelete={() => {}}
      />
    </Box>
  );
};

NavigationMenuLayout.craft = {
  displayName: "NavbarLayout",
  props: getDefaultNavigationMenuProperties(),
  rules: {
    canDrop: () => true,
    canDrag:()=> true,
  },
  related: {
    toolbar: NavigationMenuProperties,
  },
};