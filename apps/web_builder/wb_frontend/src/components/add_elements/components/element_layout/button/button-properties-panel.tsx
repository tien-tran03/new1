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
  RadioGroup,
  FormControlLabel,
  Radio,
  Typography,
  InputAdornment,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { ButtonPropertiesDefaults } from "./button-properties";
import { alpha } from "@mui/material/styles";
import SettingsIcon from "@mui/icons-material/Settings";

interface ButtonPropertiesProps {
  properties: ButtonPropertiesDefaults;
  onPropertyChange: (newProperties: Partial<ButtonPropertiesDefaults>) => void;
  size?: "small";
}

export const ButtonProperties: React.FC<ButtonPropertiesProps> = ({ properties, onPropertyChange, size = "small" }) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const handleChange = <K extends keyof ButtonPropertiesDefaults>(key: K, value: ButtonPropertiesDefaults[K]) => {
    onPropertyChange({ [key]: value });
  };

  const sections = [
    { id: "typography", label: "Typography", details: ["fontFamily", "fontWeight", "fontSize", "lineHeight", "color", "textAlign", "textDecoration"] },
    { id: "backgrounds", label: "Backgrounds", details: ["backgroundColor"] },
    { id: "borders", label: "Borders", details: ["borderRadius", "borderStyle", "borderWidth", "borderColor"] },
  ];

  return (
    <Paper
      elevation={0}
      sx={{
        p: 1.5,
        bgcolor: alpha('#1e1e38', 0.3),
        color: "white",
        maxHeight: "calc(100vh - 150px)",
        overflowY: "auto",
        "&::-webkit-scrollbar": {
          width: "4px",
        },
        "&::-webkit-scrollbar-track": {
          background: "transparent",
        },
        "&::-webkit-scrollbar-thumb": {
          background: alpha("#6366f1", 0.3),
          borderRadius: "4px",
        },
        borderRadius: "8px",
      }}
    >
      <Box 
        sx={{ 
          display: "flex", 
          alignItems: "center", 
          gap: 1.5,
          mb: 2,
          pb: 1,
          borderBottom: `1px solid ${alpha("#6366f1", 0.2)}`,
        }}
      >
        <SettingsIcon sx={{ 
          color: "#6366f1", 
          fontSize: "1.1rem",
          filter: "drop-shadow(0 0 2px rgba(99, 102, 241, 0.3))" 
        }} />
        <Typography 
          variant="subtitle2" 
          sx={{ 
            fontWeight: 600, 
            fontSize: "0.9rem",
            color: alpha("#ffffff", 0.95),
            textShadow: "0 0 10px rgba(99, 102, 241, 0.3)"
          }}
        >
          Button Properties
        </Typography>
      </Box>

      <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
        {sections.map((section) => (
          <Accordion
            key={section.id}
            expanded={expandedSection === section.id}
            onChange={(_, expanded) => setExpandedSection(expanded ? section.id : null)}
            sx={{
              bgcolor: alpha("#1e1e38", 0.5),
              color: "white",
              borderRadius: "8px !important",
              "&:before": { display: "none" },
              boxShadow: "none",
              transition: "all 0.3s ease",
              "&:hover": {
                bgcolor: alpha("#1e1e38", 0.7),
              },
              "& .MuiAccordionSummary-root": {
                minHeight: "42px",
              },
              overflow: 'hidden',
            }}
          >
            <AccordionSummary
              expandIcon={
                <ExpandMoreIcon 
                  sx={{ 
                    color: alpha("#ffffff", 0.7),
                    fontSize: "1.1rem",
                    transition: "transform 0.3s ease",
                    transform: expandedSection === section.id ? "rotate(180deg)" : "rotate(0)",
                  }} 
                />
              }
              sx={{
                "& .MuiAccordionSummary-content": { 
                  my: 0.5,
                  transition: "margin 0.3s ease",
                },
                "&:hover": {
                  bgcolor: alpha("#6366f1", 0.15),
                },
                transition: "all 0.2s ease",
              }}
            >
              <Typography 
                variant="caption" 
                sx={{ 
                  fontSize: "0.8rem", 
                  fontWeight: 500,
                  color: expandedSection === section.id ? "#6366f1" : alpha("#ffffff", 0.9),
                  transition: "color 0.3s ease",
                }}
              >
                {section.label}
              </Typography>
            </AccordionSummary>

            <AccordionDetails
              sx={{
                bgcolor: alpha("#1e1e38", 0.8),
                p: 2,
                borderRadius: "0 0 8px 8px",
                transition: "all 0.3s ease",
              }}
            >
              <Box sx={{ 
                display: "flex", 
                flexDirection: "column", 
                gap: 2,
              }}>
                {section.details.includes("fontFamily") && (
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="caption" sx={{ minWidth: 80, color: alpha("#ffffff", 0.7), fontSize: "0.75rem" }}>
                      Font
                    </Typography>
                    <Select
                      value={properties.fontFamily || "Arial, sans-serif"}
                      onChange={(e) => handleChange("fontFamily", e.target.value as string)}
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
                      }}
                    >
                      <MenuItem value="Arial, sans-serif" sx={{ fontSize: "0.75rem", py: 0.5 }}>Arial</MenuItem>
                      <MenuItem value="Helvetica, sans-serif" sx={{ fontSize: "0.75rem", py: 0.5 }}>Helvetica</MenuItem>
                      <MenuItem value="Times New Roman, serif" sx={{ fontSize: "0.75rem", py: 0.5 }}>Times New Roman</MenuItem>
                    </Select>
                  </Box>
                )}
                {section.details.includes("fontWeight") && (
                  <Box>
                    <Typography variant="caption" sx={{ minWidth: 80, color: alpha("#ffffff", 0.7), fontSize: "0.75rem", mb: 0.5 }}>
                      Weight
                    </Typography>
                    <RadioGroup
                      row
                      value={properties.fontWeight || "400"}
                      onChange={(e) => handleChange("fontWeight", e.target.value as "100" | "400" | "700")}
                      sx={{ 
                        display: 'flex',
                        flexDirection: 'row',
                        gap: 1,
                        "& .MuiFormControlLabel-root": {
                          marginRight: 0,
                          "& .MuiRadio-root": {
                            padding: "4px",
                          }
                        }
                      }}
                    >
                      <FormControlLabel
                        value="100"
                        control={<Radio sx={{ color: alpha("#6366f1", 0.7), "&.Mui-checked": { color: "#6366f1" } }} size="small" />}
                        label={<Typography variant="caption" sx={{ fontSize: "0.75rem", color: alpha("#ffffff", 0.7) }}>Thin</Typography>}
                      />
                      <FormControlLabel
                        value="400"
                        control={<Radio sx={{ color: alpha("#6366f1", 0.7), "&.Mui-checked": { color: "#6366f1" } }} size="small" />}
                        label={<Typography variant="caption" sx={{ fontSize: "0.75rem", color: alpha("#ffffff", 0.7) }}>Normal</Typography>}
                      />
                      <FormControlLabel
                        value="700"
                        control={<Radio sx={{ color: alpha("#6366f1", 0.7), "&.Mui-checked": { color: "#6366f1" } }} size="small" />}
                        label={<Typography variant="caption" sx={{ fontSize: "0.75rem", color: alpha("#ffffff", 0.7) }}>Bold</Typography>}
                      />
                    </RadioGroup>
                  </Box>
                )}
                {section.details.includes("fontSize") && (
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="caption" sx={{ minWidth: 80, color: alpha("#ffffff", 0.7), fontSize: "0.75rem" }}>
                      Size
                    </Typography>
                    <TextField
                      id="font-size"
                      type="number"
                      value={parseInt(String(properties.fontSize).replace("px", ""), 10) || 0}
                      onChange={(e) => handleChange("fontSize", `${e.target.value}px`)}
                      variant="outlined"
                      size={size}
                      sx={{
                        "& .MuiInputBase-input": { 
                          color: "#ffffff", 
                          fontSize: "0.8rem",
                          padding: "8px 12px",
                        },
                        "& .MuiOutlinedInput-root": {
                          transition: "all 0.2s ease",
                          "&:hover": {
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderColor: alpha("#6366f1", 0.5),
                            }
                          },
                          "&.Mui-focused": {
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#6366f1",
                              borderWidth: "2px",
                            }
                          }
                        },
                        "& .MuiOutlinedInput-notchedOutline": { 
                          borderColor: alpha("#6366f1", 0.3),
                          transition: "all 0.2s ease",
                        },
                        backgroundColor: alpha("#1e1e38", 0.5),
                        borderRadius: "6px",
                      }}
                    />
                  </Box>
                )}
                {section.details.includes("lineHeight") && (
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="caption" sx={{ minWidth: 80, color: alpha("#ffffff", 0.7), fontSize: "0.75rem" }}>
                      Height
                    </Typography>
                    <TextField
                      id="line-height"
                      type="number"
                      value={parseInt(String(properties.lineHeight).replace("px", ""), 10) || 0}
                      onChange={(e) => handleChange("lineHeight", `${e.target.value}px`)}
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
                      }}
                    />
                  </Box>
                )}
                {section.details.includes("color") && (
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="caption" sx={{ minWidth: 80, color: alpha("#ffffff", 0.7), fontSize: "0.75rem" }}>
                      Color
                    </Typography>
                    <TextField
                      id="text-color"
                      type="text"
                      value={properties.color || "#333"}
                      onChange={(e) => handleChange("color", e.target.value)}
                      variant="outlined"
                      size={size}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <input
                              type="color"
                              value={properties.color || "#333"}
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
                      }}
                    />
                  </Box>
                )}
                {section.details.includes("textAlign") && (
                  <Box>
                    <Typography variant="caption" sx={{ minWidth: 80, color: alpha("#ffffff", 0.7), fontSize: "0.75rem", mb: 0.5 }}>
                      Align
                    </Typography>
                    <RadioGroup
                      row
                      value={properties.textAlign || "center"}
                      onChange={(e) => handleChange("textAlign", e.target.value as "left" | "center" | "right")}
                      sx={{ color: "white", gap: 0.5 }}
                    >
                      <FormControlLabel
                        value="left"
                        control={<Radio sx={{ color: alpha("#6366f1", 0.7), "&.Mui-checked": { color: "#6366f1" } }} size="small" />}
                        label={<Typography variant="caption" sx={{ fontSize: "0.75rem", color: alpha("#ffffff", 0.7) }}>Left</Typography>}
                      />
                      <FormControlLabel
                        value="center"
                        control={<Radio sx={{ color: alpha("#6366f1", 0.7), "&.Mui-checked": { color: "#6366f1" } }} size="small" />}
                        label={<Typography variant="caption" sx={{ fontSize: "0.75rem", color: alpha("#ffffff", 0.7) }}>Center</Typography>}
                      />
                      <FormControlLabel
                        value="right"
                        control={<Radio sx={{ color: alpha("#6366f1", 0.7), "&.Mui-checked": { color: "#6366f1" } }} size="small" />}
                        label={<Typography variant="caption" sx={{ fontSize: "0.75rem", color: alpha("#ffffff", 0.7) }}>Right</Typography>}
                      />
                    </RadioGroup>
                  </Box>
                )}
                {section.details.includes("textDecoration") && (
                  <Box>
                    <Typography variant="caption" sx={{ minWidth: 80, color: alpha("#ffffff", 0.7), fontSize: "0.75rem", mb: 0.5 }}>
                      Decor
                    </Typography>
                    <RadioGroup
                      row
                      value={properties.textDecoration || "none"}
                      onChange={(e) => handleChange("textDecoration", e.target.value as "none" | "underline" | "overline" | "line-through")}
                      sx={{ color: "white", gap: 0.5 }}
                    >
                      <FormControlLabel
                        value="none"
                        control={<Radio sx={{ color: alpha("#6366f1", 0.7), "&.Mui-checked": { color: "#6366f1" } }} size="small" />}
                        label={<Typography variant="caption" sx={{ fontSize: "0.75rem", color: alpha("#ffffff", 0.7) }}>None</Typography>}
                      />
                      <FormControlLabel
                        value="underline"
                        control={<Radio sx={{ color: alpha("#6366f1", 0.7), "&.Mui-checked": { color: "#6366f1" } }} size="small" />}
                        label={<Typography variant="caption" sx={{ fontSize: "0.75rem", color: alpha("#ffffff", 0.7) }}>Underline</Typography>}
                      />
                      <FormControlLabel
                        value="overline"
                        control={<Radio sx={{ color: alpha("#6366f1", 0.7), "&.Mui-checked": { color: "#6366f1" } }} size="small" />}
                        label={<Typography variant="caption" sx={{ fontSize: "0.75rem", color: alpha("#ffffff", 0.7) }}>Overline</Typography>}
                      />
                      <FormControlLabel
                        value="line-through"
                        control={<Radio sx={{ color: alpha("#6366f1", 0.7), "&.Mui-checked": { color: "#6366f1" } }} size="small" />}
                        label={<Typography variant="caption" sx={{ fontSize: "0.75rem", color: alpha("#ffffff", 0.7) }}>Line-through</Typography>}
                      />
                    </RadioGroup>
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
                      value={properties.backgroundColor || "#3898ec"}
                      onChange={(e) => handleChange("backgroundColor", e.target.value)}
                      variant="outlined"
                      size={size}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <input
                              type="color"
                              value={properties.backgroundColor || "#3898ec"}
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
                      }}
                    />
                  </Box>
                )}
                {section.details.includes("borderRadius") && (
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="caption" sx={{ minWidth: 80, color: alpha("#ffffff", 0.7), fontSize: "0.75rem" }}>
                      Radius
                    </Typography>
                    <TextField
                      id="border-radius"
                      type="number"
                      value={parseInt(String(properties.borderRadius).replace("px", ""), 10) || 0}
                      onChange={(e) => handleChange("borderRadius", `${e.target.value}px`)}
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
                      }}
                    />
                  </Box>
                )}
                {section.details.includes("borderStyle") && (
                  <Box>
                    <Typography variant="caption" sx={{ minWidth: 80, color: alpha("#ffffff", 0.7), fontSize: "0.75rem", mb: 0.5 }}>
                      Style
                    </Typography>
                    <RadioGroup
                      row
                      value={properties.borderStyle || "solid"}
                      onChange={(e) => handleChange("borderStyle", e.target.value as "none" | "solid" | "dashed" | "dotted")}
                      sx={{ color: "white", gap: 0.5 }}
                    >
                      <FormControlLabel
                        value="none"
                        control={<Radio sx={{ color: alpha("#6366f1", 0.7), "&.Mui-checked": { color: "#6366f1" } }} size="small" />}
                        label={<Typography variant="caption" sx={{ fontSize: "0.75rem", color: alpha("#ffffff", 0.7) }}>None</Typography>}
                      />
                      <FormControlLabel
                        value="solid"
                        control={<Radio sx={{ color: alpha("#6366f1", 0.7), "&.Mui-checked": { color: "#6366f1" } }} size="small" />}
                        label={<Typography variant="caption" sx={{ fontSize: "0.75rem", color: alpha("#ffffff", 0.7) }}>Solid</Typography>}
                      />
                      <FormControlLabel
                        value="dashed"
                        control={<Radio sx={{ color: alpha("#6366f1", 0.7), "&.Mui-checked": { color: "#6366f1" } }} size="small" />}
                        label={<Typography variant="caption" sx={{ fontSize: "0.75rem", color: alpha("#ffffff", 0.7) }}>Dashed</Typography>}
                      />
                      <FormControlLabel
                        value="dotted"
                        control={<Radio sx={{ color: alpha("#6366f1", 0.7), "&.Mui-checked": { color: "#6366f1" } }} size="small" />}
                        label={<Typography variant="caption" sx={{ fontSize: "0.75rem", color: alpha("#ffffff", 0.7) }}>Dotted</Typography>}
                      />
                    </RadioGroup>
                  </Box>
                )}
                {section.details.includes("borderWidth") && (
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="caption" sx={{ minWidth: 80, color: alpha("#ffffff", 0.7), fontSize: "0.75rem" }}>
                      Width
                    </Typography>
                    <TextField
                      id="border-width"
                      type="number"
                      value={parseInt(String(properties.borderWidth).replace("px", ""), 10) || 0}
                      onChange={(e) => handleChange("borderWidth", `${e.target.value}px`)}
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
                      }}
                    />
                  </Box>
                )}
                {section.details.includes("borderColor") && (
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="caption" sx={{ minWidth: 80, color: alpha("#ffffff", 0.7), fontSize: "0.75rem" }}>
                      Color
                    </Typography>
                    <TextField
                      id="border-color"
                      type="text"
                      value={properties.borderColor || "black"}
                      onChange={(e) => handleChange("borderColor", e.target.value)}
                      variant="outlined"
                      size={size}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <input
                              type="color"
                              value={properties.borderColor || "black"}
                              onChange={(e) => handleChange("borderColor", e.target.value)}
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