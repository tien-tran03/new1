import React, { useState } from "react";
import { Box, IconButton } from "@mui/material";
import { alpha } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import LayersIcon from "@mui/icons-material/Layers";
import ViewQuiltIcon from "@mui/icons-material/ViewQuilt"; 
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import SettingsIcon from "@mui/icons-material/Settings";
import iconLogo from "../../../../assets/icons/logo.svg";

interface LeftSideBarProps {
  onComponentChange?: (component: string | null) => void;
}

export const LeftSideBar: React.FC<LeftSideBarProps> = ({ onComponentChange }) => {
  const [activeComponent, setActiveComponent] = useState<string>('add'); 

  const handleAddClick = () => {
    setActiveComponent("add");
    if (onComponentChange) onComponentChange("add");
  };

  const handleProjectClick = () => {
    setActiveComponent("layers");
    if (onComponentChange) onComponentChange("layers");
  };
  const handleLayoutClick = () => {
    setActiveComponent("layout");
    if (onComponentChange) onComponentChange("layout");
  };

  const handleDivClick = () => {
    setActiveComponent("div");
    if (onComponentChange) onComponentChange("div");
  };

  const handleHelpClick = () => {
    setActiveComponent("help");
    if (onComponentChange) onComponentChange("help");
  };

  const handleSettingsClick = () => {
    setActiveComponent("settings");
    if (onComponentChange) onComponentChange("settings");
  };

  return (
    <Box
      className="h-screen w-16 flex flex-col items-center py-2 relative"
      sx={{
        borderRight: "1px solid rgba(99, 102, 241, 0.1)",
        background: "linear-gradient(to bottom, #2a2a44, #1e1e38)",
        transition: "all 0.3s ease",
      }}
    >
      <Box sx={{ mt: 2, mb: 5 }}>
        <img src={iconLogo} alt="Logo" width="20" height="20" />
      </Box>
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 4 }}>
        <IconButton
          onClick={handleAddClick}
          size="small"
          sx={{
            color: activeComponent === "add" ? "#6366f1" : alpha("#ffffff", 0.7),
            backgroundColor: activeComponent === "add" ? alpha("#ffffff", 0.15) : "transparent",
            "&:hover": {
              color: "#ffffff",
              backgroundColor: alpha("#6366f1", 0.15),
            },
            p: 0.5,
            transition: "all 0.2s ease",
          }}
        >
          <AddIcon sx={{ fontSize: "1.2rem" }} />
        </IconButton>

        <IconButton
          onClick={handleProjectClick}
          size="small"
          sx={{
            color: activeComponent === "layers" ? "#6366f1" : alpha("#ffffff", 0.7),
            backgroundColor: activeComponent === "layers" ? alpha("#ffffff", 0.15) : "transparent",
            "&:hover": {
              color: "#ffffff",
              backgroundColor: alpha("#6366f1", 0.15),
            },
            p: 0.5,
            transition: "all 0.2s ease",
          }}
        >
          <LayersIcon sx={{ fontSize: "1.2rem" }} />
        </IconButton>

        <IconButton
          onClick={handleLayoutClick}
          size="small"
          sx={{
            color: activeComponent === "div" ? "#6366f1" : alpha("#ffffff", 0.7),
            backgroundColor: activeComponent === "div" ? alpha("#ffffff", 0.15) : "transparent",
            "&:hover": {
              color: "#ffffff",
              backgroundColor: alpha("#6366f1", 0.15),
            },
            p: 0.5,
            transition: "all 0.2s ease",
          }}
        >
          <ViewQuiltIcon sx={{ fontSize: "1.2rem" }} />
        </IconButton>
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 5, mb: 8 }}>
        <IconButton
          onClick={handleHelpClick}
          disabled={true}
          size="small"
          sx={{
            color: activeComponent === "help" ? "#6366f1" : alpha("#ffffff", 0.7),
            backgroundColor: activeComponent === "help" ? alpha("#ffffff", 0.15) : "transparent",
            "&:hover": {
              color: "#ffffff",
              backgroundColor: alpha("#6366f1", 0.15),
            },
            p: 0.5,
            transition: "all 0.2s ease",
          }}
        >
          <HelpOutlineIcon sx={{ fontSize: "1.2rem" }} />
        </IconButton>

        <IconButton
          onClick={handleSettingsClick}
          size="small"
          disabled={true}
          sx={{
            color: activeComponent === "settings" ? "#6366f1" : alpha("#ffffff", 0.7),
            backgroundColor: activeComponent === "settings" ? alpha("#ffffff", 0.15) : "transparent",
            "&:hover": {
              color: "#ffffff",
              backgroundColor: alpha("#6366f1", 0.15),
            },
            p: 0.5,
            transition: "all 0.2s ease",
          }}
        >
          <SettingsIcon sx={{ fontSize: "1.2rem" }} />
        </IconButton>
      </Box>
    </Box>
  );
};