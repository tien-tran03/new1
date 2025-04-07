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
import { alpha } from "@mui/material/styles";
import SettingsIcon from "@mui/icons-material/Settings";
import { DropdownPropertiesDefaults } from "./dropdown_properties";

interface DropdownPropertiesProps {
  properties: DropdownPropertiesDefaults;
  onPropertyChange: (newProperties: Partial<DropdownPropertiesDefaults>) => void;
  size?: "small";
}

export const DropdownProperties: React.FC<DropdownPropertiesProps> = ({ properties, onPropertyChange, size = "small" }) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const handleChange = <K extends keyof DropdownPropertiesDefaults>(key: K, value: DropdownPropertiesDefaults[K]) => {
    onPropertyChange({ [key]: value });
  };

  const sections = [
    { id: "typography", label: "Typography", details: ["fontFamily", "fontWeight", "fontSize", "color", "placeholderColor"] },
    { id: "layout", label: "Layout", details: ["width", "padding"] },
    { id: "backgrounds", label: "Backgrounds", details: ["backgroundColor", "optionHoverColor"] },
    { id: "borders", label: "Borders", details: ["borderRadius", "borderStyle", "borderWidth", "borderColor"] },
    { id: "extras", label: "Extras", details: ["arrowColor"] },
  ];

  return (
    <Paper
      elevation={0}
      sx={{
        p: 1.5,
        bgcolor: alpha("#1e1e38", 0.3),
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
        <SettingsIcon
          sx={{
            color: "#6366f1",
            fontSize: "1.1rem",
            filter: "drop-shadow(0 0 2px rgba(99, 102, 241, 0.3))",
          }}
        />
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 600,
            fontSize: "0.9rem",
            color: alpha("#ffffff", 0.95),
            textShadow: "0 0 10px rgba(99, 102, 241, 0.3)",
          }}
        >
          Dropdown Properties
        </Typography>
      </Box>

      <Box sx={{ mt: 1, display: "flex", flexDirection: "column", gap: 1 }}>
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
              overflow: "hidden",
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
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {section.details.includes("fontFamily") && (
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="caption" sx={{ minWidth: 80, color: alpha("#ffffff", 0.7), fontSize: "0.75rem" }}>
                      Font
                    </Typography>
                    <Select
                      value={properties.fontFamily || "Helvetica, sans-serif"}
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
                      value={properties.fontWeight || "normal"}
                      onChange={(e) => handleChange("fontWeight", e.target.value as "normal" | "bold" | "lighter")}
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        gap: 1,
                        "& .MuiFormControlLabel-root": {
                          marginRight: 0,
                          "& .MuiRadio-root": {
                            padding: "4px",
                          },
                        },
                      }}
                    >
                      <FormControlLabel
                        value="lighter"
                        control={<Radio sx={{ color: alpha("#6366f1", 0.7), "&.Mui-checked": { color: "#6366f1" } }} size="small" />}
                        label={<Typography variant="caption" sx={{ fontSize: "0.75rem", color: alpha("#ffffff", 0.7) }}>Light</Typography>}
                      />
                      <FormControlLabel
                        value="normal"
                        control={<Radio sx={{ color: alpha("#6366f1", 0.7), "&.Mui-checked": { color: "#6366f1" } }} size="small" />}
                        label={<Typography variant="caption" sx={{ fontSize: "0.75rem", color: alpha("#ffffff", 0.7) }}>Normal</Typography>}
                      />
                      <FormControlLabel
                        value="bold"
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
                        "& .MuiInputBase-input": { color: "#ffffff", fontSize: "0.8rem", padding: "8px 12px" },
                        "& .MuiOutlinedInput-notchedOutline": { borderColor: alpha("#6366f1", 0.3) },
                        "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: alpha("#6366f1", 0.5) },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#6366f1" },
                        backgroundColor: alpha("#1e1e38", 0.5),
                        borderRadius: "6px",
                      }}
                    />
                  </Box>
                )}
                {section.details.includes("color") && (
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="caption" sx={{ minWidth: 80, color: alpha("#ffffff", 0.7), fontSize: "0.75rem" }}>
                      Text Color
                    </Typography>
                    <TextField
                      id="text-color"
                      type="text"
                      value={properties.color || "#000000"}
                      onChange={(e) => handleChange("color", e.target.value)}
                      variant="outlined"
                      size={size}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <input
                              type="color"
                              value={properties.color || "#000000"}
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
                {section.details.includes("placeholderColor") && (
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="caption" sx={{ minWidth: 80, color: alpha("#ffffff", 0.7), fontSize: "0.75rem" }}>
                      Placeholder
                    </Typography>
                    <TextField
                      id="placeholder-color"
                      type="text"
                      value={properties.placeholderColor || "#999999"}
                      onChange={(e) => handleChange("placeholderColor", e.target.value)}
                      variant="outlined"
                      size={size}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <input
                              type="color"
                              value={properties.placeholderColor || "#999999"}
                              onChange={(e) => handleChange("placeholderColor", e.target.value)}
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
                {section.details.includes("width") && (
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="caption" sx={{ minWidth: 80, color: alpha("#ffffff", 0.7), fontSize: "0.75rem" }}>
                      Width
                    </Typography>
                    <TextField
                      id="width"
                      type="number"
                      value={parseInt(String(properties.width).replace("px", ""), 10) || 0}
                      onChange={(e) => handleChange("width", `${e.target.value}px`)}
                      variant="outlined"
                      size={size}
                      sx={{
                        "& .MuiInputBase-input": { color: "#ffffff", fontSize: "0.8rem", padding: "8px 12px" },
                        "& .MuiOutlinedInput-notchedOutline": { borderColor: alpha("#6366f1", 0.3) },
                        "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: alpha("#6366f1", 0.5) },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#6366f1" },
                        backgroundColor: alpha("#1e1e38", 0.5),
                        borderRadius: "6px",
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
                      type="text"
                      value={properties.padding || "10px"}
                      onChange={(e) => handleChange("padding", e.target.value)}
                      variant="outlined"
                      size={size}
                      sx={{
                        "& .MuiInputBase-input": { color: "#ffffff", fontSize: "0.8rem", padding: "8px 12px" },
                        "& .MuiOutlinedInput-notchedOutline": { borderColor: alpha("#6366f1", 0.3) },
                        "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: alpha("#6366f1", 0.5) },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#6366f1" },
                        backgroundColor: alpha("#1e1e38", 0.5),
                        borderRadius: "6px",
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
                      }}
                    />
                  </Box>
                )}
                {section.details.includes("optionHoverColor") && (
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="caption" sx={{ minWidth: 80, color: alpha("#ffffff", 0.7), fontSize: "0.75rem" }}>
                      Hover Color
                    </Typography>
                    <TextField
                      id="option-hover-color"
                      type="text"
                      value={properties.optionHoverColor || "#e6f3ff"}
                      onChange={(e) => handleChange("optionHoverColor", e.target.value)}
                      variant="outlined"
                      size={size}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <input
                              type="color"
                              value={properties.optionHoverColor || "#e6f3ff"}
                              onChange={(e) => handleChange("optionHoverColor", e.target.value)}
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
                      Border Color
                    </Typography>
                    <TextField
                      id="border-color"
                      type="text"
                      value={properties.borderColor || "#d1d1d1"}
                      onChange={(e) => handleChange("borderColor", e.target.value)}
                      variant="outlined"
                      size={size}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <input
                              type="color"
                              value={properties.borderColor || "#d1d1d1"}
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
                {section.details.includes("arrowColor") && (
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="caption" sx={{ minWidth: 80, color: alpha("#ffffff", 0.7), fontSize: "0.75rem" }}>
                      Arrow Color
                    </Typography>
                    <TextField
                      id="arrow-color"
                      type="text"
                      value={properties.arrowColor || "#666666"}
                      onChange={(e) => handleChange("arrowColor", e.target.value)}
                      variant="outlined"
                      size={size}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <input
                              type="color"
                              value={properties.arrowColor || "#666666"}
                              onChange={(e) => handleChange("arrowColor", e.target.value)}
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