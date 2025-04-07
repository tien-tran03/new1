export const getCheckboxPropertiesDefaults = () => ({
  label: "Option 1",
  value: "option1",
  name: "checkboxGroup",
  checked: false,
  disabled: false, // Thêm disabled
  color: "#000000",
  fontSize: "16px",
  padding: "8px",
  margin: "0px",
  backgroundColor: "transparent",
  border: "1px solid #ccc",
  hoverBackgroundColor: "transparent", 
  checkedBackgroundColor: "#e5e7eb", 
});

export interface CheckboxPropertiesDefaults {
  label: string;
  value: string;
  name: string;
  checked: boolean;
  disabled: boolean;
  color: string;
  fontSize: string;
  padding: string;
  margin: string;
  backgroundColor: string;
  border: string;
  hoverBackgroundColor: string;
  checkedBackgroundColor: string;
}