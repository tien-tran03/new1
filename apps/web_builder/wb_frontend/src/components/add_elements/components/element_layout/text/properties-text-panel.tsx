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
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { TextDefaultProperties } from "./text-properties";
import { alpha } from "@mui/material/styles";
import SettingsIcon from "@mui/icons-material/Settings";

interface TextPropertiesProps {
  properties: TextDefaultProperties;
  onPropertyChange: (newProperties: Partial<TextDefaultProperties>) => void;
}

export const TextProperties: React.FC<TextPropertiesProps> = ({ properties, onPropertyChange }) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const handleChange = <K extends keyof TextDefaultProperties>(key: K, value: TextDefaultProperties[K]) => {
    onPropertyChange({ [key]: value });
  };

  const sections = [
    {
      id: "typography",
      label: "Typography",
      details: [
        "fontSize",
        "fontWeight",
        "fontFamily",
        "textAlign",
        "lineHeight",
        "letterSpacing",
        "textDecoration",
        "textTransform",
      ],
    },
    {
      id: "margin",
      label: "Margin",
      details: ["marginTopTypography", "marginRightTypography", "marginBottomTypography", "marginLeftTypography"],
    },
    {
      id: "padding",
      label: "Padding",
      details: ["paddingTop", "paddingRight", "paddingBottom", "paddingLeft"],
    },
    {
      id: "appearance",
      label: "Appearance",
      details: ["backgroundColorAppearance", "textColorAppearance", "boxShadowAppearance", "textShadow", "opacity"],
    },
  ];

  return (
    <Paper
      elevation={0}
      sx={{
        p: 1,
        bgcolor: "transparent",
        color: "white",
        maxHeight: "calc(100vh - 200px)",
        overflowY: "auto",
        "&::-webkit-scrollbar": { display: "none" }, // Ẩn thanh cuộn
        scrollbarWidth: "none", // Ẩn thanh cuộn trên Firefox
      }}
    >
      {/* Header của TextProperties */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1, pb: 0.5, borderBottom: "1px solid rgba(99, 102, 241, 0.1)" }}>
        <SettingsIcon sx={{ color: "#6366f1", fontSize: "1rem" }} />
        <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: "0.85rem", color: alpha("#ffffff", 0.9) }}>
          Text Properties
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
                {/* Typography */}
                {section.details.includes("fontSize") && (
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="caption" sx={{ minWidth: 100, color: alpha("#ffffff", 0.7), fontSize: "0.75rem" }}>
                      Font Size
                    </Typography>
                    <TextField
                      type="number"
                      value={parseInt(String(properties.fontSize) || "16", 10)}
                      onChange={(e) => handleChange("fontSize", `${e.target.value}px`)}
                      variant="outlined"
                      size="small"
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
                {section.details.includes("fontWeight") && (
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="caption" sx={{ minWidth: 100, color: alpha("#ffffff", 0.7), fontSize: "0.75rem" }}>
                      Font Weight
                    </Typography>
                    <RadioGroup
                      row
                      value={properties.fontWeight || "regular"}
                      onChange={(e) => handleChange("fontWeight", e.target.value as TextDefaultProperties["fontWeight"])}
                      sx={{ color: "white", gap: 0.5 }}
                    >
                      <FormControlLabel
                        value="regular"
                        control={<Radio sx={{ color: alpha("#6366f1", 0.7), "&.Mui-checked": { color: "#6366f1" } }} size="small" />}
                        label={<Typography variant="caption" sx={{ fontSize: "0.75rem", color: alpha("#ffffff", 0.7) }}>Regular</Typography>}
                      />
                      <FormControlLabel
                        value="medium"
                        control={<Radio sx={{ color: alpha("#6366f1", 0.7), "&.Mui-checked": { color: "#6366f1" } }} size="small" />}
                        label={<Typography variant="caption" sx={{ fontSize: "0.75rem", color: alpha("#ffffff", 0.7) }}>Medium</Typography>}
                      />
                      <FormControlLabel
                        value="bold"
                        control={<Radio sx={{ color: alpha("#6366f1", 0.7), "&.Mui-checked": { color: "#6366f1" } }} size="small" />}
                        label={<Typography variant="caption" sx={{ fontSize: "0.75rem", color: alpha("#ffffff", 0.7) }}>Bold</Typography>}
                      />
                    </RadioGroup>
                  </Box>
                )}
                {section.details.includes("fontFamily") && (
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="caption" sx={{ minWidth: 100, color: alpha("#ffffff", 0.7), fontSize: "0.75rem" }}>
                      Font Family
                    </Typography>
                    <TextField
                      value={properties.fontFamily || "Arial, sans-serif"}
                      onChange={(e) => handleChange("fontFamily", e.target.value)}
                      variant="outlined"
                      size="small"
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
                    <Typography variant="caption" sx={{ color: alpha("#ffffff", 0.7), fontSize: "0.75rem", mb: 0.5 }}>
                      Text Align
                    </Typography>
                    <RadioGroup
                      row
                      value={properties.textAlign || "left"}
                      onChange={(e) => handleChange("textAlign", e.target.value as TextDefaultProperties["textAlign"])}
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
                      <FormControlLabel
                        value="justify"
                        control={<Radio sx={{ color: alpha("#6366f1", 0.7), "&.Mui-checked": { color: "#6366f1" } }} size="small" />}
                        label={<Typography variant="caption" sx={{ fontSize: "0.75rem", color: alpha("#ffffff", 0.7) }}>Justify</Typography>}
                      />
                    </RadioGroup>
                  </Box>
                )}
                {section.details.includes("lineHeight") && (
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="caption" sx={{ minWidth: 100, color: alpha("#ffffff", 0.7), fontSize: "0.75rem" }}>
                      Line Height
                    </Typography>
                    <TextField
                      type="number"
                      value={parseFloat(String(properties.lineHeight) || "1.5")}
                      onChange={(e) => handleChange("lineHeight", parseFloat(e.target.value) || 1.5)}
                      variant="outlined"
                      size="small"
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
                {section.details.includes("letterSpacing") && (
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="caption" sx={{ minWidth: 100, color: alpha("#ffffff", 0.7), fontSize: "0.75rem" }}>
                      Letter Spacing
                    </Typography>
                    <TextField
                      type="number"
                      value={parseInt(String(properties.letterSpacing) || "0", 10)}
                      onChange={(e) => handleChange("letterSpacing", `${e.target.value}px`)}
                      variant="outlined"
                      size="small"
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
                {section.details.includes("textDecoration") && (
                  <Box>
                    <Typography variant="caption" sx={{ color: alpha("#ffffff", 0.7), fontSize: "0.75rem", mb: 0.5 }}>
                      Text Decoration
                    </Typography>
                    <RadioGroup
                      row
                      value={properties.textDecoration || "none"}
                      onChange={(e) => handleChange("textDecoration", e.target.value as TextDefaultProperties["textDecoration"])}
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
                        value="line-through"
                        control={<Radio sx={{ color: alpha("#6366f1", 0.7), "&.Mui-checked": { color: "#6366f1" } }} size="small" />}
                        label={<Typography variant="caption" sx={{ fontSize: "0.75rem", color: alpha("#ffffff", 0.7) }}>Line Through</Typography>}
                      />
                      <FormControlLabel
                        value="overline"
                        control={<Radio sx={{ color: alpha("#6366f1", 0.7), "&.Mui-checked": { color: "#6366f1" } }} size="small" />}
                        label={<Typography variant="caption" sx={{ fontSize: "0.75rem", color: alpha("#ffffff", 0.7) }}>Overline</Typography>}
                      />
                    </RadioGroup>
                  </Box>
                )}
                {section.details.includes("textTransform") && (
                  <Box>
                    <Typography variant="caption" sx={{ color: alpha("#ffffff", 0.7), fontSize: "0.75rem", mb: 0.5 }}>
                      Text Transform
                    </Typography>
                    <RadioGroup
                      row
                      value={properties.textTransform || "none"}
                      onChange={(e) => handleChange("textTransform", e.target.value as TextDefaultProperties["textTransform"])}
                      sx={{ color: "white", gap: 0.5 }}
                    >
                      <FormControlLabel
                        value="none"
                        control={<Radio sx={{ color: alpha("#6366f1", 0.7), "&.Mui-checked": { color: "#6366f1" } }} size="small" />}
                        label={<Typography variant="caption" sx={{ fontSize: "0.75rem", color: alpha("#ffffff", 0.7) }}>None</Typography>}
                      />
                      <FormControlLabel
                        value="uppercase"
                        control={<Radio sx={{ color: alpha("#6366f1", 0.7), "&.Mui-checked": { color: "#6366f1" } }} size="small" />}
                        label={<Typography variant="caption" sx={{ fontSize: "0.75rem", color: alpha("#ffffff", 0.7) }}>Uppercase</Typography>}
                      />
                      <FormControlLabel
                        value="lowercase"
                        control={<Radio sx={{ color: alpha("#6366f1", 0.7), "&.Mui-checked": { color: "#6366f1" } }} size="small" />}
                        label={<Typography variant="caption" sx={{ fontSize: "0.75rem", color: alpha("#ffffff", 0.7) }}>Lowercase</Typography>}
                      />
                      <FormControlLabel
                        value="capitalize"
                        control={<Radio sx={{ color: alpha("#6366f1", 0.7), "&.Mui-checked": { color: "#6366f1" } }} size="small" />}
                        label={<Typography variant="caption" sx={{ fontSize: "0.75rem", color: alpha("#ffffff", 0.7) }}>Capitalize</Typography>}
                      />
                    </RadioGroup>
                  </Box>
                )}

                {/* Margin */}
                {section.details.includes("marginTopTypography") && (
                  <Box>
                    <Typography variant="caption" sx={{ color: alpha("#ffffff", 0.7), fontSize: "0.75rem", mb: 0.5 }}>
                      Margin
                    </Typography>
                    <Box sx={{ display: "flex", gap: 0.5, mt: 0.25 }}>
                      {["Top", "Right", "Bottom", "Left"].map((pos) => {
                        const key = `margin${pos}Typography` as keyof TextDefaultProperties;
                        return (
                          <Box key={pos} sx={{ width: "25%" }}>
                            <Typography variant="caption" sx={{ fontSize: "0.75rem", color: alpha("#ffffff", 0.7) }}>
                              {pos}
                            </Typography>
                            <TextField
                              type="number"
                              value={parseInt(String(properties[key] || "0px").replace("px", ""), 10) || 0}
                              onChange={(e) => handleChange(key, `${e.target.value}px`)}
                              variant="outlined"
                              size="small"
                              sx={{
                                "& .MuiInputBase-input": {
                                  color: "#ffffff",
                                  fontSize: "0.65rem",
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
                                height: "28px",
                                width: "50px",
                              }}
                            />
                          </Box>
                        );
                      })}
                    </Box>
                  </Box>
                )}

                {/* Padding */}
                {section.details.includes("paddingTop") && (
                  <Box>
                    <Typography variant="caption" sx={{ color: alpha("#ffffff", 0.7), fontSize: "0.75rem", mb: 0.5 }}>
                      Padding
                    </Typography>
                    <Box sx={{ display: "flex", gap: 0.5, mt: 0.25 }}>
                      {["Top", "Right", "Bottom", "Left"].map((pos) => {
                        const key = `padding${pos}` as keyof TextDefaultProperties;
                        return (
                          <Box key={pos} sx={{ width: "25%" }}>
                            <Typography variant="caption" sx={{ fontSize: "0.75rem", color: alpha("#ffffff", 0.7) }}>
                              {pos}
                            </Typography>
                            <TextField
                              type="number"
                              value={parseInt(String(properties[key] || "0px").replace("px", ""), 10) || 0}
                              onChange={(e) => handleChange(key, `${e.target.value}px`)}
                              variant="outlined"
                              size="small"
                              sx={{
                                "& .MuiInputBase-input": {
                                  color: "#ffffff",
                                  fontSize: "0.65rem",
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
                                height: "28px",
                                width: "50px",
                              }}
                            />
                          </Box>
                        );
                      })}
                    </Box>
                  </Box>
                )}

                {/* Appearance */}
                {section.details.includes("backgroundColorAppearance") && (
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="caption" sx={{ minWidth: 100, color: alpha("#ffffff", 0.7), fontSize: "0.75rem" }}>
                      Background
                    </Typography>
                    <TextField
                      value={properties.backgroundColorAppearance || "rgba(255, 255, 255, 1)"}
                      onChange={(e) => handleChange("backgroundColorAppearance", e.target.value)}
                      variant="outlined"
                      size="small"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <input
                              type="color"
                              value={properties.backgroundColorAppearance || "#ffffff"}
                              onChange={(e) => handleChange("backgroundColorAppearance", e.target.value)}
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
                {section.details.includes("textColorAppearance") && (
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="caption" sx={{ minWidth: 100, color: alpha("#ffffff", 0.7), fontSize: "0.75rem" }}>
                      Text Color
                    </Typography>
                    <TextField
                      value={properties.textColorAppearance || "rgba(0, 0, 0, 1)"}
                      onChange={(e) => handleChange("textColorAppearance", e.target.value)}
                      variant="outlined"
                      size="small"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <input
                              type="color"
                              value={properties.textColorAppearance || "#000000"}
                              onChange={(e) => handleChange("textColorAppearance", e.target.value)}
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
                {section.details.includes("boxShadowAppearance") && (
                  <Box display="flex" flexDirection="column" gap={1}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography variant="caption" sx={{ minWidth: 100, color: alpha("#ffffff", 0.7), fontSize: "0.75rem" }}>
                        Box Shadow
                      </Typography>
                      <TextField
                        value={properties.boxShadowAppearance || "0px 4px 10px rgba(0,0,0,0.3)"}
                        onChange={(e) => handleChange("boxShadowAppearance", e.target.value)}
                        variant="outlined"
                        size="small"
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
                    {section.details.includes("opacity") && (
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography variant="caption" sx={{ minWidth: 100, color: alpha("#ffffff", 0.7), fontSize: "0.75rem" }}>
                          Opacity
                        </Typography>
                        <Slider
                          value={properties.opacity || 1}
                          onChange={(_, value) => handleChange("opacity", value as number)}
                          min={0}
                          max={1}
                          step={0.01}
                          valueLabelDisplay="auto"
                          size="small"
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
                  </Box>
                )}
                {section.details.includes("textShadow") && (
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="caption" sx={{ minWidth: 100, color: alpha("#ffffff", 0.7), fontSize: "0.75rem" }}>
                      Text Shadow
                    </Typography>
                    <TextField
                      value={properties.textShadow || "0px 0px 0px rgba(0,0,0,0)"}
                      onChange={(e) => handleChange("textShadow", e.target.value)}
                      variant="outlined"
                      size="small"
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