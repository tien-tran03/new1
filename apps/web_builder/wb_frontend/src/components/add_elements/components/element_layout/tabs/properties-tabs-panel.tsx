import React, { useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  TextField,
  Select,
  MenuItem,
  Paper,
  Typography,
  InputAdornment,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { TabsPropertiesDefaults, Tab } from "./tabs-properties";
import { alpha } from "@mui/material/styles";
import SettingsIcon from "@mui/icons-material/Settings";

interface TabsPropertiesProps {
  properties: TabsPropertiesDefaults;
  onPropertyChange: (newProperties: Partial<TabsPropertiesDefaults>) => void;
  size?: "small";
}

export const TabsProperties: React.FC<TabsPropertiesProps> = ({ properties, onPropertyChange, size = "small" }) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const handleChange = <K extends keyof TabsPropertiesDefaults>(
    key: K,
    value: TabsPropertiesDefaults[K]
  ) => {
    onPropertyChange({ [key]: value });
  };

  const handleTabsChange = (newTabs: Tab[]) => {
    onPropertyChange({ tabs: newTabs });
  };

  const sections = [
    { id: "tabs", label: "Tabs", details: ["tabs", "activeTab"] },
    { id: "appearance", label: "Appearance", details: ["color", "backgroundColor", "activeBackgroundColor", "fontSize", "padding", "margin", "border"] },
  ];

  const parsePxValue = (value: string) => {
    return parseInt(value.replace("px", ""), 10) || 0;
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 1,
        bgcolor: "transparent",
        color: "white",
        maxHeight: "calc(100vh - 150px)",
        overflowY: "auto",
        "&::-webkit-scrollbar": { display: "none" }, // Ẩn thanh cuộn
        scrollbarWidth: "none", // Ẩn thanh cuộn trên Firefox
      }}
    >
      {/* Header của TabsProperties */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1, pb: 0.5, borderBottom: "1px solid rgba(99, 102, 241, 0.1)" }}>
        <SettingsIcon sx={{ color: "#6366f1", fontSize: "1rem" }} />
        <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: "0.85rem", color: alpha("#ffffff", 0.9) }}>
          Tabs Properties
        </Typography>
      </Box>

      {/* Các section thuộc tính */}
      <Box sx={{ mt: 0.5 }}>
        {sections.map((section) => (
          <Accordion
            key={section.id}
            expanded={expandedSection === section.id}
            onChange={(_, expanded) => setExpandedSection(expanded ? section.id : null)}
            sx={{
              bgcolor: alpha("#1e1e38", 0.5),
              color: "white",
              mb: 0.5,
              borderRadius: "6px",
              "&:before": { display: "none" }, // Xóa viền mặc định của Accordion
              boxShadow: "none",
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon sx={{ color: alpha("#ffffff", 0.7), fontSize: "1rem" }} />}
              sx={{
                "& .MuiAccordionSummary-content": { my: 0.5 },
                "&:hover": {
                  bgcolor: alpha("#6366f1", 0.15),
                },
                transition: "all 0.2s ease",
              }}
            >
              <Typography variant="caption" sx={{ fontSize: "0.75rem", fontWeight: 500 }}>
                {section.label}
              </Typography>
            </AccordionSummary>
            <AccordionDetails
              sx={{
                bgcolor: alpha("#1e1e38", 0.8),
                color: "white",
                p: 1,
                borderRadius: "0 0 6px 6px",
              }}
            >
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {section.details.includes("tabs") && (
                  <Box>
                    <Typography variant="caption" sx={{ minWidth: 80, color: alpha("#ffffff", 0.7), fontSize: "0.75rem", mb: 0.5 }}>
                      Tabs
                    </Typography>
                    {properties.tabs.map((tab, index) => (
                      <Box key={index} display="flex" alignItems="center" gap={1} mb={0.5} sx={{ flexWrap: "wrap" }}>
                        <TextField
                          id={`tab-title-${index}`}
                          type="text"
                          value={tab.title || ""}
                          onChange={(e) => {
                            const newTabs = [...properties.tabs];
                            newTabs[index].title = e.target.value;
                            handleTabsChange(newTabs);
                          }}
                          variant="outlined"
                          size={size}
                          placeholder="Title"
                          sx={{
                            "& .MuiInputBase-input": { color: "#ffffff", fontSize: "0.75rem" },
                            "& .MuiOutlinedInput-notchedOutline": { borderColor: alpha("#6366f1", 0.3) },
                            "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: alpha("#6366f1", 0.5) },
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#6366f1" },
                            backgroundColor: alpha("#1e1e38", 0.5),
                            borderRadius: "4px",
                            height: "32px",
                            width: "120px",
                          }}
                        />
                        <TextField
                          id={`tab-content-${index}`}
                          type="text"
                          value={tab.content || ""}
                          onChange={(e) => {
                            const newTabs = [...properties.tabs];
                            newTabs[index].content = e.target.value;
                            handleTabsChange(newTabs);
                          }}
                          variant="outlined"
                          size={size}
                          placeholder="Content"
                          sx={{
                            "& .MuiInputBase-input": { color: "#ffffff", fontSize: "0.75rem" },
                            "& .MuiOutlinedInput-notchedOutline": { borderColor: alpha("#6366f1", 0.3) },
                            "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: alpha("#6366f1", 0.5) },
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#6366f1" },
                            backgroundColor: alpha("#1e1e38", 0.5),
                            borderRadius: "4px",
                            height: "32px",
                            width: "120px",
                          }}
                        />
                      </Box>
                    ))}
                  </Box>
                )}
                {section.details.includes("activeTab") && (
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="caption" sx={{ minWidth: 80, color: alpha("#ffffff", 0.7), fontSize: "0.75rem" }}>
                      Active Tab
                    </Typography>
                    <Select
                      value={properties.activeTab || 0}
                      onChange={(e) => handleChange("activeTab", parseInt(e.target.value as string, 10))}
                      variant="outlined"
                      size={size}
                      sx={{
                        "& .MuiSelect-select": { color: "#ffffff", fontSize: "0.75rem" },
                        "& .MuiOutlinedInput-notchedOutline": { borderColor: alpha("#6366f1", 0.3) },
                        "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: alpha("#6366f1", 0.5) },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#6366f1" },
                        "& .MuiSelect-icon": { color: alpha("#ffffff", 0.7) },
                        backgroundColor: alpha("#1e1e38", 0.5),
                        borderRadius: "4px",
                        height: "32px",
                        width: "100px",
                      }}
                    >
                      {properties.tabs.map((_, index) => (
                        <MenuItem key={index} value={index} sx={{ fontSize: "0.75rem", py: 0.5 }}>{`Tab ${index + 1}`}</MenuItem>
                      ))}
                    </Select>
                  </Box>
                )}
                {section.details.includes("color") && (
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="caption" sx={{ minWidth: 80, color: alpha("#ffffff", 0.7), fontSize: "0.75rem" }}>
                      Color
                    </Typography>
                    <TextField
                      id="color"
                      type="text"
                      value={properties.color || "#ffffff"}
                      onChange={(e) => handleChange("color", e.target.value)}
                      variant="outlined"
                      size={size}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <input
                              type="color"
                              value={properties.color || "#ffffff"}
                              onChange={(e) => handleChange("color", e.target.value)}
                              style={{ width: "20px", height: "20px", border: "none", background: "none", cursor: "pointer" }}
                            />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        "& .MuiInputBase-input": { color: "#ffffff", fontSize: "0.75rem" },
                        "& .MuiOutlinedInput-notchedOutline": { borderColor: alpha("#6366f1", 0.3) },
                        "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: alpha("#6366f1", 0.5) },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#6366f1" },
                        backgroundColor: alpha("#1e1e38", 0.5),
                        borderRadius: "4px",
                        height: "32px",
                        width: "120px",
                      }}
                    />
                  </Box>
                )}
                {section.details.includes("backgroundColor") && (
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="caption" sx={{ minWidth: 80, color: alpha("#ffffff", 0.7), fontSize: "0.75rem" }}>
                      Background
                    </Typography>
                    <TextField
                      id="background-color"
                      type="text"
                      value={properties.backgroundColor || "#ffffff"}
                      onChange={(e) => handleChange("backgroundColor", e.target.value)}
                      variant="outlined"
                      size={size}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <input
                              type="color"
                              value={properties.backgroundColor || "#ffffff"}
                              onChange={(e) => handleChange("backgroundColor", e.target.value)}
                              style={{ width: "20px", height: "20px", border: "none", background: "none", cursor: "pointer" }}
                            />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        "& .MuiInputBase-input": { color: "#ffffff", fontSize: "0.75rem" },
                        "& .MuiOutlinedInput-notchedOutline": { borderColor: alpha("#6366f1", 0.3) },
                        "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: alpha("#6366f1", 0.5) },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#6366f1" },
                        backgroundColor: alpha("#1e1e38", 0.5),
                        borderRadius: "4px",
                        height: "32px",
                        width: "120px",
                      }}
                    />
                  </Box>
                )}
                {section.details.includes("activeBackgroundColor") && (
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="caption" sx={{ minWidth: 80, color: alpha("#ffffff", 0.7), fontSize: "0.75rem" }}>
                      Active Background
                    </Typography>
                    <TextField
                      id="active-background-color"
                      type="text"
                      value={properties.activeBackgroundColor || "#ffffff"}
                      onChange={(e) => handleChange("activeBackgroundColor", e.target.value)}
                      variant="outlined"
                      size={size}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <input
                              type="color"
                              value={properties.activeBackgroundColor || "#ffffff"}
                              onChange={(e) => handleChange("activeBackgroundColor", e.target.value)}
                              style={{ width: "20px", height: "20px", border: "none", background: "none", cursor: "pointer" }}
                            />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        "& .MuiInputBase-input": { color: "#ffffff", fontSize: "0.75rem" },
                        "& .MuiOutlinedInput-notchedOutline": { borderColor: alpha("#6366f1", 0.3) },
                        "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: alpha("#6366f1", 0.5) },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#6366f1" },
                        backgroundColor: alpha("#1e1e38", 0.5),
                        borderRadius: "4px",
                        height: "32px",
                        width: "120px",
                      }}
                    />
                  </Box>
                )}
                {section.details.includes("fontSize") && (
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="caption" sx={{ minWidth: 80, color: alpha("#ffffff", 0.7), fontSize: "0.75rem" }}>
                      Font Size
                    </Typography>
                    <TextField
                      id="font-size"
                      type="number"
                      value={parsePxValue(properties.fontSize || "16px")}
                      onChange={(e) => handleChange("fontSize", `${e.target.value}px`)}
                      variant="outlined"
                      size={size}
                      sx={{
                        "& .MuiInputBase-input": { color: "#ffffff", fontSize: "0.75rem" },
                        "& .MuiOutlinedInput-notchedOutline": { borderColor: alpha("#6366f1", 0.3) },
                        "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: alpha("#6366f1", 0.5) },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#6366f1" },
                        backgroundColor: alpha("#1e1e38", 0.5),
                        borderRadius: "4px",
                        height: "32px",
                        width: "120px",
                      }}
                    />
                  </Box>
                )}
                {section.details.includes("padding") && (
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="caption" sx={{ minWidth: 80, color: alpha("#ffffff", 0.7), fontSize: "0.75rem" }}>
                      Padding
                    </Typography>
                    <TextField
                      id="padding"
                      type="number"
                      value={parsePxValue(properties.padding || "0px")}
                      onChange={(e) => handleChange("padding", `${e.target.value}px`)}
                      variant="outlined"
                      size={size}
                      sx={{
                        "& .MuiInputBase-input": { color: "#ffffff", fontSize: "0.75rem" },
                        "& .MuiOutlinedInput-notchedOutline": { borderColor: alpha("#6366f1", 0.3) },
                        "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: alpha("#6366f1", 0.5) },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#6366f1" },
                        backgroundColor: alpha("#1e1e38", 0.5),
                        borderRadius: "4px",
                        height: "32px",
                        width: "120px",
                      }}
                    />
                  </Box>
                )}
                {section.details.includes("margin") && (
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="caption" sx={{ minWidth: 80, color: alpha("#ffffff", 0.7), fontSize: "0.75rem" }}>
                      Margin
                    </Typography>
                    <TextField
                      id="margin"
                      type="number"
                      value={parsePxValue(properties.margin || "0px")}
                      onChange={(e) => handleChange("margin", `${e.target.value}px`)}
                      variant="outlined"
                      size={size}
                      sx={{
                        "& .MuiInputBase-input": { color: "#ffffff", fontSize: "0.75rem" },
                        "& .MuiOutlinedInput-notchedOutline": { borderColor: alpha("#6366f1", 0.3) },
                        "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: alpha("#6366f1", 0.5) },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#6366f1" },
                        backgroundColor: alpha("#1e1e38", 0.5),
                        borderRadius: "4px",
                        height: "32px",
                        width: "120px",
                      }}
                    />
                  </Box>
                )}
                {section.details.includes("border") && (
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="caption" sx={{ minWidth: 80, color: alpha("#ffffff", 0.7), fontSize: "0.75rem" }}>
                      Border
                    </Typography>
                    <TextField
                      id="border"
                      type="text"
                      value={properties.border || ""}
                      onChange={(e) => handleChange("border", e.target.value)}
                      variant="outlined"
                      size={size}
                      sx={{
                        "& .MuiInputBase-input": { color: "#ffffff", fontSize: "0.75rem" },
                        "& .MuiOutlinedInput-notchedOutline": { borderColor: alpha("#6366f1", 0.3) },
                        "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: alpha("#6366f1", 0.5) },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#6366f1" },
                        backgroundColor: alpha("#1e1e38", 0.5),
                        borderRadius: "4px",
                        height: "32px",
                        width: "120px",
                      }}
                    />
                  </Box>
                )}
              </Box>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Paper>
  );
};