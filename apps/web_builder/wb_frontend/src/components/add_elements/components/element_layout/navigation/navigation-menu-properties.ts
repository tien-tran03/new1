// navigation-menu-properties.ts
import { ReactNode } from "react";

export interface NavigationMenuItem {
  id: string;
  label: string;
  url: string;
}

export interface DefaultNavigationMenuProperties {
    id: string;
    logoText: string;
    logoBackgroundColor: string;
    logoTextColor: string;
    menuBackgroundColor: string;
    menuTextColor: string;
    buttonBackgroundColor: string;
    buttonTextColor: string;
    padding: string;
    margin: string;
    borderColor: string;
    borderWidth: string;
    borderRadius: string;
    borderStyle: "solid" | "dashed" | "dotted" | "none";
    gap: string;
    items: NavigationMenuItem[];
    children?: ReactNode;
    logoSectionBackgroundColor: string;
    menuSectionBackgroundColor: string;
    buttonSectionBackgroundColor: string;
  }

  export const getDefaultNavigationMenuProperties = (): DefaultNavigationMenuProperties => ({
    id: "default-navigation-menu",
    logoText: "Calendar",
    logoBackgroundColor: "rgba(200, 180, 255, 0.2)", 
    logoTextColor: "rgba(255, 255, 255, 1)", 
    menuBackgroundColor: "rgba(0, 0, 0, 0)", 
    menuTextColor: "rgba(255, 255, 255, 0.7)", 
    buttonBackgroundColor: "rgba(100, 50, 200, 1)", 
    buttonTextColor: "rgba(255, 255, 255, 1)", 
    padding: "10px 20px",
    margin: "0px",
    borderColor: "#CECECE",
    borderWidth: "0px",
    borderRadius: "0px",
    borderStyle: "solid",
    gap: "20px",
    logoSectionBackgroundColor: "rgba(200, 180, 255, 0.2)",
    menuSectionBackgroundColor: "rgba(0, 0, 0, 0)",
    buttonSectionBackgroundColor: "rgba(100, 50, 200, 0.1)",
    items: [
      { id: '1', label: "Features", url: "#" },
      { id: '2', label: "Request a demo", url: "#" },
      { id: '3', label: "Nav link", url: "#" },
    ],
  });