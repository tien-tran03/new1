import React, { useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  TextField,
  Checkbox,
  FormControlLabel,
  Paper,
  Typography,
  InputAdornment,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { VideoPlayerPropertiesDefaults } from "./videoplayer-properties";
import { alpha } from "@mui/material/styles";
import SettingsIcon from "@mui/icons-material/Settings";

interface VideoPlayerPropertiesProps {
  properties: VideoPlayerPropertiesDefaults;
  onPropertyChange: (newProperties: Partial<VideoPlayerPropertiesDefaults>) => void;
  size?: "small";
}

export const VideoPlayerProperties: React.FC<VideoPlayerPropertiesProps> = ({ properties, onPropertyChange, size = "small" }) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const handleChange = <K extends keyof VideoPlayerPropertiesDefaults>(
    key: K,
    value: VideoPlayerPropertiesDefaults[K]
  ) => {
    onPropertyChange({ [key]: value });
  };

  const isYouTube = properties.src.includes("youtube.com/embed") || properties.src.includes("youtu.be");

  const sections = [
    {
      id: "video",
      label: "Video",
      details: [
        "src",
        "width",
        "height",
        ...(isYouTube
          ? ["start", "end", "showRelated"]
          : ["controls", "autoplay", "loop", "muted", "poster", "playbackRate"]),
      ],
    },
    { id: "appearance", label: "Appearance", details: ["padding", "margin", "backgroundColor", "border"] },
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
        "&::-webkit-scrollbar": { display: "none" },
        scrollbarWidth: "none",
      }}
    >
      {/* Header của VideoPlayerProperties */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1, pb: 0.5, borderBottom: "1px solid rgba(99, 102, 241, 0.1)" }}>
        <SettingsIcon sx={{ color: "#6366f1", fontSize: "1rem" }} />
        <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: "0.85rem", color: alpha("#ffffff", 0.9) }}>
          Video Player Properties
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
                {section.details.includes("src") && (
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="caption" sx={{ minWidth: 80, color: alpha("#ffffff", 0.7), fontSize: "0.75rem" }}>
                      Src
                    </Typography>
                    <TextField
                      type="text"
                      value={properties.src || ""}
                      onChange={(e) => handleChange("src", e.target.value)}
                      variant="outlined"
                      size={size}
                      placeholder="YouTube or video URL"
                      sx={{
                        "& .MuiInputBase-input": { color: "#ffffff", fontSize: "0.75rem" },
                        "& .MuiOutlinedInput-notchedOutline": { borderColor: alpha("#6366f1", 0.3) },
                        "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: alpha("#6366f1", 0.5) },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#6366f1" },
                        backgroundColor: alpha("#1e1e38", 0.5),
                        borderRadius: "4px",
                        height: "32px",
                        flex: 1,
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
                      type="number"
                      value={parsePxValue(properties.width || "0px")}
                      onChange={(e) => handleChange("width", `${e.target.value}px`)}
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
                {section.details.includes("height") && (
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="caption" sx={{ minWidth: 80, color: alpha("#ffffff", 0.7), fontSize: "0.75rem" }}>
                      Height
                    </Typography>
                    <TextField
                      type="number"
                      value={parsePxValue(properties.height || "0px")}
                      onChange={(e) => handleChange("height", `${e.target.value}px`)}
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
                {!isYouTube && section.details.includes("controls") && (
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="caption" sx={{ minWidth: 80, color: alpha("#ffffff", 0.7), fontSize: "0.75rem" }}>
                      Controls
                    </Typography>
                    <Checkbox
                      checked={properties.controls || false}
                      onChange={(e) => handleChange("controls", e.target.checked)}
                      sx={{
                        color: alpha("#6366f1", 0.7),
                        "&.Mui-checked": { color: "#6366f1" },
                        p: 0,
                      }}
                      size="small"
                    />
                  </Box>
                )}
                {!isYouTube && section.details.includes("autoplay") && (
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="caption" sx={{ minWidth: 80, color: alpha("#ffffff", 0.7), fontSize: "0.75rem" }}>
                      Autoplay
                    </Typography>
                    <Checkbox
                      checked={properties.autoplay || false}
                      onChange={(e) => handleChange("autoplay", e.target.checked)}
                      sx={{
                        color: alpha("#6366f1", 0.7),
                        "&.Mui-checked": { color: "#6366f1" },
                        p: 0,
                      }}
                      size="small"
                    />
                  </Box>
                )}
                {!isYouTube && section.details.includes("loop") && (
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="caption" sx={{ minWidth: 80, color: alpha("#ffffff", 0.7), fontSize: "0.75rem" }}>
                      Loop
                    </Typography>
                    <Checkbox
                      checked={properties.loop || false}
                      onChange={(e) => handleChange("loop", e.target.checked)}
                      sx={{
                        color: alpha("#6366f1", 0.7),
                        "&.Mui-checked": { color: "#6366f1" },
                        p: 0,
                      }}
                      size="small"
                    />
                  </Box>
                )}
                {!isYouTube && section.details.includes("muted") && (
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="caption" sx={{ minWidth: 80, color: alpha("#ffffff", 0.7), fontSize: "0.75rem" }}>
                      Muted
                    </Typography>
                    <Checkbox
                      checked={properties.muted || false}
                      onChange={(e) => handleChange("muted", e.target.checked)}
                      sx={{
                        color: alpha("#6366f1", 0.7),
                        "&.Mui-checked": { color: "#6366f1" },
                        p: 0,
                      }}
                      size="small"
                    />
                  </Box>
                )}
                {!isYouTube && section.details.includes("poster") && (
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="caption" sx={{ minWidth: 80, color: alpha("#ffffff", 0.7), fontSize: "0.75rem" }}>
                      Poster
                    </Typography>
                    <TextField
                      type="text"
                      value={properties.poster || ""}
                      onChange={(e) => handleChange("poster", e.target.value)}
                      variant="outlined"
                      size={size}
                      placeholder="Image URL"
                      sx={{
                        "& .MuiInputBase-input": { color: "#ffffff", fontSize: "0.75rem" },
                        "& .MuiOutlinedInput-notchedOutline": { borderColor: alpha("#6366f1", 0.3) },
                        "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: alpha("#6366f1", 0.5) },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#6366f1" },
                        backgroundColor: alpha("#1e1e38", 0.5),
                        borderRadius: "4px",
                        height: "32px",
                        flex: 1,
                      }}
                    />
                  </Box>
                )}
                {!isYouTube && section.details.includes("playbackRate") && (
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="caption" sx={{ minWidth: 80, color: alpha("#ffffff", 0.7), fontSize: "0.75rem" }}>
                      Playback Rate
                    </Typography>
                    <TextField
                      type="number"
                      value={properties.playbackRate || 1}
                      onChange={(e) => handleChange("playbackRate", parseFloat(e.target.value))}
                      variant="outlined"
                      size={size}
                      inputProps={{ step: 0.1, min: 0.1, max: 4 }}
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
                {isYouTube && section.details.includes("start") && (
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="caption" sx={{ minWidth: 80, color: alpha("#ffffff", 0.7), fontSize: "0.75rem" }}>
                      Start (s)
                    </Typography>
                    <TextField
                      type="number"
                      value={properties.start || 0}
                      onChange={(e) => handleChange("start", parseInt(e.target.value))}
                      variant="outlined"
                      size={size}
                      inputProps={{ min: 0 }}
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
                {isYouTube && section.details.includes("end") && (
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="caption" sx={{ minWidth: 80, color: alpha("#ffffff", 0.7), fontSize: "0.75rem" }}>
                      End (s)
                    </Typography>
                    <TextField
                      type="number"
                      value={properties.end || 0}
                      onChange={(e) => handleChange("end", parseInt(e.target.value))}
                      variant="outlined"
                      size={size}
                      inputProps={{ min: 0 }}
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
                {isYouTube && section.details.includes("showRelated") && (
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="caption" sx={{ minWidth: 80, color: alpha("#ffffff", 0.7), fontSize: "0.75rem" }}>
                      Show Related
                    </Typography>
                    <Checkbox
                      checked={properties.showRelated || false}
                      onChange={(e) => handleChange("showRelated", e.target.checked)}
                      sx={{
                        color: alpha("#6366f1", 0.7),
                        "&.Mui-checked": { color: "#6366f1" },
                        p: 0,
                      }}
                      size="small"
                    />
                  </Box>
                )}
                {section.details.includes("padding") && (
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="caption" sx={{ minWidth: 80, color: alpha("#ffffff", 0.7), fontSize: "0.75rem" }}>
                      Padding
                    </Typography>
                    <TextField
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
                {section.details.includes("backgroundColor") && (
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="caption" sx={{ minWidth: 80, color: alpha("#ffffff", 0.7), fontSize: "0.75rem" }}>
                      Background
                    </Typography>
                    <TextField
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
                {section.details.includes("border") && (
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="caption" sx={{ minWidth: 80, color: alpha("#ffffff", 0.7), fontSize: "0.75rem" }}>
                      Border
                    </Typography>
                    <TextField
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