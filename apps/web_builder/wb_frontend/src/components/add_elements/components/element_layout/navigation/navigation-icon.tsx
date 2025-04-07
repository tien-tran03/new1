import React from "react";
import { useEditor, Element } from "@craftjs/core";
import { elementConfigs } from "../../../data";
import { NavigationMenuLayout } from "./navigation-menu-layout"; // Import NavigationMenuLayout

export const NavbarIcon: React.FC = () => {
  const { connectors: { create } } = useEditor();
  const navigationMenuData = elementConfigs.find((el) => el.name === "Navbar"); // Tìm NavigationMenu trong elementConfigs

  if (!navigationMenuData) return <div>NavigationMenu not found</div>;

  return (
    <div
      className="flex flex-col items-center gap-2 p-1 cursor-pointer"
      ref={(ref: HTMLDivElement) => {
        create(
          ref,
          <Element
            canvas
            is={NavigationMenuLayout} 
          />
        );
      }}
    >
      <img src={navigationMenuData.iconUrl} alt={navigationMenuData.name} className="w-6 h-6" />
      <span className="text-xs font-medium">{navigationMenuData.name}</span>
    </div>
  );
};