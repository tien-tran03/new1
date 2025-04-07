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
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { getHeadingPropertiesDefaults } from "./heading-properties";
import { alpha } from "@mui/material/styles";
import SettingsIcon from "@mui/icons-material/Settings";

interface HeadingPropertiesProps {
  properties: ReturnType<typeof getHeadingPropertiesDefaults>;
  onPropertyChange: (newProperties: Partial<ReturnType<typeof getHeadingPropertiesDefaults>>) => void;
  size?: "small";
}

export const HeadingProperties: React.FC<HeadingPropertiesProps> = ({ properties, onPropertyChange, size = "small" }) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const handleChange = <K extends keyof ReturnType<typeof getHeadingPropertiesDefaults>>(
    key: K,
    value: ReturnType<typeof getHeadingPropertiesDefaults>[K]
  ) => {
    onPropertyChange({ [key]: value });
  };

  const sections = [
    { id: "typography", label: "Typography", details: ["fontSize", "fontWeight", "textTransform", "textDecoration", "textAlign", "letterSpacing", "lineHeight"] },
    { id: "appearance", label: "Appearance", details: ["color", "textStroke"] },
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
        "&::-webkit-scrollbar": { display: "none" },
        scrollbarWidth: "none", 
      }}
    >
      {/* Header của HeadingProperties */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1, pb: 0.5, borderBottom: "1px solid rgba(99, 102, 241, 0.1)" }}>
        <SettingsIcon sx={{ color: "#6366f1", fontSize: "1rem" }} />
        <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: "0.85rem", color: alpha("#ffffff", 0.9) }}>
          Heading Properties
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
              "&:before": { display: "none" }, 
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
                {section.details.includes("fontSize") && (
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="caption" sx={{ minWidth: 80, color: alpha("#ffffff", 0.7), fontSize: "0.75rem" }}>
                      Font Size
                    </Typography>
                    <TextField
                      id="font-size"
                      type="number"
                      value={parseInt(String(properties.fontSize).replace("px", ""), 10) || 0}
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
                      }}
                    />
                  </Box>
                )}
                {section.details.includes("fontWeight") && (
                  <Box>
                    <Typography variant="caption" sx={{ minWidth: 80, color: alpha("#ffffff", 0.7), fontSize: "0.75rem", mb: 0.5 }}>
                      Font Weight
                    </Typography>
                    <RadioGroup
                      row
                      value={properties.fontWeight || "700"}
                      onChange={(e) => handleChange("fontWeight", e.target.value as "100" | "400" | "700")}
                      sx={{ color: "white", gap: 0.5 }}
                    >
                      <FormControlLabel
                        value="100"
                        control={<Radio sx={{ color: alpha("#6366f1", 0.7), "&.Mui-checked": { color: "#6366f1" } }} size="small" />}
                        label={<Typography variant="caption" sx={{ fontSize: "0.75rem", color: alpha("#ffffff", 0.7) }}>Thin</Typography>}
                      />
                      <FormControlLabel
                        value="400"
                        control={<Radio sx={{ color: alpha("#6366f1", 0.7), "&.Mui-checked": { color: "#6366f1" } }} size="small" />}
                        label={<Typography variant="caption" sx={{ fontSize: "0.75rem", color: alpha("#ffffff", 0.7) }}>Regular</Typography>}
                      />
                      <FormControlLabel
                        value="700"
                        control={<Radio sx={{ color: alpha("#6366f1", 0.7), "&.Mui-checked": { color: "#6366f1" } }} size="small" />}
                        label={<Typography variant="caption" sx={{ fontSize: "0.75rem", color: alpha("#ffffff", 0.7) }}>Bold</Typography>}
                      />
                    </RadioGroup>
                  </Box>
                )}
                {section.details.includes("textTransform") && (
                  <Box>
                    <Typography variant="caption" sx={{ minWidth: 80, color: alpha("#ffffff", 0.7), fontSize: "0.75rem", mb: 0.5 }}>
                      Text Transform
                    </Typography>
                    <RadioGroup
                      row
                      value={properties.textTransform || "capitalize"}
                      onChange={(e) => handleChange("textTransform", e.target.value as "capitalize" | "uppercase" | "lowercase" | "none")}
                      sx={{ color: "white", gap: 0.5 }}
                    >
                      <FormControlLabel
                        value="capitalize"
                        control={<Radio sx={{ color: alpha("#6366f1", 0.7), "&.Mui-checked": { color: "#6366f1" } }} size="small" />}
                        label={<Typography variant="caption" sx={{ fontSize: "0.75rem", color: alpha("#ffffff", 0.7) }}>Capitalize</Typography>}
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
                        value="none"
                        control={<Radio sx={{ color: alpha("#6366f1", 0.7), "&.Mui-checked": { color: "#6366f1" } }} size="small" />}
                        label={<Typography variant="caption" sx={{ fontSize: "0.75rem", color: alpha("#ffffff", 0.7) }}>None</Typography>}
                      />
                    </RadioGroup>
                  </Box>
                )}
                {section.details.includes("textDecoration") && (
                  <Box>
                    <Typography variant="caption" sx={{ minWidth: 80, color: alpha("#ffffff", 0.7), fontSize: "0.75rem", mb: 0.5 }}>
                      Text Decoration
                    </Typography>
                    <RadioGroup
                      row
                      value={properties.textDecoration || "underline"}
                      onChange={(e) => handleChange("textDecoration", e.target.value as "underline" | "overline" | "line-through" | "none")}
                      sx={{ color: "white", gap: 0.5 }}
                    >
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
                      <FormControlLabel
                        value="none"
                        control={<Radio sx={{ color: alpha("#6366f1", 0.7), "&.Mui-checked": { color: "#6366f1" } }} size="small" />}
                        label={<Typography variant="caption" sx={{ fontSize: "0.75rem", color: alpha("#ffffff", 0.7) }}>None</Typography>}
                      />
                    </RadioGroup>
                  </Box>
                )}
                {section.details.includes("textAlign") && (
                  <Box>
                    <Typography variant="caption" sx={{ minWidth: 80, color: alpha("#ffffff", 0.7), fontSize: "0.75rem", mb: 0.5 }}>
                      Text Align
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
                {section.details.includes("letterSpacing") && (
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="caption" sx={{ minWidth: 80, color: alpha("#ffffff", 0.7), fontSize: "0.75rem" }}>
                      Letter Spacing
                    </Typography>
                    <TextField
                      id="letter-spacing"
                      type="number"
                      value={parseInt(String(properties.letterSpacing).replace("px", ""), 10) || 0}
                      onChange={(e) => handleChange("letterSpacing", `${e.target.value}px`)}
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
                {section.details.includes("lineHeight") && (
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="caption" sx={{ minWidth: 80, color: alpha("#ffffff", 0.7), fontSize: "0.75rem" }}>
                      Line Height
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
                      Text Color
                    </Typography>
                    <TextField
                      type="text"
                      value={properties.color || "#FF0000"}
                      onChange={(e) => handleChange("color", e.target.value)}
                      variant="outlined"
                      size={size}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <input
                              type="color"
                              value={properties.color || "#FF0000"}
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
                {section.details.includes("textStroke") && (
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="caption" sx={{ minWidth: 80, color: alpha("#ffffff", 0.7), fontSize: "0.75rem" }}>
                      Text Stroke
                    </Typography>
                    <TextField
                      type="text"
                      value={properties.textStroke || "1px #333"}
                      onChange={(e) => handleChange("textStroke", e.target.value)}
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
              </Box>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Paper>
  );
};