export interface DropdownPropertiesDefaults {
    fontFamily: string; 
    fontSize: string; 
    fontWeight: string | number; 
    color: string; 
    backgroundColor: string; 
    borderWidth: string; 
    borderColor: string; 
    borderStyle: "none" | "solid" | "dashed" | "dotted"; 
    borderRadius: string; 
    padding: string; 
    width: string; 
    height: string; 
    optionHoverColor: string; 
    placeholderColor: string; 
    arrowColor: string; 
}

export const getDropdownPropertiesDefaults = (): DropdownPropertiesDefaults => ({
    fontFamily: "Helvetica, sans-serif",
    fontSize: "16px",
    fontWeight: "normal",
    color: "#000000",
    backgroundColor: "#ffffff",
    borderWidth: "1px",
    borderColor: "#d1d1d1",
    borderStyle: "solid",
    borderRadius: "5px",
    padding: "10px",
    width: "250px",
    height: "auto",
    optionHoverColor: "#e6f3ff",
    placeholderColor: "#999999",
    arrowColor: "#666666"
});