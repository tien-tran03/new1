import React, { useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  TextField,
  Paper,
  Typography,
  InputAdornment,
  Slider,
  Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { ImagePropertiesDefaults } from "./image-properties";
import { alpha } from "@mui/material/styles";
import SettingsIcon from "@mui/icons-material/Settings";

interface ImagePropertiesProps {
  properties: ImagePropertiesDefaults;
  onPropertyChange: (newProperties: Partial<ImagePropertiesDefaults>) => void;
  size?: "small";
}

export const ImageProperties: React.FC<ImagePropertiesProps> = ({
  properties,
  onPropertyChange,
  size = "small",
}) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const handleChange = <K extends keyof ImagePropertiesDefaults>(key: K, value: ImagePropertiesDefaults[K]) => {
    onPropertyChange({ [key]: value });
  };

  const appendPxIfNumeric = (value: string) => {
    return /^\d+$/.test(value) ? `${value}px` : value;
  };

  const parsePxValue = (value: string) => {
    return parseInt(value.replace("px", ""), 10) || 0;
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        handleChange("src", reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const sections = [
    { id: "image", label: "Image", details: ["src", "alt"] },
    { id: "size", label: "Size", details: ["width", "height"] },
    { id: "spacing", label: "Spacing", details: ["padding", "margin"] },
    { id: "appearance", label: "Appearance", details: ["border", "backgroundColor"] },
  ];

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
      {/* Header của ImageProperties */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1, pb: 0.5, borderBottom: "1px solid rgba(99, 102, 241, 0.1)" }}>
        <SettingsIcon sx={{ color: "#6366f1", fontSize: "1rem" }} />
        <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: "0.85rem", color: alpha("#ffffff", 0.9) }}>
          Image Properties
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
                {/* Image Section */}
                {section.details.includes("src") && (
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="caption" sx={{ minWidth: 80, color: alpha("#ffffff", 0.7), fontSize: "0.75rem" }}>
                      Src
                    </Typography>
                    <TextField
                      value={properties.src || ""}
                      onChange={(e) => handleChange("src", e.target.value)}
                      variant="outlined"
                      size={size}
                      sx={{
                        "& .MuiInputBase-input": { color: "#ffffff", fontSize: "0.75rem" },
                        "& .MuiOutlinedInput-notchedOutline": { borderColor: alpha("#6366f1", 0.3) },
                        "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: alpha("#6366f1", 0.5) },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#6366f1" },
                        backgroundColor: alpha("#1e1e38", 0.5),
                        borderRadius: "4px",
                        flexGrow: 1,
                        height: "32px",
                      }}
                    />
                    <Button
                      variant="outlined"
                      component="label"
                      size="small"
                      sx={{
                        color: "#ffffff",
                        borderColor: alpha("#6366f1", 0.5),
                        fontSize: "0.75rem",
                        "&:hover": { borderColor: "#6366f1", bgcolor: alpha("#6366f1", 0.15) },
                      }}
                    >
                      Upload
                      <input type="file" accept="image/*" hidden onChange={handleImageUpload} />
                    </Button>
                  </Box>
                )}
                {section.details.includes("alt") && (
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="caption" sx={{ minWidth: 80, color: alpha("#ffffff", 0.7), fontSize: "0.75rem" }}>
                      Alt
                    </Typography>
                    <TextField
                      value={properties.alt || ""}
                      onChange={(e) => handleChange("alt", e.target.value)}
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

                {/* Size Section */}
                {section.details.includes("width") && (
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="caption" sx={{ minWidth: 80, color: alpha("#ffffff", 0.7), fontSize: "0.75rem" }}>
                      Width
                    </Typography>
                    <Slider
                      value={parsePxValue(properties.width)}
                      onChange={(_, value) => handleChange("width", `${value}px`)}
                      min={0}
                      max={500}
                      step={1}
                      valueLabelDisplay="auto"
                      size={size}
                      sx={{
                        color: "#6366f1",
                        "& .MuiSlider-thumb": { bgcolor: "#6366f1", width: 10, height: 10 },
                        "& .MuiSlider-track": { bgcolor: "#6366f1", height: 3 },
                        "& .MuiSlider-rail": { bgcolor: alpha("#6366f1", 0.3), height: 3 },
                        "& .MuiSlider-valueLabel": { fontSize: "0.75rem", bgcolor: alpha("#1e1e38", 0.9) },
                        width: 150,
                      }}
                    />
                  </Box>
                )}
                {section.details.includes("height") && (
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="caption" sx={{ minWidth: 80, color: alpha("#ffffff", 0.7), fontSize: "0.75rem" }}>
                      Height
                    </Typography>
                    <Slider
                      value={parsePxValue(properties.height)}
                      onChange={(_, value) => handleChange("height", `${value}px`)}
                      min={0}
                      max={500}
                      step={1}
                      valueLabelDisplay="auto"
                      size={size}
                      sx={{
                        color: "#6366f1",
                        "& .MuiSlider-thumb": { bgcolor: "#6366f1", width: 10, height: 10 },
                        "& .MuiSlider-track": { bgcolor: "#6366f1", height: 3 },
                        "& .MuiSlider-rail": { bgcolor: alpha("#6366f1", 0.3), height: 3 },
                        "& .MuiSlider-valueLabel": { fontSize: "0.75rem", bgcolor: alpha("#1e1e38", 0.9) },
                        width: 150,
                      }}
                    />
                  </Box>
                )}

                {/* Spacing Section */}
                {section.details.includes("padding") && (
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="caption" sx={{ minWidth: 80, color: alpha("#ffffff", 0.7), fontSize: "0.75rem" }}>
                      Padding
                    </Typography>
                    <Slider
                      value={parsePxValue(properties.padding)}
                      onChange={(_, value) => handleChange("padding", `${value}px`)}
                      min={0}
                      max={100}
                      step={1}
                      valueLabelDisplay="auto"
                      size={size}
                      sx={{
                        color: "#6366f1",
                        "& .MuiSlider-thumb": { bgcolor: "#6366f1", width: 10, height: 10 },
                        "& .MuiSlider-track": { bgcolor: "#6366f1", height: 3 },
                        "& .MuiSlider-rail": { bgcolor: alpha("#6366f1", 0.3), height: 3 },
                        "& .MuiSlider-valueLabel": { fontSize: "0.75rem", bgcolor: alpha("#1e1e38", 0.9) },
                        width: 150,
                      }}
                    />
                  </Box>
                )}
                {section.details.includes("margin") && (
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="caption" sx={{ minWidth: 80, color: alpha("#ffffff", 0.7), fontSize: "0.75rem" }}>
                      Margin
                    </Typography>
                    <Slider
                      value={parsePxValue(properties.margin)}
                      onChange={(_, value) => handleChange("margin", `${value}px`)}
                      min={0}
                      max={100}
                      step={1}
                      valueLabelDisplay="auto"
                      size={size}
                      sx={{
                        color: "#6366f1",
                        "& .MuiSlider-thumb": { bgcolor: "#6366f1", width: 10, height: 10 },
                        "& .MuiSlider-track": { bgcolor: "#6366f1", height: 3 },
                        "& .MuiSlider-rail": { bgcolor: alpha("#6366f1", 0.3), height: 3 },
                        "& .MuiSlider-valueLabel": { fontSize: "0.75rem", bgcolor: alpha("#1e1e38", 0.9) },
                        width: 150,
                      }}
                    />
                  </Box>
                )}

                {/* Appearance Section */}
                {section.details.includes("border") && (
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="caption" sx={{ minWidth: 80, color: alpha("#ffffff", 0.7), fontSize: "0.75rem" }}>
                      Border
                    </Typography>
                    <TextField
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
              </Box>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Paper>
  );
};