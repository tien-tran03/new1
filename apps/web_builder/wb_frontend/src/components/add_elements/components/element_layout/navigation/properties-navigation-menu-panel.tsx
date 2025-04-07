// properties-navigation-menu-panel.tsx
import React, { useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Paper,
  InputAdornment,
  Tooltip,
  IconButton,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MenuIcon from "@mui/icons-material/Menu";
import { DefaultNavigationMenuProperties } from "./navigation-menu-properties";
import { alpha } from "@mui/material/styles";
import TuneIcon from "@mui/icons-material/Tune";
import FormatColorFillIcon from "@mui/icons-material/FormatColorFill";
import BorderStyleIcon from "@mui/icons-material/BorderStyle";
import SpaceBarIcon from "@mui/icons-material/SpaceBar";
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

interface NavigationMenuPropertiesProps {
  properties: DefaultNavigationMenuProperties;
  onPropertyChange: (newProperties: Partial<DefaultNavigationMenuProperties>) => void;
  size?: "small";
}

export const NavigationMenuProperties: React.FC<NavigationMenuPropertiesProps> = ({
  properties,
  onPropertyChange,
  size = "small",
}) => {
  const [expandedSection, setExpandedSection] = useState<string | null>("style");

  const handleChange = (key: keyof DefaultNavigationMenuProperties, value: any) => {
    onPropertyChange({ [key]: value });
  };

  const sections = [
    { id: "items", label: "Menu Items", icon: <MenuIcon />, details: ["items"] },
    { id: "style", label: "Style", icon: <FormatColorFillIcon />, details: ["logoText", "logoBackgroundColor", "logoTextColor", "logoSectionBackgroundColor", "menuBackgroundColor", "menuTextColor", "menuSectionBackgroundColor", "buttonBackgroundColor", "buttonTextColor", "buttonSectionBackgroundColor", "gap"] },
    { id: "spacing", label: "Spacing", icon: <SpaceBarIcon />, details: ["padding", "margin"] },
    { id: "decoration", label: "Decoration", icon: <BorderStyleIcon />, details: ["borderColor", "borderWidth", "borderRadius", "borderStyle"] },
  ];

  const textFieldStyle = {
    "& .MuiInputBase-input": {
      color: "#ffffff",
      fontSize: "0.75rem",
      "&::-webkit-inner-spin-button, &::-webkit-outer-spin-button": {
        "-webkit-appearance": "none",
        margin: 0,
      },
      "-moz-appearance": "textfield",
    },
    "& .MuiOutlinedInput-notchedOutline": { borderColor: alpha("#6366f1", 0.3) },
    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: alpha("#6366f1", 0.5) },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#6366f1" },
    backgroundColor: alpha("#1e1e38", 0.5),
    borderRadius: "4px",
    height: "32px",
  };

  const handleAddItem = () => {
    const newItem = {
      id: Date.now().toString(),
      label: "New Item",
      url: "#"
    };
    onPropertyChange({
      items: [...(properties.items || []), newItem]
    });
  };

  const handleDeleteItem = (id: string) => {
    onPropertyChange({
      items: properties.items.filter(item => item.id !== id)
    });
  };

  const handleUpdateItem = (id: string, field: 'label' | 'url', value: string) => {
    onPropertyChange({
      items: properties.items.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    });
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 1.5,
        bgcolor: alpha("#0f0f1e", 0.7),
        color: "white",
        maxHeight: "calc(100vh - 150px)",
        overflowY: "auto",
        "&::-webkit-scrollbar": { width: "6px" },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: alpha("#6366f1", 0.3),
          borderRadius: "3px",
          "&:hover": { backgroundColor: alpha("#6366f1", 0.5) },
        },
        borderRadius: "8px",
        boxShadow: `0 4px 20px ${alpha("#000", 0.2)}`,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2, pb: 1, borderBottom: `1px solid ${alpha("#6366f1", 0.2)}` }}>
        <TuneIcon sx={{ color: "#6366f1", fontSize: "1.2rem" }} />
        <Typography variant="subtitle1" sx={{ fontWeight: 600, fontSize: "0.9rem", color: alpha("#ffffff", 0.95) }}>
          Navigation Menu Properties
        </Typography>
      </Box>

      <Box sx={{ mt: 0.5 }}>
        {sections.map((section) => (
          <Accordion
            key={section.id}
            expanded={expandedSection === section.id}
            onChange={(_, expanded) => setExpandedSection(expanded ? section.id : null)}
            sx={{
              bgcolor: alpha("#1e1e38", 0.5),
              color: "white",
              mb: 1,
              borderRadius: "8px",
              "&:before": { display: "none" },
              boxShadow: `0 2px 8px ${alpha("#000", 0.15)}`,
              transition: "all 0.2s ease",
              "&:hover": {
                boxShadow: `0 4px 12px ${alpha("#000", 0.2)}`,
              },
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon sx={{ color: alpha("#ffffff", 0.8), fontSize: "1.1rem" }} />}
              sx={{
                "& .MuiAccordionSummary-content": { my: 0.7 },
                "&:hover": {
                  bgcolor: alpha("#6366f1", 0.2),
                },
                borderRadius: "8px",
                transition: "all 0.2s ease",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Box sx={{ color: "#6366f1", display: "flex", alignItems: "center", fontSize: "0.9rem" }}>
                  {section.icon}
                </Box>
                <Typography variant="body2" sx={{ fontSize: "0.8rem", fontWeight: 500 }}>
                  {section.label}
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails
              sx={{
                bgcolor: alpha("#1e1e38", 0.8),
                color: "white",
                p: 1.5,
                borderRadius: "0 0 8px 8px",
              }}
            >
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                {section.details.includes("items") && (
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="caption" sx={{ color: alpha("#ffffff", 0.8), fontSize: "0.75rem" }}>
                        Menu Items
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={handleAddItem}
                        sx={{ color: "#6366f1", '&:hover': { bgcolor: alpha("#6366f1", 0.1) } }}
                      >
                        <AddIcon fontSize="small" />
                      </IconButton>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      {properties.items.map((item, index) => (
                        <Box
                          key={item.id}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            p: 1,
                            bgcolor: alpha("#1e1e38", 0.5),
                            borderRadius: "4px",
                            '&:hover': { bgcolor: alpha("#1e1e38", 0.7) }
                          }}
                        >
                          <DragIndicatorIcon sx={{ color: alpha("#ffffff", 0.3), fontSize: "1rem" }} />
                          <TextField
                            size="small"
                            value={item.label}
                            onChange={(e) => handleUpdateItem(item.id, 'label', e.target.value)}
                            sx={{
                              flex: 1,
                              "& .MuiInputBase-input": { color: "#ffffff", fontSize: "0.75rem" },
                              "& .MuiOutlinedInput-notchedOutline": { borderColor: alpha("#6366f1", 0.3) },
                              "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: alpha("#6366f1", 0.5) },
                              "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#6366f1" },
                              backgroundColor: alpha("#1e1e38", 0.3),
                              borderRadius: "4px",
                            }}
                          />
                          <TextField
                            size="small"
                            value={item.url}
                            onChange={(e) => handleUpdateItem(item.id, 'url', e.target.value)}
                            sx={{
                              flex: 1,
                              "& .MuiInputBase-input": { color: "#ffffff", fontSize: "0.75rem" },
                              "& .MuiOutlinedInput-notchedOutline": { borderColor: alpha("#6366f1", 0.3) },
                              "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: alpha("#6366f1", 0.5) },
                              "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#6366f1" },
                              backgroundColor: alpha("#1e1e38", 0.3),
                              borderRadius: "4px",
                            }}
                          />
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteItem(item.id)}
                            sx={{ color: alpha("#ff4444", 0.7), '&:hover': { bgcolor: alpha("#ff4444", 0.1) } }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                )}
                {section.details.includes("logoText") && (
                  <Box display="flex" alignItems="center" gap={1.5}>
                    <Typography variant="caption" sx={{ minWidth: 80, color: alpha("#ffffff", 0.8), fontSize: "0.75rem" }}>
                      Logo Text
                    </Typography>
                    <TextField
                      value={properties.logoText || "Calendar"}
                      onChange={(e) => handleChange("logoText", e.target.value)}
                      variant="outlined"
                      size={size}
                      sx={textFieldStyle}
                    />
                  </Box>
                )}
                {section.details.includes("logoBackgroundColor") && (
                  <Box display="flex" alignItems="center" gap={1.5}>
                    <Typography variant="caption" sx={{ minWidth: 80, color: alpha("#ffffff", 0.8), fontSize: "0.75rem" }}>
                      Logo Background
                    </Typography>
                    <TextField
                      value={properties.logoBackgroundColor || "rgba(200, 180, 255, 0.2)"}
                      onChange={(e) => handleChange("logoBackgroundColor", e.target.value)}
                      variant="outlined"
                      size={size}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Tooltip title="Choose color">
                              <input
                                type="color"
                                value={properties.logoBackgroundColor || "rgba(200, 180, 255, 0.2)"}
                                onChange={(e) => handleChange("logoBackgroundColor", e.target.value)}
                                style={{
                                  width: "22px",
                                  height: "22px",
                                  border: "none",
                                  background: "none",
                                  cursor: "pointer",
                                  borderRadius: "4px",
                                }}
                              />
                            </Tooltip>
                          </InputAdornment>
                        ),
                      }}
                      sx={textFieldStyle}
                    />
                  </Box>
                )}
                {section.details.includes("logoTextColor") && (
                  <Box display="flex" alignItems="center" gap={1.5}>
                    <Typography variant="caption" sx={{ minWidth: 80, color: alpha("#ffffff", 0.8), fontSize: "0.75rem" }}>
                      Logo Text Color
                    </Typography>
                    <TextField
                      value={properties.logoTextColor || "rgba(255, 255, 255, 1)"}
                      onChange={(e) => handleChange("logoTextColor", e.target.value)}
                      variant="outlined"
                      size={size}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Tooltip title="Choose color">
                              <input
                                type="color"
                                value={properties.logoTextColor || "rgba(255, 255, 255, 1)"}
                                onChange={(e) => handleChange("logoTextColor", e.target.value)}
                                style={{
                                  width: "22px",
                                  height: "22px",
                                  border: "none",
                                  background: "none",
                                  cursor: "pointer",
                                  borderRadius: "4px",
                                }}
                              />
                            </Tooltip>
                          </InputAdornment>
                        ),
                      }}
                      sx={textFieldStyle}
                    />
                  </Box>
                )}
                {section.details.includes("logoSectionBackgroundColor") && (
                  <Box display="flex" alignItems="center" gap={1.5}>
                    <Typography variant="caption" sx={{ minWidth: 80, color: alpha("#ffffff", 0.8), fontSize: "0.75rem" }}>
                      Logo Section Background
                    </Typography>
                    <TextField
                      value={properties.logoSectionBackgroundColor || "rgba(200, 180, 255, 0.2)"}
                      onChange={(e) => handleChange("logoSectionBackgroundColor", e.target.value)}
                      variant="outlined"
                      size={size}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Tooltip title="Choose color">
                              <input
                                type="color"
                                value={properties.logoSectionBackgroundColor || "rgba(200, 180, 255, 0.2)"}
                                onChange={(e) => handleChange("logoSectionBackgroundColor", e.target.value)}
                                style={{
                                  width: "22px",
                                  height: "22px",
                                  border: "none",
                                  background: "none",
                                  cursor: "pointer",
                                  borderRadius: "4px",
                                }}
                              />
                            </Tooltip>
                          </InputAdornment>
                        ),
                      }}
                      sx={textFieldStyle}
                    />
                  </Box>
                )}
                {section.details.includes("menuBackgroundColor") && (
                  <Box display="flex" alignItems="center" gap={1.5}>
                    <Typography variant="caption" sx={{ minWidth: 80, color: alpha("#ffffff", 0.8), fontSize: "0.75rem" }}>
                      Menu Background
                    </Typography>
                    <TextField
                      value={properties.menuBackgroundColor || "rgba(0, 0, 0, 0)"}
                      onChange={(e) => handleChange("menuBackgroundColor", e.target.value)}
                      variant="outlined"
                      size={size}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Tooltip title="Choose color">
                              <input
                                type="color"
                                value={properties.menuBackgroundColor || "rgba(0, 0, 0, 0)"}
                                onChange={(e) => handleChange("menuBackgroundColor", e.target.value)}
                                style={{
                                  width: "22px",
                                  height: "22px",
                                  border: "none",
                                  background: "none",
                                  cursor: "pointer",
                                  borderRadius: "4px",
                                }}
                              />
                            </Tooltip>
                          </InputAdornment>
                        ),
                      }}
                      sx={textFieldStyle}
                    />
                  </Box>
                )}
                {section.details.includes("menuTextColor") && (
                  <Box display="flex" alignItems="center" gap={1.5}>
                    <Typography variant="caption" sx={{ minWidth: 80, color: alpha("#ffffff", 0.8), fontSize: "0.75rem" }}>
                      Menu Text Color
                    </Typography>
                    <TextField
                      value={properties.menuTextColor || "rgba(255, 255, 255, 0.7)"}
                      onChange={(e) => handleChange("menuTextColor", e.target.value)}
                      variant="outlined"
                      size={size}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Tooltip title="Choose color">
                              <input
                                type="color"
                                value={properties.menuTextColor || "rgba(255, 255, 255, 0.7)"}
                                onChange={(e) => handleChange("menuTextColor", e.target.value)}
                                style={{
                                  width: "22px",
                                  height: "22px",
                                  border: "none",
                                  background: "none",
                                  cursor: "pointer",
                                  borderRadius: "4px",
                                }}
                              />
                            </Tooltip>
                          </InputAdornment>
                        ),
                      }}
                      sx={textFieldStyle}
                    />
                  </Box>
                )}
                {section.details.includes("menuSectionBackgroundColor") && (
                  <Box display="flex" alignItems="center" gap={1.5}>
                    <Typography variant="caption" sx={{ minWidth: 80, color: alpha("#ffffff", 0.8), fontSize: "0.75rem" }}>
                      Menu Section Background
                    </Typography>
                    <TextField
                      value={properties.menuSectionBackgroundColor || "rgba(0, 0, 0, 0)"}
                      onChange={(e) => handleChange("menuSectionBackgroundColor", e.target.value)}
                      variant="outlined"
                      size={size}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Tooltip title="Choose color">
                              <input
                                type="color"
                                value={properties.menuSectionBackgroundColor || "rgba(0, 0, 0, 0)"}
                                onChange={(e) => handleChange("menuSectionBackgroundColor", e.target.value)}
                                style={{
                                  width: "22px",
                                  height: "22px",
                                  border: "none",
                                  background: "none",
                                  cursor: "pointer",
                                  borderRadius: "4px",
                                }}
                              />
                            </Tooltip>
                          </InputAdornment>
                        ),
                      }}
                      sx={textFieldStyle}
                    />
                  </Box>
                )}
                {section.details.includes("buttonBackgroundColor") && (
                  <Box display="flex" alignItems="center" gap={1.5}>
                    <Typography variant="caption" sx={{ minWidth: 80, color: alpha("#ffffff", 0.8), fontSize: "0.75rem" }}>
                      Button Background
                    </Typography>
                    <TextField
                      value={properties.buttonBackgroundColor || "rgba(100, 50, 200, 1)"}
                      onChange={(e) => handleChange("buttonBackgroundColor", e.target.value)}
                      variant="outlined"
                      size={size}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Tooltip title="Choose color">
                              <input
                                type="color"
                                value={properties.buttonBackgroundColor || "rgba(100, 50, 200, 1)"}
                                onChange={(e) => handleChange("buttonBackgroundColor", e.target.value)}
                                style={{
                                  width: "22px",
                                  height: "22px",
                                  border: "none",
                                  background: "none",
                                  cursor: "pointer",
                                  borderRadius: "4px",
                                }}
                              />
                            </Tooltip>
                          </InputAdornment>
                        ),
                      }}
                      sx={textFieldStyle}
                    />
                  </Box>
                )}
                {section.details.includes("buttonTextColor") && (
                  <Box display="flex" alignItems="center" gap={1.5}>
                    <Typography variant="caption" sx={{ minWidth: 80, color: alpha("#ffffff", 0.8), fontSize: "0.75rem" }}>
                      Button Text Color
                    </Typography>
                    <TextField
                      value={properties.buttonTextColor || "rgba(255, 255, 255, 1)"}
                      onChange={(e) => handleChange("buttonTextColor", e.target.value)}
                      variant="outlined"
                      size={size}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Tooltip title="Choose color">
                              <input
                                type="color"
                                value={properties.buttonTextColor || "rgba(255, 255, 255, 1)"}
                                onChange={(e) => handleChange("buttonTextColor", e.target.value)}
                                style={{
                                  width: "22px",
                                  height: "22px",
                                  border: "none",
                                  background: "none",
                                  cursor: "pointer",
                                  borderRadius: "4px",
                                }}
                              />
                            </Tooltip>
                          </InputAdornment>
                        ),
                      }}
                      sx={textFieldStyle}
                    />
                  </Box>
                )}
                {section.details.includes("buttonSectionBackgroundColor") && (
                  <Box display="flex" alignItems="center" gap={1.5}>
                    <Typography variant="caption" sx={{ minWidth: 80, color: alpha("#ffffff", 0.8), fontSize: "0.75rem" }}>
                      Button Section Background
                    </Typography>
                    <TextField
                      value={properties.buttonSectionBackgroundColor || "rgba(100, 50, 200, 0.1)"}
                      onChange={(e) => handleChange("buttonSectionBackgroundColor", e.target.value)}
                      variant="outlined"
                      size={size}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Tooltip title="Choose color">
                              <input
                                type="color"
                                value={properties.buttonSectionBackgroundColor || "rgba(100, 50, 200, 0.1)"}
                                onChange={(e) => handleChange("buttonSectionBackgroundColor", e.target.value)}
                                style={{
                                  width: "22px",
                                  height: "22px",
                                  border: "none",
                                  background: "none",
                                  cursor: "pointer",
                                  borderRadius: "4px",
                                }}
                              />
                            </Tooltip>
                          </InputAdornment>
                        ),
                      }}
                      sx={textFieldStyle}
                    />
                  </Box>
                )}
                {section.details.includes("gap") && (
                  <Box display="flex" alignItems="center" gap={1.5}>
                    <Typography variant="caption" sx={{ minWidth: 80, color: alpha("#ffffff", 0.8), fontSize: "0.75rem" }}>
                      Gap
                    </Typography>
                    <TextField
                      type="number"
                      value={parseInt(properties.gap || "0", 10)}
                      onChange={(e) => handleChange("gap", `${e.target.value}px`)}
                      variant="outlined"
                      size={size}
                      sx={textFieldStyle}
                    />
                  </Box>
                )}
                {section.details.includes("padding") && (
                  <Box display="flex" alignItems="center" gap={1.5}>
                    <Typography variant="caption" sx={{ minWidth: 80, color: alpha("#ffffff", 0.8), fontSize: "0.75rem" }}>
                      Padding
                    </Typography>
                    <TextField
                      value={properties.padding || "10px 20px"}
                      onChange={(e) => handleChange("padding", e.target.value)}
                      variant="outlined"
                      size={size}
                      sx={textFieldStyle}
                    />
                  </Box>
                )}
                {section.details.includes("margin") && (
                  <Box display="flex" alignItems="center" gap={1.5}>
                    <Typography variant="caption" sx={{ minWidth: 80, color: alpha("#ffffff", 0.8), fontSize: "0.75rem" }}>
                      Margin
                    </Typography>
                    <TextField
                      value={properties.margin || "0px"}
                      onChange={(e) => handleChange("margin", e.target.value)}
                      variant="outlined"
                      size={size}
                      sx={textFieldStyle}
                    />
                  </Box>
                )}
                {section.details.includes("borderColor") && (
                  <Box display="flex" alignItems="center" gap={1.5}>
                    <Typography variant="caption" sx={{ minWidth: 80, color: alpha("#ffffff", 0.8), fontSize: "0.75rem" }}>
                      Border Color
                    </Typography>
                    <TextField
                      value={properties.borderColor || "#CECECE"}
                      onChange={(e) => handleChange("borderColor", e.target.value)}
                      variant="outlined"
                      size={size}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Tooltip title="Choose color">
                              <input
                                type="color"
                                value={properties.borderColor || "#CECECE"}
                                onChange={(e) => handleChange("borderColor", e.target.value)}
                                style={{
                                  width: "22px",
                                  height: "22px",
                                  border: "none",
                                  background: "none",
                                  cursor: "pointer",
                                  borderRadius: "4px",
                                }}
                              />
                            </Tooltip>
                          </InputAdornment>
                        ),
                      }}
                      sx={textFieldStyle}
                    />
                  </Box>
                )}
                {section.details.includes("borderWidth") && (
                  <Box display="flex" alignItems="center" gap={1.5}>
                    <Typography variant="caption" sx={{ minWidth: 80, color: alpha("#ffffff", 0.8), fontSize: "0.75rem" }}>
                      Border Width
                    </Typography>
                    <TextField
                      type="number"
                      value={parseInt(properties.borderWidth || "0", 10)}
                      onChange={(e) => handleChange("borderWidth", `${e.target.value}px`)}
                      variant="outlined"
                      size={size}
                      sx={textFieldStyle}
                    />
                  </Box>
                )}
                {section.details.includes("borderRadius") && (
                  <Box display="flex" alignItems="center" gap={1.5}>
                    <Typography variant="caption" sx={{ minWidth: 80, color: alpha("#ffffff", 0.8), fontSize: "0.75rem" }}>
                      Border Radius
                    </Typography>
                    <TextField
                      type="number"
                      value={parseInt(properties.borderRadius || "0", 10)}
                      onChange={(e) => handleChange("borderRadius", `${e.target.value}px`)}
                      variant="outlined"
                      size={size}
                      sx={textFieldStyle}
                    />
                  </Box>
                )}
                {section.details.includes("borderStyle") && (
                  <Box>
                    <Typography variant="caption" sx={{ color: alpha("#ffffff", 0.8), fontSize: "0.75rem", mb: 0.8, display: "block" }}>
                      Border Style
                    </Typography>
                    <RadioGroup
                      row
                      value={properties.borderStyle || "solid"}
                      onChange={(e) => handleChange("borderStyle", e.target.value)}
                      sx={{ color: "white", gap: 1 }}
                    >
                      {["solid", "dashed", "dotted", "none"].map((style) => (
                        <Tooltip key={style} title={style.charAt(0).toUpperCase() + style.slice(1)}>
                          <FormControlLabel
                            value={style}
                            control={
                              <Radio
                                sx={{
                                  color: alpha("#6366f1", 0.7),
                                  "&.Mui-checked": { color: "#6366f1" },
                                  padding: "4px",
                                }}
                                size="small"
                              />
                            }
                            label={
                              <Typography variant="caption" sx={{ fontSize: "0.75rem", color: alpha("#ffffff", 0.8) }}>
                                {style.charAt(0).toUpperCase() + style.slice(1)}
                              </Typography>
                            }
                          />
                        </Tooltip>
                      ))}
                    </RadioGroup>
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