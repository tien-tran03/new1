export interface DeviceMockupPropertiesDefaults {
    width: string;
    height: string;
    name: string;
    gap: string;
    padding: string;
    background: string;
    backgroundImage: string;
    borderRadius: string;
    borderStyle: "none" | "solid" | "dashed" | "dotted";
    borderWidth: string;
    borderColor: string;
    boxShadow: string;
  }
  
  export const getDeviceMockupPropertiesDefaults = (): DeviceMockupPropertiesDefaults => ({
    width: "940px",
    height: "700px",
    name: "💻 Desktop",
    gap: "0px",
    padding: "0px",
    background: "linear-gradient(145deg, #f3f4f6, #e5e7eb)",
    backgroundImage: "",
    borderRadius: "2px",
    borderStyle: "none",
    borderWidth: "0px",
    borderColor: "#6366f1",
    boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.1)",
  });