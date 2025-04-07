import React, { useState, useEffect } from "react";
import { useEditor } from "@craftjs/core";
import { ShareDialog } from "../share_pages";
import { DeviceMockup } from "../main_element";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import SmartphoneIcon from "@mui/icons-material/Smartphone";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import TabletIcon from "@mui/icons-material/Tablet";
import DesktopWindowsIcon from "@mui/icons-material/DesktopWindows";
import EditIcon from "@mui/icons-material/Edit";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ErrorIcon from "@mui/icons-material/Error";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SearchIcon from "@mui/icons-material/Search";
import GridViewIcon from "@mui/icons-material/GridView";
import ShareIcon from "@mui/icons-material/Share";
import { IconButton, TextField, Tooltip, Box, Button, Typography, Divider, Chip, Badge } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { UpdatePage } from "../update_page";

const headerStyle = {
  borderBottom: "1px solid rgba(79, 70, 229, 0.3)",
  background: "linear-gradient(to right, #1e1e38, #2a2a44)",
  minHeight: "3.5rem",
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  justifyContent: "space-between",
  px: { xs: 1.5, sm: 2.5 },
  color: "white",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
};

interface Project {
  fid: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  alias: string;
}

interface PageData {
  title: string;
  url_alias: string;
  metaTags?: string;
  sections?: string;
  page_alias?: string;
  project_alias?: string;
  project?: Project;
}

interface ShareLink {
  projectAlias: string;
  pageAlias: string;
}

export const AddElementsHeader: React.FC<{
  editorRef: React.RefObject<HTMLDivElement>;
  pageData: PageData | null;
}> = React.memo(({ editorRef, pageData }) => {
  const { actions, query } = useEditor();
  const [title, setTitle] = useState<string>("Page");
  const [alias, setAlias] = useState<string>("my-page");
  const [metaTag, setMetaTag] = useState<string>("web, page, builder");
  const [isEditingTitle, setIsEditingTitle] = useState<boolean>(false);
  const [isEditingAlias, setIsEditingAlias] = useState<boolean>(false);
  const [isEditingMeta, setIsEditingMeta] = useState<boolean>(false);
  const [openShareDialog, setOpenShareDialog] = useState<boolean>(false);
  const [shareLink, setShareLink] = useState<ShareLink>({ projectAlias: "", pageAlias: "" });
  const navigate = useNavigate();

  useEffect(() => {
    console.log("pageData:", pageData);
    if (pageData) {
      setTitle(pageData.title || "Page");
      setAlias(pageData.url_alias || "my-page");
      setMetaTag(pageData.metaTags || "web, page, builder");
    }
  }, [pageData]);

  const { deviceName, deviceSize } = useEditor((state) => {
    let width = "100%";
    let height = "100vh";
    let name = "📱 Smartphone";
    const nodes = state.nodes;
    for (const node of Object.values(nodes)) {
      if (node.data.type === DeviceMockup) {
        width = node.data.props.width || "100%";
        height = node.data.props.height || "100vh";
        name = node.data.props.name || "📱 Smartphone";
        break;
      }
    }
    const widthNum = parseInt(width.replace(/[^\d]/g, ""), 10) || 375;
    if (widthNum >= 600 && widthNum < 824) {
      name = "📱 Tablet";
    } else if (widthNum >= 824) {
      name = "💻 Desktop";
    }

    return {
      deviceName: name,
      deviceSize: `${width} x ${height}`,
    };
  });

  const updateDeviceSize = (width: string, height: string, name: string) => {
    const nodes = query.getNodes();
    for (const [id, node] of Object.entries(nodes)) {
      if (node.data.type === DeviceMockup) {
        actions.setProp(id, (props) => {
          props.width = width;
          props.height = height;
          props.name = name;
        });
        break;
      }
    }
  };

  const handleBackClick = () => navigate(-1);

  const handleDeviceClick = (device: "smartphone" | "tablet" | "desktop") => {
    switch (device) {
      case "smartphone":
        updateDeviceSize("475px", "612px", "📱 Smartphone");
        break;
      case "tablet":
        updateDeviceSize("468px", "624px", "📱 Tablet");
        break;
      case "desktop":
        updateDeviceSize("840px", "500px", "💻 Desktop");
        break;
    }
  };

  const { canUndo, canRedo } = useEditor((_state, query) => ({
    canUndo: query.history.canUndo(),
    canRedo: query.history.canRedo(),
  }));

  const handleUndo = () => canUndo && actions.history.undo();
  const handleRedo = () => canRedo && actions.history.redo();

  const isSmartphone = deviceName.includes("Smartphone");
  const isTablet = deviceName.includes("Tablet");
  const isDesktop = deviceName.includes("Desktop");

  const handleEditTitleClick = () => setIsEditingTitle(true);
  const handleEditAliasClick = () => setIsEditingAlias(true);
  const handleEditMetaClick = () => setIsEditingMeta(true);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value);
  const handleAliasChange = (e: React.ChangeEvent<HTMLInputElement>) => setAlias(e.target.value);
  const handleMetaChange = (e: React.ChangeEvent<HTMLInputElement>) => setMetaTag(e.target.value);

  const handleTitleBlur = () => {
    setIsEditingTitle(false);
    if (!title.trim()) setTitle(pageData?.title || "Page");
  };

  const handleAliasBlur = () => {
    setIsEditingAlias(false);
    if (!alias.trim()) setAlias(pageData?.url_alias || "my-page");
  };

  const handleMetaBlur = () => {
    setIsEditingMeta(false);
    if (!metaTag.trim()) setMetaTag(pageData?.metaTags || "web, page, builder");
  };

  const handlePreviewClick = () => {
    const jsonData = query.serialize();
    const [width, height] = deviceSize.split(" x ");
    navigate("/view-content", { state: { layoutData: jsonData, width, height } });
  };

  const handleShareClick = () => {
    const projectAlias = pageData?.project?.alias || "du_an2"; // Giá trị mặc định nếu pageData hoặc project không tồn tại
    const pageAlias = pageData?.url_alias || "default-page"; // Giá trị mặc định nếu url_alias không tồn tại
    console.log("projectAlias:", projectAlias);
    console.log("pageAlias:", pageAlias);
    setShareLink({ projectAlias, pageAlias });
    setOpenShareDialog(true);
  };

  const handleCloseShareDialog = () => setOpenShareDialog(false);

  return (
    <Box sx={headerStyle}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexShrink: 0 }}>
        <Tooltip title="Back" arrow placement="top">
          <IconButton
            onClick={handleBackClick}
            sx={{
              color: alpha("#ffffff", 0.8),
              "&:hover": { bgcolor: alpha("#6366f1", 0.15), color: "#ffffff" },
              width: 32,
              height: 32,
            }}
            size="small"
          >
            <ArrowBackIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {isEditingTitle ? (
            <TextField
              value={title}
              onChange={handleTitleChange}
              onBlur={handleTitleBlur}
              autoFocus
              size="small"
              sx={{
                input: { color: "#ffffff", fontSize: "0.95rem", fontWeight: 500 },
                "& .MuiInputBase-root": {
                  bgcolor: alpha("#1e1e38", 0.5),
                  borderRadius: "6px",
                  transition: "all 0.2s ease",
                  "&:hover": { bgcolor: alpha("#1e1e38", 0.7) },
                },
                "& .MuiOutlinedInput-notchedOutline": { borderColor: alpha("#6366f1", 0.5) },
              }}
            />
          ) : (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, letterSpacing: "0.01em" }}>
                {title}
              </Typography>
              <Tooltip title="Edit title" placement="top" arrow>
                <IconButton
                  onClick={handleEditTitleClick}
                  sx={{ color: alpha("#ffffff", 0.8), p: 0.5, ml: 0.5 }}
                  size="small"
                >
                  <EditIcon fontSize="small" sx={{ fontSize: "0.85rem" }} />
                </IconButton>
              </Tooltip>
            </Box>
          )}
        </Box>

        <Divider orientation="vertical" flexItem sx={{ bgcolor: alpha("#6366f1", 0.3), mx: 1, height: "24px", my: "auto" }} />

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {isEditingAlias ? (
            <TextField
              value={alias}
              onChange={handleAliasChange}
              onBlur={handleAliasBlur}
              autoFocus
              size="small"
              sx={{
                input: { color: "#ffffff", fontSize: "0.85rem" },
                "& .MuiInputBase-root": {
                  bgcolor: alpha("#1e1e38", 0.5),
                  borderRadius: "6px",
                  transition: "all 0.2s ease",
                  "&:hover": { bgcolor: alpha("#1e1e38", 0.7) },
                },
                "& .MuiOutlinedInput-notchedOutline": { borderColor: alpha("#6366f1", 0.5) },
              }}
            />
          ) : (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Chip
                label={alias}
                size="small"
                sx={{
                  bgcolor: alpha("#1e1e38", 0.5),
                  color: alpha("#ffffff", 0.85),
                  fontSize: "0.75rem",
                  fontWeight: 500,
                  height: "22px",
                }}
              />
              <Tooltip title="Edit alias" placement="top" arrow>
                <IconButton
                  onClick={handleEditAliasClick}
                  sx={{ color: alpha("#ffffff", 0.8), p: 0.5, ml: 0.5 }}
                  size="small"
                >
                  <EditIcon fontSize="small" sx={{ fontSize: "0.8rem" }} />
                </IconButton>
              </Tooltip>
            </Box>
          )}
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {isEditingMeta ? (
            <TextField
              value={metaTag}
              onChange={handleMetaChange}
              onBlur={handleMetaBlur}
              autoFocus
              size="small"
              sx={{
                input: { color: "#ffffff", fontSize: "0.85rem" },
                "& .MuiInputBase-root": {
                  bgcolor: alpha("#1e1e38", 0.5),
                  borderRadius: "6px",
                  transition: "all 0.2s ease",
                  "&:hover": { bgcolor: alpha("#1e1e38", 0.7) },
                },
                "& .MuiOutlinedInput-notchedOutline": { borderColor: alpha("#6366f1", 0.5) },
              }}
            />
          ) : (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography
                variant="caption"
                sx={{
                  color: alpha("#ffffff", 0.7),
                  fontSize: "0.75rem",
                  bgcolor: alpha("#1e1e38", 0.3),
                  px: 1,
                  py: 0.25,
                  borderRadius: "4px",
                }}
              >
                {metaTag}
              </Typography>
              <Tooltip title="Edit meta tags" placement="top" arrow>
                <IconButton
                  onClick={handleEditMetaClick}
                  sx={{ color: alpha("#ffffff", 0.8), p: 0.5, ml: 0.5 }}
                  size="small"
                >
                  <EditIcon fontSize="small" sx={{ fontSize: "0.8rem" }} />
                </IconButton>
              </Tooltip>
            </Box>
          )}
        </Box>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1, sm: 2 }, flexWrap: "wrap", justifyContent: "center", mx: 2 }}>
        <Chip
          label={`${deviceName.replace(/^\W+/, '')} - ${deviceSize}`}
          variant="outlined"
          size="small"
          sx={{
            borderColor: alpha("#6366f1", 0.3),
            color: alpha("#ffffff", 0.85),
            bgcolor: alpha("#1e1e38", 0.3),
            fontSize: "0.75rem",
          }}
        />

        <Box sx={{ display: "flex", alignItems: "center", bgcolor: alpha("#1e1e38", 0.3), borderRadius: "6px", p: 0.5 }}>
          <Tooltip title="Smartphone View" arrow placement="top">
            <IconButton
              onClick={() => handleDeviceClick("smartphone")}
              sx={{
                color: isSmartphone ? "#6366f1" : alpha("#ffffff", 0.6),
                bgcolor: isSmartphone ? alpha("#ffffff", 0.15) : "transparent",
                "&:hover": { bgcolor: isSmartphone ? alpha("#ffffff", 0.2) : alpha("#ffffff", 0.08) },
                p: 0.75,
                mx: 0.25,
              }}
              size="small"
            >
              <SmartphoneIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Tablet View" arrow placement="top">
            <IconButton
              onClick={() => handleDeviceClick("tablet")}
              sx={{
                color: isTablet ? "#6366f1" : alpha("#ffffff", 0.6),
                bgcolor: isTablet ? alpha("#ffffff", 0.15) : "transparent",
                "&:hover": { bgcolor: isTablet ? alpha("#ffffff", 0.2) : alpha("#ffffff", 0.08) },
                p: 0.75,
                mx: 0.25,
              }}
              size="small"
            >
              <TabletIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Desktop View" arrow placement="top">
            <IconButton
              onClick={() => handleDeviceClick("desktop")}
              sx={{
                color: isDesktop ? "#6366f1" : alpha("#ffffff", 0.6),
                bgcolor: isDesktop ? alpha("#ffffff", 0.15) : "transparent",
                "&:hover": { bgcolor: isDesktop ? alpha("#ffffff", 0.2) : alpha("#ffffff", 0.08) },
                p: 0.75,
                mx: 0.25,
              }}
              size="small"
            >
              <DesktopWindowsIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>

        <Button
          variant="text"
          startIcon={<GridViewIcon />}
          endIcon={<KeyboardArrowDownIcon />}
          size="small"
          disabled={true}
          sx={{
            color: alpha("#ffffff", 0.85),
            textTransform: "none",
            fontSize: "0.85rem",
            bgcolor: alpha("#1e1e38", 0.3),
            borderRadius: "6px",
            px: 1.5,
            py: 0.5,
          }}
        >
          Grids
        </Button>

        <Box sx={{ display: "flex", alignItems: "center", bgcolor: alpha("#1e1e38", 0.3), borderRadius: "6px", p: 0.5 }}>
          <Tooltip title={canUndo ? "Undo" : "Nothing to undo"} arrow placement="top">
            <span>
              <IconButton
                onClick={handleUndo}
                disabled={!canUndo}
                sx={{
                  color: canUndo ? alpha("#ffffff", 0.8) : alpha("#ffffff", 0.3),
                  "&:hover": { bgcolor: alpha("#ffffff", 0.08) },
                  p: 0.75,
                  mx: 0.25,
                }}
                size="small"
              >
                <UndoIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>

          <Tooltip title={canRedo ? "Redo" : "Nothing to redo"} arrow placement="top">
            <span>
              <IconButton
                onClick={handleRedo}
                disabled={!canRedo}
                sx={{
                  color: canRedo ? alpha("#ffffff", 0.8) : alpha("#ffffff", 0.3),
                  "&:hover": { bgcolor: alpha("#ffffff", 0.08) },
                  p: 0.75,
                  mx: 0.25,
                }}
                size="small"
              >
                <RedoIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>

          <Tooltip title="Validation Issues" arrow placement="top">
            <IconButton
              sx={{ color: alpha("#ffffff", 0.8), "&:hover": { bgcolor: alpha("#ffffff", 0.08) }, p: 0.75, mx: 0.25 }}
              size="small"
              disabled={true}
            >
              <Badge badgeContent={0} color="error">
                <ErrorIcon fontSize="small" />
              </Badge>
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Box sx={{ display: "flex", gap: 1, flexShrink: 0 }}>
        <Tooltip title="Search" arrow placement="top">
          <IconButton sx={{ color: alpha("#ffffff", 0.8), p: 1 }} size="small" disabled={true}>
            <SearchIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <UpdatePage editorRef={editorRef} title={title} alias={alias} metaTags={metaTag} />
        <Tooltip title="Preview" arrow placement="top">
          <IconButton
            onClick={handlePreviewClick}
            sx={{ color: "#ffffff", bgcolor: "#1e1e38", "&:hover": { bgcolor: "#2a2a44" }, p: 1 }}
            size="small"
          >
            <VisibilityIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Share" arrow placement="top">
          <IconButton
            onClick={handleShareClick}
            sx={{ color: "#ffffff", bgcolor: "#1e1e38", "&:hover": { bgcolor: "#2a2a44" }, p: 1 }}
            size="small"
          >
            <ShareIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      <ShareDialog open={openShareDialog} onClose={handleCloseShareDialog} shareLink={shareLink} />
    </Box>
  );
});