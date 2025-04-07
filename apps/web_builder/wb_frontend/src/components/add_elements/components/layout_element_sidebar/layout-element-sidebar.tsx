import React, { useRef, useState } from "react";
import { ListElementsComponent } from "../list_element/elements-list";
import { Box, IconButton, Typography } from "@mui/material";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { alpha } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";

export const AddElementsComponent: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});
  const sidebarRef = useRef<HTMLDivElement>(null);

  return (
    <Box
      ref={sidebarRef}
      className={`transition-all duration-300 bg-gradient-to-b from-slate-900 to-indigo-950 text-white h-full flex flex-col ${isSidebarOpen ? "w-64" : "w-12"}`}
      sx={{ borderRight: "1px solid rgba(99, 102, 241, 0.1)", height: "100vh" }} 
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2,
          py: 1.5,
          borderBottom: "1px solid rgba(99, 102, 241, 0.1)",
          backgroundColor: alpha("#1e1e38", 0.5),
        }}
      >
        {isSidebarOpen && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <AddIcon sx={{ color: "#6366f1", fontSize: "1.2rem" }} />
            <Typography variant="subtitle2" sx={{ fontWeight: 600, letterSpacing: "0.01em", fontSize: "0.9rem" }}>
              Add Element
            </Typography>
          </Box>
        )}
        <IconButton
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          size="small"
          sx={{
            color: alpha("#ffffff", 0.7),
            "&:hover": {
              color: "#ffffff",
              backgroundColor: alpha("#6366f1", 0.15),
            },
            p: 0.5,
            transition: "all 0.2s ease",
          }}
        >
          {isSidebarOpen ? <FiChevronLeft size={16} /> : <FiChevronRight size={18} />}
        </IconButton>
      </Box>

      {isSidebarOpen && (
        <Box sx={{ flex: 1, p: 1 }}> 
          <ListElementsComponent
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            collapsedGroups={collapsedGroups}
            onToggleGroup={setCollapsedGroups}
          />
        </Box>
      )}
    </Box>
  );
};