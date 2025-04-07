 export interface ButtonPropertiesDefaults {
    fontFamily: string;
    fontWeight: string | number;
    fontSize: string;
    lineHeight: string;
    color: string;
    textAlign: "left" | "center" | "right";
    textDecoration: "none" | "underline" | "overline" | "line-through";
    backgroundColor: string;
    borderRadius: string;
    borderStyle: "none" | "solid" | "dashed" | "dotted";
    borderWidth: string;
    borderColor: string;
  }
export const getButtonPropertiesDefaults = (): ButtonPropertiesDefaults=> ({
    fontFamily: "Arial, sans-serif",
    fontWeight: "50",
    fontSize: "10px",
    lineHeight: "10px",
    color: "black",
    textAlign: "center",
    textDecoration: "none",
    backgroundColor: "gray",
    borderRadius: "0px",
    borderStyle: "solid",
    borderWidth: "0px",
    borderColor: "white",
  });
  
