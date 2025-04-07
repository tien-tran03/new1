import React, { useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  TextField,
  Typography,
  InputAdornment,
  Button,
  MenuItem,
  Select,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { alpha } from "@mui/material/styles";
import SettingsIcon from "@mui/icons-material/Settings";
import UploadIcon from "@mui/icons-material/Upload";
import { DeviceMockupPropertiesDefaults, getDeviceMockupPropertiesDefaults } from "./main-element-properties";


interface DeviceMockupPropertiesProps extends DeviceMockupPropertiesDefaults {}

interface DeviceMockupPropertiesPanelProps {
  properties: DeviceMockupPropertiesProps;
  onPropertyChange: (newProperties: Partial<DeviceMockupPropertiesProps>) => void;
  size?: "small";
}

export const DeviceMockupProperties: React.FC<DeviceMockupPropertiesPanelProps> = ({
  properties,
  onPropertyChange,
  size = "small",
}) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const defaults = getDeviceMockupPropertiesDefaults(); 

  const handleChange = <K extends keyof DeviceMockupPropertiesProps>(
    key: K,
    value: DeviceMockupPropertiesProps[K]
  ) => {
    onPropertyChange({ [key]: value });
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      handleChange("backgroundImage", imageUrl);
    }
  };

  const sections = [
    { id: "layout", label: "Layout", details: ["width", "height", "padding", "gap"] },
    { id: "background", label: "Background", details: ["background", "backgroundImage"] },
    { id: "border", label: "Border", details: ["borderRadius", "borderStyle", "borderWidth", "borderColor", "boxShadow"] },
  ];

  return (
    <Box
      sx={{
        p: 1.5,
        bgcolor: alpha("#1e1e38", 0.3),
        color: "white",
        maxHeight: "calc(100vh - 150px)",
        overflowY: "auto",
        "&::-webkit-scrollbar": { width: "4px" },
        "&::-webkit-scrollbar-track": { background: "transparent" },
        "&::-webkit-scrollbar-thumb": { background: alpha("#6366f1", 0.3), borderRadius: "4px" },
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
        <SettingsIcon sx={{ color: "#6366f1", fontSize: "1.1rem", filter: "drop-shadow(0 0 2px rgba(99, 102, 241, 0.3))" }} />
        <Typography
          variant="subtitle2"
          sx={{ fontWeight: 600, fontSize: "0.9rem", color: alpha("#ffffff", 0.95), textShadow: "0 0 10px rgba(99, 102, 241, 0.3)" }}
        >
          Device Mockup Properties
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
              "&:hover": { bgcolor: alpha("#1e1e38", 0.7) },
              "& .MuiAccordionSummary-root": { minHeight: "42px" },
              overflow: "hidden",
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon sx={{ color: alpha("#ffffff", 0.7), fontSize: "1.1rem", transition: "transform 0.3s ease", transform: expandedSection === section.id ? "rotate(180deg)" : "rotate(0)" }} />}
              sx={{
                "& .MuiAccordionSummary-content": { my: 0.5, transition: "margin 0.3s ease" },
                "&:hover": { bgcolor: alpha("#6366f1", 0.15) },
                transition: "all 0.2s ease",
              }}
            >
              <Typography
                variant="caption"
                sx={{ fontSize: "0.8rem", fontWeight: 500, color: expandedSection === section.id ? "#6366f1" : alpha("#ffffff", 0.9), transition: "color 0.3s ease" }}
              >
                {section.label}
              </Typography>
            </AccordionSummary>

            <AccordionDetails sx={{ bgcolor: alpha("#1e1e38", 0.8), p: 2, borderRadius: "0 0 8px 8px", transition: "all 0.3s ease" }}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {section.details.includes("width") && (
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="caption" sx={{ minWidth: 80, color: alpha("#ffffff", 0.7), fontSize: "0.75rem" }}>Width</Typography>
                    <TextField
                      id="width"
                      type="number"
                      value={parseInt(String(properties.width).replace("px", ""), 10) || 0}
                      onChange={(e) => handleChange("width", `${e.target.value}px`)}
                      variant="outlined"
                      size={size}
                      sx={{ "& .MuiInputBase-input": { color: "#ffffff", fontSize: "0.8rem", padding: "8px 12px" }, "& .MuiOutlinedInput-notchedOutline": { borderColor: alpha("#6366f1", 0.3) }, "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: alpha("#6366f1", 0.5) }, "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#6366f1" }, backgroundColor: alpha("#1e1e38", 0.5), borderRadius: "6px" }}
                    />
                  </Box>
                )}
                {section.details.includes("height") && (
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="caption" sx={{ minWidth: 80, color: alpha("#ffffff", 0.7), fontSize: "0.75rem" }}>Height</Typography>
                    <TextField
                      id="height"
                      type="number"
                      value={parseInt(String(properties.height).replace("px", ""), 10) || 0}
                      onChange={(e) => handleChange("height", `${e.target.value}px`)}
                      variant="outlined"
                      size={size}
                      sx={{ "& .MuiInputBase-input": { color: "#ffffff", fontSize: "0.8rem", padding: "8px 12px" }, "& .MuiOutlinedInput-notchedOutline": { borderColor: alpha("#6366f1", 0.3) }, "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: alpha("#6366f1", 0.5) }, "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#6366f1" }, backgroundColor: alpha("#1e1e38", 0.5), borderRadius: "6px" }}
                    />
                  </Box>
                )}
                {section.details.includes("padding") && (
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="caption" sx={{ minWidth: 80, color: alpha("#ffffff", 0.7), fontSize: "0.75rem" }}>Padding</Typography>
                    <TextField
                      id="padding"
                      type="text"
                      value={properties.padding || defaults.padding}
                      onChange={(e) => handleChange("padding", e.target.value)}
                      variant="outlined"
                      size={size}
                      sx={{ "& .MuiInputBase-input": { color: "#ffffff", fontSize: "0.8rem", padding: "8px 12px" }, "& .MuiOutlinedInput-notchedOutline": { borderColor: alpha("#6366f1", 0.3) }, "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: alpha("#6366f1", 0.5) }, "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#6366f1" }, backgroundColor: alpha("#1e1e38", 0.5), borderRadius: "6px" }}
                    />
                  </Box>
                )}
                {section.details.includes("gap") && (
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="caption" sx={{ minWidth: 80, color: alpha("#ffffff", 0.7), fontSize: "0.75rem" }}>Gap</Typography>
                    <TextField
                      id="gap"
                      type="number"
                      value={parseInt(String(properties.gap).replace("px", ""), 10) || 0}
                      onChange={(e) => handleChange("gap", `${e.target.value}px`)}
                      variant="outlined"
                      size={size}
                      sx={{ "& .MuiInputBase-input": { color: "#ffffff", fontSize: "0.8rem", padding: "8px 12px" }, "& .MuiOutlinedInput-notchedOutline": { borderColor: alpha("#6366f1", 0.3) }, "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: alpha("#6366f1", 0.5) }, "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#6366f1" }, backgroundColor: alpha("#1e1e38", 0.5), borderRadius: "6px" }}
                    />
                  </Box>
                )}
                {section.details.includes("background") && (
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="caption" sx={{ minWidth: 80, color: alpha("#ffffff", 0.7), fontSize: "0.75rem" }}>Background Color</Typography>
                    <TextField
                      id="background"
                      type="text"
                      value={properties.background || defaults.background}
                      onChange={(e) => handleChange("background", e.target.value)}
                      variant="outlined"
                      size={size}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <input
                              type="color"
                              value={properties.background?.includes("linear-gradient") ? "#f3f4f6" : properties.background || defaults.background}
                              onChange={(e) => handleChange("background", e.target.value)}
                              style={{ width: "20px", height: "20px", border: "none", background: "none", cursor: "pointer" }}
                            />
                          </InputAdornment>
                        ),
                      }}
                      sx={{ "& .MuiInputBase-input": { color: "#ffffff", fontSize: "0.75rem" }, "& .MuiOutlinedInput-notchedOutline": { borderColor: alpha("#6366f1", 0.3) }, "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: alpha("#6366f1", 0.5) }, "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#6366f1" }, backgroundColor: alpha("#1e1e38", 0.5), borderRadius: "4px", height: "32px" }}
                    />
                  </Box>
                )}
                {section.details.includes("backgroundImage") && (
                  <Box display="flex" flexDirection="column" gap={1}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography variant="caption" sx={{ minWidth: 80, color: alpha("#ffffff", 0.7), fontSize: "0.75rem" }}>Background Image</Typography>
                      <TextField
                        id="backgroundImage"
                        type="text"
                        value={properties.backgroundImage || defaults.backgroundImage}
                        onChange={(e) => handleChange("backgroundImage", e.target.value)}
                        placeholder="Enter image URL"
                        variant="outlined"
                        size={size}
                        sx={{ "& .MuiInputBase-input": { color: "#ffffff", fontSize: "0.75rem" }, "& .MuiOutlinedInput-notchedOutline": { borderColor: alpha("#6366f1", 0.3) }, "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: alpha("#6366f1", 0.5) }, "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#6366f1" }, backgroundColor: alpha("#1e1e38", 0.5), borderRadius: "4px", height: "32px", flexGrow: 1 }}
                      />
                    </Box>
                    <Button
                      variant="contained"
                      component="label"
                      startIcon={<UploadIcon />}
                      sx={{ bgcolor: alpha("#6366f1", 0.8), "&:hover": { bgcolor: "#6366f1" }, fontSize: "0.75rem", padding: "4px 12px", borderRadius: "4px", textTransform: "none" }}
                    >
                      Upload Image
                      <input type="file" accept="image/*" hidden onChange={handleImageUpload} />
                    </Button>
                  </Box>
                )}
                {section.details.includes("borderRadius") && (
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="caption" sx={{ minWidth: 80, color: alpha("#ffffff", 0.7), fontSize: "0.75rem" }}>Border Radius</Typography>
                    <TextField
                      id="borderRadius"
                      type="text"
                      value={properties.borderRadius || defaults.borderRadius}
                      onChange={(e) => handleChange("borderRadius", e.target.value)}
                      variant="outlined"
                      size={size}
                      sx={{ "& .MuiInputBase-input": { color: "#ffffff", fontSize: "0.8rem", padding: "8px 12px" }, "& .MuiOutlinedInput-notchedOutline": { borderColor: alpha("#6366f1", 0.3) }, "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: alpha("#6366f1", 0.5) }, "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#6366f1" }, backgroundColor: alpha("#1e1e38", 0.5), borderRadius: "6px" }}
                    />
                  </Box>
                )}
                {section.details.includes("borderStyle") && (
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="caption" sx={{ minWidth: 80, color: alpha("#ffffff", 0.7), fontSize: "0.75rem" }}>Border Style</Typography>
                    <Select
                      id="borderStyle"
                      value={properties.borderStyle || defaults.borderStyle}
                      onChange={(e) => handleChange("borderStyle", e.target.value as "none" | "solid" | "dashed" | "dotted")}
                      variant="outlined"
                      size={size}
                      sx={{ color: "#ffffff", fontSize: "0.8rem", backgroundColor: alpha("#1e1e38", 0.5), borderRadius: "6px", "& .MuiOutlinedInput-notchedOutline": { borderColor: alpha("#6366f1", 0.3) }, "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: alpha("#6366f1", 0.5) }, "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#6366f1" } }}
                    >
                      <MenuItem value="none">None</MenuItem>
                      <MenuItem value="solid">Solid</MenuItem>
                      <MenuItem value="dashed">Dashed</MenuItem>
                      <MenuItem value="dotted">Dotted</MenuItem>
                    </Select>
                  </Box>
                )}
                {section.details.includes("borderWidth") && (
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="caption" sx={{ minWidth: 80, color: alpha("#ffffff", 0.7), fontSize: "0.75rem" }}>Border Width</Typography>
                    <TextField
                      id="borderWidth"
                      type="text"
                      value={properties.borderWidth || defaults.borderWidth}
                      onChange={(e) => handleChange("borderWidth", e.target.value)}
                      variant="outlined"
                      size={size}
                      sx={{ "& .MuiInputBase-input": { color: "#ffffff", fontSize: "0.8rem", padding: "8px 12px" }, "& .MuiOutlinedInput-notchedOutline": { borderColor: alpha("#6366f1", 0.3) }, "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: alpha("#6366f1", 0.5) }, "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#6366f1" }, backgroundColor: alpha("#1e1e38", 0.5), borderRadius: "6px" }}
                    />
                  </Box>
                )}
                {section.details.includes("borderColor") && (
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="caption" sx={{ minWidth: 80, color: alpha("#ffffff", 0.7), fontSize: "0.75rem" }}>Border Color</Typography>
                    <TextField
                      id="borderColor"
                      type="text"
                      value={properties.borderColor || defaults.borderColor}
                      onChange={(e) => handleChange("borderColor", e.target.value)}
                      variant="outlined"
                      size={size}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <input
                              type="color"
                              value={properties.borderColor || defaults.borderColor}
                              onChange={(e) => handleChange("borderColor", e.target.value)}
                              style={{ width: "20px", height: "20px", border: "none", background: "none", cursor: "pointer" }}
                            />
                          </InputAdornment>
                        ),
                      }}
                      sx={{ "& .MuiInputBase-input": { color: "#ffffff", fontSize: "0.75rem" }, "& .MuiOutlinedInput-notchedOutline": { borderColor: alpha("#6366f1", 0.3) }, "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: alpha("#6366f1", 0.5) }, "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#6366f1" }, backgroundColor: alpha("#1e1e38", 0.5), borderRadius: "4px", height: "32px" }}
                    />
                  </Box>
                )}
                {section.details.includes("boxShadow") && (
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="caption" sx={{ minWidth: 80, color: alpha("#ffffff", 0.7), fontSize: "0.75rem" }}>Box Shadow</Typography>
                    <TextField
                      id="boxShadow"
                      type="text"
                      value={properties.boxShadow || defaults.boxShadow}
                      onChange={(e) => handleChange("boxShadow", e.target.value)}
                      variant="outlined"
                      size={size}
                      sx={{ "& .MuiInputBase-input": { color: "#ffffff", fontSize: "0.8rem", padding: "8px 12px" }, "& .MuiOutlinedInput-notchedOutline": { borderColor: alpha("#6366f1", 0.3) }, "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: alpha("#6366f1", 0.5) }, "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#6366f1" }, backgroundColor: alpha("#1e1e38", 0.5), borderRadius: "6px" }}
                    />
                  </Box>
                )}
              </Box>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Box>
  );
};