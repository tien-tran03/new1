import { useNode } from '@craftjs/core';
import { ReactNode, useEffect, useRef } from 'react'; // Thêm useRef
import { Box, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { getDeviceMockupPropertiesDefaults } from './main-element-properties';
import { DeviceMockupProperties } from './main-element-properties-panel';

interface DeviceMockupProps {
  width?: string;
  height?: string;
  name?: string;
  gap?: string;
  padding?: string;
  background?: string;
  backgroundImage?: string;
  borderRadius?: string;
  borderStyle?: "none" | "solid" | "dashed" | "dotted";
  borderWidth?: string;
  borderColor?: string;
  boxShadow?: string;
  children?: ReactNode;
  hideFrame?: boolean;
}

export const DeviceMockup = ({
  width,
  height,
  name,
  gap,
  padding,
  background,
  backgroundImage,
  borderRadius,
  borderStyle,
  borderWidth,
  borderColor,
  boxShadow,
  children,
  hideFrame = false,
}: DeviceMockupProps) => {
  const {
    connectors: { connect },
    custom,
  } = useNode((node) => ({
    custom: node.data.custom,
  }));

  const defaults = getDeviceMockupPropertiesDefaults();
  const localRef = useRef<HTMLDivElement>(null); // Ref cục bộ

  // Lấy callback từ custom để cập nhật ref
  const setDeviceMockupRef = (custom as any)?.setDeviceMockupRef;

  useEffect(() => {
    if (localRef.current && setDeviceMockupRef) {
      setDeviceMockupRef(localRef); // Gọi callback để cập nhật ref
      console.log("DeviceMockup ref set:", localRef.current);
    }
  }, [setDeviceMockupRef]);

  if (hideFrame) {
    return (
      <Box
        ref={localRef} // Sử dụng ref cục bộ
        sx={{
          mx: "auto",
          borderRadius: borderRadius || defaults.borderRadius,
          bgcolor: backgroundImage
            ? "transparent"
            : (background || defaults.background).includes("http")
            ? "transparent"
            : background || defaults.background,
          backgroundImage: backgroundImage
            ? `url(${backgroundImage})`
            : (background || defaults.background).includes("http")
            ? `url(${background || defaults.background})`
            : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
          boxShadow: boxShadow || defaults.boxShadow,
          width: width || defaults.width,
          height: height || defaults.height,
          p: padding || defaults.padding,
          borderStyle: borderStyle || defaults.borderStyle,
          borderWidth: borderWidth || defaults.borderWidth,
          borderColor: borderColor || defaults.borderColor,
          transition: "border-color 0.3s ease",
          "&:hover": {
            borderColor: defaults.borderColor,
          },
        }}
      >
        <Box
          sx={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: gap || defaults.gap,
            "& > *": {
              maxWidth: "100% !important",
              maxHeight: "100% !important",
              boxSizing: "border-box !important",
              position: "relative",
            },
          }}
        >
          {children}
        </Box>
      </Box>
    );
  }

  return (
    <Box
      ref={connect as unknown as React.Ref<HTMLDivElement>}
      sx={{
        bgcolor: alpha("#1e1e38", 0.05),
        p: 2,
        borderRadius: "12px",
        boxShadow: "0 6px 12px rgba(0, 0, 0, 0.15)",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)",
        },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1, px: 1 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: "0.85rem", color: "#1e1e38" }}>
          {name || defaults.name}
        </Typography>
      </Box>
      <Box
        ref={localRef} // Sử dụng ref cục bộ
        sx={{
          mx: "auto",
          borderRadius: borderRadius || defaults.borderRadius,
          bgcolor: backgroundImage
            ? "transparent"
            : (background || defaults.background).includes("http")
            ? "transparent"
            : background || defaults.background,
          backgroundImage: backgroundImage
            ? `url(${backgroundImage})`
            : (background || defaults.background).includes("http")
            ? `url(${background || defaults.background})`
            : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
          boxShadow: boxShadow || defaults.boxShadow,
          width: width || defaults.width,
          height: height || defaults.height,
          p: padding || defaults.padding,
          borderStyle: borderStyle || defaults.borderStyle,
          borderWidth: borderWidth || defaults.borderWidth,
          borderColor: borderColor || defaults.borderColor,
          transition: "border-color 0.3s ease",
          "&:hover": {
            borderColor: defaults.borderColor,
          },
        }}
      >
        <Box
          sx={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: gap || defaults.gap,
            "& > *": {
              maxWidth: "100% !important",
              maxHeight: "100% !important",
              boxSizing: "border-box !important",
              position: "relative",
            },
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

DeviceMockup.craft = {
  displayName: "DeviceMockup",
  props: {
    ...getDeviceMockupPropertiesDefaults(),
    hideFrame: false,
  },
  rules: {
    canDrop: () => true,
  },
  custom: {
    childConstraints: {
      maxWidth: "100%",
      maxHeight: "100%",
    },
  },
  related: {
    toolbar: DeviceMockupProperties,
  },
};