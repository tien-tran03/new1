import React, { useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  TextField,
  Slider,
  RadioGroup,
  FormControlLabel,
  Radio,
  Paper,
  InputAdornment,
  Tooltip,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { DefaultContainerProperties } from "./container-properties";
import { alpha } from "@mui/material/styles";
import TuneIcon from "@mui/icons-material/Tune";
import FormatColorFillIcon from "@mui/icons-material/FormatColorFill";
import BorderStyleIcon from "@mui/icons-material/BorderStyle";
import AspectRatioIcon from "@mui/icons-material/AspectRatio";
import SpaceBarIcon from "@mui/icons-material/SpaceBar";
import VisibilityIcon from "@mui/icons-material/Visibility";

interface ContainerPropertiesProps {
  properties: DefaultContainerProperties;
  onPropertyChange: (newProperties: Partial<DefaultContainerProperties>) => void;
  size?: "small";
}

export const ContainerProperties: React.FC<ContainerPropertiesProps> = ({
  properties,
  onPropertyChange,
  size = "small",
}) => {
  const [expandedSection, setExpandedSection] = useState<string | null>("dimensions");

  const handleChange = (key: keyof DefaultContainerProperties, value: any) => {
    onPropertyChange({ [key]: value });
  };

  const sections = [
    { id: "dimensions", label: "Dimensions", icon: <AspectRatioIcon />, details: ["width", "height", "maxWidth", "maxHeight", "minWidth", "minHeight"] },
    { id: "colors", label: "Colors", icon: <FormatColorFillIcon />, details: ["backgroundColor", "textColor", "opacity"] },
    { id: "margin", label: "Margin", icon: <SpaceBarIcon />, details: ["marginTop", "marginRight", "marginBottom", "marginLeft"] },
    { id: "padding", label: "Padding", icon: <SpaceBarIcon />, details: ["paddingTop", "paddingRight", "paddingBottom", "paddingLeft"] },
    { id: "decoration", label: "Decoration", icon: <BorderStyleIcon />, details: ["borderColor", "borderWidth", "borderRadius", "borderStyle", "boxShadow"] },
    { id: "overflow", label: "Overflow", icon: <VisibilityIcon />, details: ["overflow"] },
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
          "&:hover": { backgroundColor: alpha("#6366f1", 0.5) }
        },
        borderRadius: "8px",
        boxShadow: `0 4px 20px ${alpha("#000", 0.2)}`,
      }}
    >
      <Box sx={{ 
        display: "flex", 
        alignItems: "center", 
        gap: 1, 
        mb: 2, 
        pb: 1, 
        borderBottom: `1px solid ${alpha("#6366f1", 0.2)}` 
      }}>
        <TuneIcon sx={{ color: "#6366f1", fontSize: "1.2rem" }} />
        <Typography variant="subtitle1" sx={{ fontWeight: 600, fontSize: "0.9rem", color: alpha("#ffffff", 0.95) }}>
          Container Properties
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
                <Box sx={{ 
                  color: "#6366f1", 
                  display: "flex", 
                  alignItems: "center", 
                  fontSize: "0.9rem" 
                }}>
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
                {section.details.includes("width") && (
                  <Box display="flex" alignItems="center" gap={1.5}>
                    <Typography variant="caption" sx={{ minWidth: 80, color: alpha("#ffffff", 0.8), fontSize: "0.75rem" }}>
                      Width
                    </Typography>
                    <TextField
                      type="number"
                      value={parseInt(String(properties.width || "0px").replace("px", ""), 10) || 0}
                      onChange={(e) => handleChange("width", `${e.target.value}px`)}
                      variant="outlined"
                      size={size}
                      sx={textFieldStyle}
                    />
                  </Box>
                )}
                {section.details.includes("height") && (
                  <Box display="flex" alignItems="center" gap={1.5}>
                    <Typography variant="caption" sx={{ minWidth: 80, color: alpha("#ffffff", 0.8), fontSize: "0.75rem" }}>
                      Height
                    </Typography>
                    <TextField
                      type="number"
                      value={parseInt(properties.height || "0", 10)}
                      onChange={(e) => handleChange("height", `${e.target.value}px`)}
                      variant="outlined"
                      size={size}
                      sx={textFieldStyle}
                    />
                  </Box>
                )}

                {section.details.includes("backgroundColor") && (
                  <Box display="flex" alignItems="center" gap={1.5}>
                    <Typography variant="caption" sx={{ minWidth: 80, color: alpha("#ffffff", 0.8), fontSize: "0.75rem" }}>
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
                            <Tooltip title="Choose color">
                              <input
                                type="color"
                                value={properties.backgroundColor || "#ffffff"}
                                onChange={(e) => handleChange("backgroundColor", e.target.value)}
                                style={{ 
                                  width: "22px", 
                                  height: "22px", 
                                  border: "none", 
                                  background: "none", 
                                  cursor: "pointer",
                                  borderRadius: "4px"
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
                {section.details.includes("textColor") && (
                  <Box display="flex" alignItems="center" gap={1.5}>
                    <Typography variant="caption" sx={{ minWidth: 80, color: alpha("#ffffff", 0.8), fontSize: "0.75rem" }}>
                      Text Color
                    </Typography>
                    <TextField
                      value={properties.textColor || "#000000"}
                      onChange={(e) => handleChange("textColor", e.target.value)}
                      variant="outlined"
                      size={size}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Tooltip title="Choose color">
                              <input
                                type="color"
                                value={properties.textColor || "#000000"}
                                onChange={(e) => handleChange("textColor", e.target.value)}
                                style={{ 
                                  width: "22px", 
                                  height: "22px", 
                                  border: "none", 
                                  background: "none", 
                                  cursor: "pointer",
                                  borderRadius: "4px"
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
                {section.details.includes("opacity") && (
                  <Box display="flex" alignItems="center" gap={1.5}>
                    <Typography variant="caption" sx={{ minWidth: 80, color: alpha("#ffffff", 0.8), fontSize: "0.75rem" }}>
                      Opacity
                    </Typography>
                    <Slider
                      value={properties.opacity || 1}
                      onChange={(_, value) => handleChange("opacity", value as number)}
                      min={0}
                      max={1}
                      step={0.01}
                      valueLabelDisplay="auto"
                      size={size}
                      sx={{
                        color: "#6366f1",
                        "& .MuiSlider-thumb": { 
                          bgcolor: "#ffffff", 
                          width: 14, 
                          height: 14,
                          border: "2px solid #6366f1",
                          boxShadow: `0 0 0 4px ${alpha("#6366f1", 0.2)}`
                        },
                        "& .MuiSlider-track": { bgcolor: "#6366f1", height: 4 },
                        "& .MuiSlider-rail": { bgcolor: alpha("#6366f1", 0.3), height: 4 },
                        "& .MuiSlider-valueLabel": { 
                          fontSize: "0.75rem", 
                          bgcolor: alpha("#1e1e38", 0.9),
                          borderRadius: "4px",
                          boxShadow: `0 2px 8px ${alpha("#000", 0.2)}`
                        },
                        width: 150,
                      }}
                    />
                  </Box>
                )}
                {section.details.includes("marginTop") && (
                  <Box>
                    <Typography variant="caption" sx={{ color: alpha("#ffffff", 0.8), fontSize: "0.75rem", mb: 0.5, display: "block" }}>
                      Margin
                    </Typography>
                    <Box sx={{ display: "flex", gap: 0.8, mt: 0.5 }}>
                      {["Top", "Right", "Bottom", "Left"].map((pos) => {
                        const key = `margin${pos}` as keyof DefaultContainerProperties;
                        return (
                          <Box key={pos} sx={{ width: "25%" }}>
                            <Typography variant="caption" sx={{ fontSize: "0.7rem", color: alpha("#ffffff", 0.7), display: "block", mb: 0.3 }}>
                              {pos}
                            </Typography>
                            <TextField
                              type="number"
                              value={parseInt(String(properties[key] || "0px").replace("px", ""), 10)}
                              onChange={(e) => handleChange(key, `${e.target.value}px`)}
                              variant="outlined"
                              size="small"
                              sx={textFieldStyle}
                            />
                          </Box>
                        );
                      })}
                    </Box>
                  </Box>
                )}


                {section.details.includes("paddingTop") && (
                  <Box>
                    <Typography variant="caption" sx={{ color: alpha("#ffffff", 0.8), fontSize: "0.75rem", mb: 0.5, display: "block" }}>
                      Padding
                    </Typography>
                    <Box sx={{ display: "flex", gap: 0.8, mt: 0.5 }}>
                      {["Top", "Right", "Bottom", "Left"].map((pos) => {
                        const key = `padding${pos}` as keyof DefaultContainerProperties;
                        return (
                          <Box key={pos} sx={{ width: "25%" }}>
                            <Typography variant="caption" sx={{ fontSize: "0.7rem", color: alpha("#ffffff", 0.7), display: "block", mb: 0.3 }}>
                              {pos}
                            </Typography>
                            <TextField
                              type="number"
                              value={parseInt(String(properties[key] || "0px").replace("px", ""), 10) || 0}
                              onChange={(e) => handleChange(key, `${e.target.value}px`)}
                              variant="outlined"
                              size="small"
                              sx={textFieldStyle}
                            />
                          </Box>
                        );
                      })}
                    </Box>
                  </Box>
                )}

                {/* Decoration */}
                {section.details.includes("borderColor") && (
                  <Box display="flex" alignItems="center" gap={1.5}>
                    <Typography variant="caption" sx={{ minWidth: 80, color: alpha("#ffffff", 0.8), fontSize: "0.75rem" }}>
                      Border Color
                    </Typography>
                    <TextField
                      value={properties.borderColor || "#000000"}
                      onChange={(e) => handleChange("borderColor", e.target.value)}
                      variant="outlined"
                      size={size}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Tooltip title="Choose color">
                              <input
                                type="color"
                                value={properties.borderColor || "#000000"}
                                onChange={(e) => handleChange("borderColor", e.target.value)}
                                style={{ 
                                  width: "22px", 
                                  height: "22px", 
                                  border: "none", 
                                  background: "none", 
                                  cursor: "pointer",
                                  borderRadius: "4px"
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
                                  padding: "4px"
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
                {section.details.includes("boxShadow") && (
                  <Box display="flex" flexDirection="column" gap={1}>
                    <Box display="flex" alignItems="center" gap={1.5}>
                      <Typography variant="caption" sx={{ minWidth: 80, color: alpha("#ffffff", 0.8), fontSize: "0.75rem" }}>
                        Box Shadow
                      </Typography>
                      <TextField
                        value={properties.boxShadow || ""}
                        onChange={(e) => handleChange("boxShadow", e.target.value)}
                        variant="outlined"
                        size={size}
                        placeholder="0px 4px 8px rgba(0,0,0,0.2)"
                        sx={textFieldStyle}
                      />
                    </Box>
                  </Box>
                )}

                {/* Overflow */}
                {section.details.includes("overflow") && (
                  <Box>
                    <Typography variant="caption" sx={{ color: alpha("#ffffff", 0.8), fontSize: "0.75rem", mb: 0.8, display: "block" }}>
                      Overflow
                    </Typography>
                    <RadioGroup
                      row
                      value={properties.overflow || "visible"}
                      onChange={(e) => handleChange("overflow", e.target.value)}
                      sx={{ color: "white", gap: 1 }}
                    >
                      {["visible", "hidden", "scroll", "auto"].map((overflow) => (
                        <Tooltip key={overflow} title={overflow.charAt(0).toUpperCase() + overflow.slice(1)}>
                          <FormControlLabel
                            value={overflow}
                            control={
                              <Radio 
                                sx={{ 
                                  color: alpha("#6366f1", 0.7), 
                                  "&.Mui-checked": { color: "#6366f1" },
                                  padding: "4px"
                                }} 
                                size="small" 
                              />
                            }
                            label={
                              <Typography variant="caption" sx={{ fontSize: "0.75rem", color: alpha("#ffffff", 0.8) }}>
                                {overflow.charAt(0).toUpperCase() + overflow.slice(1)}
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