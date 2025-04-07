import React from "react";
import { useEditor } from "@craftjs/core";
import { ContainerProperties } from "../element_layout/container/properties-container-panel";
import { ContainerLayout } from "../element_layout/container/container-layout";
import { DefaultContainerProperties } from "../element_layout/container/container-properties";
import { TextLayout } from "../element_layout/text/text-layout";
import { TextProperties } from "../element_layout/text/properties-text-panel";
import { TextDefaultProperties } from "../element_layout/text/text-properties";
import { HeadingLayout } from "../element_layout/heading/heading-layout";
import { HeadingProperties } from "../element_layout/heading/properties-heading-panel";
import { HeadingPropertiesDefaults } from "../element_layout/heading/heading-properties";
import { ButtonLayout } from "../element_layout/button/button-layout";
import { ButtonProperties } from "../element_layout/button/button-properties-panel";
import { ButtonPropertiesDefaults } from "../element_layout/button/button-properties";
import { LinkProperties } from "../element_layout/link/properties-link-panel";
import { ColumnLayout, ImageLayout, LinkLayout, ListLayout, RadioLayout, RowLayout, TabsLayout, VideoPlayerLayout } from "../element_layout";
import { LinkPropertiesDefaults } from "../element_layout/link/link-properties";
import { GridLayout } from "../element_layout/grid/grid-layout";
import { GridProperties } from "../element_layout/grid/properties-grid-panel";
import { GridPropertiesDefaults } from "../element_layout/grid/properties-grid";
import { ImagePropertiesDefaults } from "../element_layout/image/image-properties";
import { ImageProperties } from "../element_layout/image/properties-image-panel";
import { RadioPropertiesDefaults } from "../element_layout/radio/properties-radio";
import { RadioProperties } from "../element_layout/radio/radio-properties-panel";
import { CheckboxLayout } from "../element_layout/checkbox/checkbox-layout";
import { CheckboxProperties } from "../element_layout/checkbox/properties-checkbox-panel";
import { CheckboxPropertiesDefaults } from "../element_layout/checkbox/checkbox-properties";
import { ListProperties } from "../element_layout/list/properties-list-panel";
import { ListPropertiesDefaults } from "../element_layout/list/list-properties";
import { TabsProperties } from "../element_layout/tabs/properties-tabs-panel";
import { TabsPropertiesDefaults } from "../element_layout/tabs/tabs-properties";
import { VideoPlayerProperties } from "../element_layout/videoplayer/properties-videoplayer-pannel";
import { VideoPlayerPropertiesDefaults } from "../element_layout/videoplayer/videoplayer-properties";
import { RowProperties } from "../element_layout/row/properties-row-panel";
import { RowPropertiesDefaults } from "../element_layout/row/row-properties";
import { Box, Button, Select, MenuItem, TextField, Divider, InputLabel, FormControl, Typography, Tooltip } from "@mui/material";
import { alpha } from "@mui/material/styles";
import LayersIcon from "@mui/icons-material/Layers";
import SettingsIcon from "@mui/icons-material/Settings";
import BrushIcon from "@mui/icons-material/Brush";
import TouchAppIcon from "@mui/icons-material/TouchApp";
import { NavigationMenuProperties } from "../element_layout/navigation/properties-navigation-menu-panel";
import { NavigationMenuLayout } from "../element_layout/navigation/navigation-menu-layout";
import { DefaultNavigationMenuProperties } from "../element_layout/navigation/navigation-menu-properties";
import { DropdownLayout } from "../element_layout/dropdown/dropdown_layout";
import { DropdownProperties, DropdownPropertiesDefaults } from "../element_layout/dropdown";
import { DeviceMockup } from "../main_element";
import { DeviceMockupPropertiesDefaults } from "../main_element/main-element-properties";
import { DeviceMockupProperties } from "../main_element/main-element-properties-panel";

export const RightSidebar: React.FC = () => {
  const { selectedNode, actions } = useEditor((state) => {
    const selectedId = state.events.selected.size > 0 ? state.events.selected.values().next().value : null;
    return {
      selectedNode: selectedId ? state.nodes[selectedId] : null,
    };
  });

  const handlePropertyChange = (
    newProperties: Partial<
      DefaultContainerProperties | TextDefaultProperties | HeadingPropertiesDefaults | ButtonPropertiesDefaults | RowPropertiesDefaults
    >
  ) => {
    if (selectedNode) {
      actions.setProp(selectedNode.id, (props: any) => {
        const filteredProps = {};
        Object.keys(newProperties).forEach((key) => {
          if (key in props) {
            (filteredProps as any)[key] = (newProperties as any)[key];
          }
        });
        Object.assign(props, filteredProps);
      });
    }
  };

  return (
    <Box
      className="p-3 w-[350px] h-screen bg-gradient-to-b from-slate-900 to-indigo-950 text-white border-l border-indigo-900/30 overflow-y-auto"
      sx={{ maxHeight: "calc(100vh - 64px)" }}
    >
      <Box sx={{ display: "flex", alignItems: "center", mb: 2, pb: 1, borderBottom: "1px solid rgba(99, 102, 241, 0.1)" }}>
        <LayersIcon sx={{ color: "#6366f1", mr: 1 }} />
        <Typography variant="subtitle1" sx={{ fontWeight: 600, letterSpacing: "0.01em" }}>
          Properties
        </Typography>
      </Box>
      <Box sx={{ display: "flex", gap: 1, mb: 2, backgroundColor: alpha("#1e1e38", 0.5), p: 0.5, borderRadius: "6px" }}>
        <Tooltip title="Style Settings" arrow placement="top">
          <Button
            disabled={true}
            size="small"
            sx={{
              flex: 1,
              fontSize: "0.75rem",
              padding: "4px 8px",
              color: alpha("#ffffff", 0.85),
              backgroundColor: alpha("#6366f1", 0.15),
              borderRadius: "4px",
              textTransform: "none",
              "&:hover": {
                backgroundColor: alpha("#6366f1", 0.25),
                color: "#ffffff",
              },
            }}
            startIcon={<BrushIcon sx={{ fontSize: "1rem" }} />}
          >
            Style
          </Button>
        </Tooltip>
        <Tooltip title="Interaction Settings" arrow placement="top">
          <Button
            disabled={true}
            size="small"
            sx={{
              flex: 1,
              fontSize: "0.75rem",
              padding: "4px 8px",
              color: alpha("#ffffff", 0.85),
              backgroundColor: "transparent",
              borderRadius: "4px",
              textTransform: "none",
              "&:hover": {
                backgroundColor: alpha("#6366f1", 0.15),
                color: "#ffffff",
              },
            }}
            startIcon={<TouchAppIcon sx={{ fontSize: "1rem" }} />}
          >
            Interactions
          </Button>
        </Tooltip>
        <Tooltip title="Inspector" arrow placement="top">
          <Button
            disabled={true}
            size="small"
            sx={{
              flex: 1,
              fontSize: "0.75rem",
              padding: "4px 8px",
              color: alpha("#ffffff", 0.85),
              backgroundColor: "transparent",
              borderRadius: "4px",
              textTransform: "none",
              "&:hover": {
                backgroundColor: alpha("#6366f1", 0.15),
                color: "#ffffff",
              },
            }}
            startIcon={<SettingsIcon sx={{ fontSize: "1rem" }} />}
          >
            Inspector
          </Button>
        </Tooltip>
      </Box>
      <Box mb={2}>
        <FormControl fullWidth>
          <InputLabel
            disabled={true}
            id="demo-simple-select-label"
            sx={{
              fontSize: "0.85rem",
              color: alpha("#ffffff", 0.7),
              "&.Mui-focused": { color: "#6366f1" },
            }}
          >
            Page
          </InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="Page"
            size="small"
            sx={{
              "& .MuiSelect-select": { color: "#ffffff", fontSize: "0.85rem", py: 1 },
              "& .MuiOutlinedInput-notchedOutline": { borderColor: alpha("#6366f1", 0.3) },
              "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: alpha("#6366f1", 0.5) },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#6366f1" },
              backgroundColor: alpha("#1e1e38", 0.5),
              borderRadius: "6px",
              "& .MuiSvgIcon-root": { color: alpha("#ffffff", 0.7) },
            }}
          >
            <MenuItem sx={{ fontSize: "0.85rem", py: 0.5, px: 1 }} value="Login">
              Login
            </MenuItem>
            <MenuItem sx={{ fontSize: "0.85rem", py: 0.5, px: 1 }} value="HomePage">
              HomePage
            </MenuItem>
            <MenuItem sx={{ fontSize: "0.85rem", py: 0.5, px: 1 }} value="Settings">
              Settings
            </MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Divider sx={{ bgcolor: alpha("#6366f1", 0.3), my: 2 }} />
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <TextField
          disabled={true}
          id="standard-number"
          label="Width"
          type="number"
          value={100}
          variant="outlined"
          size="small"
          sx={{
            "& .MuiInputBase-input": { color: "#ffffff", fontSize: "0.85rem" },
            "& .MuiInputLabel-root": { color: alpha("#ffffff", 0.7), fontSize: "0.85rem" },
            "& .MuiInputLabel-root.Mui-focused": { color: "#6366f1" },
            "& .MuiOutlinedInput-notchedOutline": { borderColor: alpha("#6366f1", 0.3) },
            "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: alpha("#6366f1", 0.5) },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#6366f1" },
            backgroundColor: alpha("#1e1e38", 0.5),
            borderRadius: "6px",
          }}
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
        />
        <TextField
          disabled={true}
          id="standard-number"
          label="Height"
          type="number"
          value={100}
          variant="outlined"
          size="small"
          sx={{
            "& .MuiInputBase-input": { color: "#ffffff", fontSize: "0.85rem" },
            "& .MuiInputLabel-root": { color: alpha("#ffffff", 0.7), fontSize: "0.85rem" },
            "& .MuiInputLabel-root.Mui-focused": { color: "#6366f1" },
            "& .MuiOutlinedInput-notchedOutline": { borderColor: alpha("#6366f1", 0.3) },
            "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: alpha("#6366f1", 0.5) },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#6366f1" },
            backgroundColor: alpha("#1e1e38", 0.5),
            borderRadius: "6px",
          }}
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
        />
      </Box>

      <Divider sx={{ bgcolor: alpha("#6366f1", 0.3), my: 2 }} />

      {selectedNode && selectedNode.data ? (
        <Box sx={{ overflowY: "auto", maxHeight: "calc(100vh - 400px)" }}>
          <Typography
            variant="subtitle2"
            sx={{
              color: alpha("#ffffff", 0.9),
              fontWeight: 500,
              mb: 1,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
          </Typography>
          {selectedNode.data.type === ContainerLayout && (
            <Box>
              <ContainerProperties
                properties={selectedNode.data.props as DefaultContainerProperties}
                onPropertyChange={handlePropertyChange}
              />
            </Box>
          )}
          {selectedNode.data.type === TextLayout && (
            <Box>
              <TextProperties
                properties={selectedNode.data.props as TextDefaultProperties}
                onPropertyChange={handlePropertyChange}
              />
            </Box>
          )}
          {selectedNode.data.type === HeadingLayout && (
            <Box>
              <HeadingProperties
                properties={selectedNode.data.props as HeadingPropertiesDefaults}
                onPropertyChange={handlePropertyChange}
              />
            </Box>
          )}
          {selectedNode.data.type === ButtonLayout && (
            <Box>
              <ButtonProperties
                properties={selectedNode.data.props as ButtonPropertiesDefaults}
                onPropertyChange={handlePropertyChange}
              />
            </Box>
          )}
          {selectedNode.data.type === LinkLayout && (
            <Box>
              <LinkProperties
                properties={selectedNode.data.props as LinkPropertiesDefaults}
                onPropertyChange={handlePropertyChange}
              />
            </Box>
          )}
          {selectedNode.data.type === GridLayout && (
            <Box>
              <GridProperties
                properties={selectedNode.data.props as GridPropertiesDefaults}
                onPropertyChange={handlePropertyChange}
              />
            </Box>
          )}
          {selectedNode.data.type === ImageLayout && (
            <Box>
              <ImageProperties
                properties={selectedNode.data.props as ImagePropertiesDefaults}
                onPropertyChange={handlePropertyChange}
              />
            </Box>
          )}
          {selectedNode.data.type === RadioLayout && (
            <Box>
              <RadioProperties
                properties={selectedNode.data.props as RadioPropertiesDefaults}
                onPropertyChange={handlePropertyChange}
              />
            </Box>
          )}
          {selectedNode.data.type === CheckboxLayout && (
            <Box>
              <CheckboxProperties
                properties={selectedNode.data.props as CheckboxPropertiesDefaults}
                onPropertyChange={handlePropertyChange}
              />
            </Box>
          )}
          {selectedNode.data.type === ListLayout && (
            <Box>
              <ListProperties
                properties={selectedNode.data.props as ListPropertiesDefaults}
                onPropertyChange={handlePropertyChange}
              />
            </Box>
          )}
          {selectedNode.data.type === TabsLayout && (
            <Box>
              <TabsProperties
                properties={selectedNode.data.props as TabsPropertiesDefaults}
                onPropertyChange={handlePropertyChange}
                size="small"
              />
            </Box>
          )}
          {selectedNode.data.type === VideoPlayerLayout && (
            <Box>
              <VideoPlayerProperties
                properties={selectedNode.data.props as VideoPlayerPropertiesDefaults}
                onPropertyChange={handlePropertyChange}
              />
            </Box>
          )}
          {selectedNode.data.type === DropdownLayout && (
            <Box>
              <DropdownProperties
                properties={selectedNode.data.props as DropdownPropertiesDefaults}
                onPropertyChange={handlePropertyChange}
                size="small"
              />
            </Box>
          )}
          {selectedNode.data.type === DeviceMockup && (
            <Box>
              <DeviceMockupProperties
                properties={selectedNode.data.props as DeviceMockupPropertiesDefaults}
                onPropertyChange={handlePropertyChange}
                size="small"
              />
            </Box>
          )}
          {selectedNode.data.type === RowLayout && (
            <Box>
              <RowProperties
                properties={selectedNode.data.props as RowPropertiesDefaults}
                onPropertyChange={handlePropertyChange}
              />
            </Box>
          )}
          {selectedNode.data.type === ColumnLayout && (
            <Box>
              <RowProperties
                properties={selectedNode.data.props as RowPropertiesDefaults}
                onPropertyChange={handlePropertyChange}
              />
            </Box>
          )}
          {
            selectedNode.data.type === NavigationMenuLayout && (
              <Box>
                <NavigationMenuProperties
                  properties={selectedNode.data.props as DefaultNavigationMenuProperties}
                  onPropertyChange={handlePropertyChange}
                />
              </Box>
            )
          }

        </Box>
      ) : (
        <Typography
          sx={{
            color: alpha("#ffffff", 0.6),
            py: 4,
            textAlign: "center",
            fontStyle: "italic",
            fontSize: "0.85rem",
          }}
        >
          Select a component to edit its properties
        </Typography>
      )}
    </Box>
  );
};