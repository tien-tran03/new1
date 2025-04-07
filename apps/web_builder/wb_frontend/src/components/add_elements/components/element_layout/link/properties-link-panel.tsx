import React, { useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Paper,
  Typography,
  MenuItem,
  Select,
  InputAdornment,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { LinkPropertiesDefaults } from "./link-properties";
import { alpha } from "@mui/material/styles";
import SettingsIcon from "@mui/icons-material/Settings";

interface LinkPropertiesProps {
  properties: LinkPropertiesDefaults;
  onPropertyChange: (newProperties: Partial<LinkPropertiesDefaults>) => void;
  size?: "small";
}

export const LinkProperties: React.FC<LinkPropertiesProps> = ({ properties, onPropertyChange, size = "small" }) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const handleChange = <K extends keyof LinkPropertiesDefaults>(
    key: K,
    value: LinkPropertiesDefaults[K]
  ) => {
    onPropertyChange({ [key]: value });
  };

  const sections = [
    { id: "link", label: "Link", details: ["url", "text", "target"] },
    { id: "typography", label: "Typography", details: ["color", "fontFamily", "fontSize", "textDecoration"] },
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
      {/* Header của LinkProperties */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1, pb: 0.5, borderBottom: "1px solid rgba(99, 102, 241, 0.1)" }}>
        <SettingsIcon sx={{ color: "#6366f1", fontSize: "1rem" }} />
        <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: "0.85rem", color: alpha("#ffffff", 0.9) }}>
          Link Properties
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
                {section.details.includes("url") && (
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="caption" sx={{ minWidth: 80, color: alpha("#ffffff", 0.7), fontSize: "0.75rem" }}>
                      URL
                    </Typography>
                    <TextField
                      id="url"
                      type="text"
                      value={properties.url || ""}
                      onChange={(e) => handleChange("url", e.target.value)}
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
                {section.details.includes("text") && (
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="caption" sx={{ minWidth: 80, color: alpha("#ffffff", 0.7), fontSize: "0.75rem" }}>
                      Text
                    </Typography>
                    <TextField
                      id="text"
                      type="text"
                      value={properties.text || ""}
                      onChange={(e) => handleChange("text", e.target.value)}
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
                {section.details.includes("target") && (
                  <Box>
                    <Typography variant="caption" sx={{ minWidth: 80, color: alpha("#ffffff", 0.7), fontSize: "0.75rem", mb: 0.5 }}>
                      Target
                    </Typography>
                    <RadioGroup
                      row
                      value={properties.target || "_self"}
                      onChange={(e) => handleChange("target", e.target.value as "_self" | "_blank")}
                      sx={{ color: "white", gap: 0.5 }}
                    >
                      <FormControlLabel
                        value="_self"
                        control={<Radio sx={{ color: alpha("#6366f1", 0.7), "&.Mui-checked": { color: "#6366f1" } }} size="small" />}
                        label={<Typography variant="caption" sx={{ fontSize: "0.75rem", color: alpha("#ffffff", 0.7) }}>Same Tab</Typography>}
                      />
                      <FormControlLabel
                        value="_blank"
                        control={<Radio sx={{ color: alpha("#6366f1", 0.7), "&.Mui-checked": { color: "#6366f1" } }} size="small" />}
                        label={<Typography variant="caption" sx={{ fontSize: "0.75rem", color: alpha("#ffffff", 0.7) }}>New Tab</Typography>}
                      />
                    </RadioGroup>
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
                      value={properties.color || "#0000EE"}
                      onChange={(e) => handleChange("color", e.target.value)}
                      variant="outlined"
                      size={size}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <input
                              type="color"
                              value={properties.color || "#0000EE"}
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
                        minWidth: 120,
                      }}
                    >
                      <MenuItem value="Arial, sans-serif" sx={{ fontSize: "0.75rem", py: 0.5 }}>Arial</MenuItem>
                      <MenuItem value="Helvetica, sans-serif" sx={{ fontSize: "0.75rem", py: 0.5 }}>Helvetica</MenuItem>
                      <MenuItem value="Times New Roman, serif" sx={{ fontSize: "0.75rem", py: 0.5 }}>Times New Roman</MenuItem>
                    </Select>
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
                    <Typography variant="caption" sx={{ minWidth: 80, color: alpha("#ffffff", 0.7), fontSize: "0.75rem", mb: 0.5 }}>
                      Decoration
                    </Typography>
                    <RadioGroup
                      row
                      value={properties.textDecoration || "underline"}
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
              </Box>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Paper>
  );
};