export const getRadioPropertiesDefaults = () => ({
  label: "Radio",
  name: "radio-group",
  value: "option1", // Thêm value mặc định
  checked: false,
  color: "#000000",
  fontSize: "16px",
  padding: "8px",
  margin: "0px",
  backgroundColor: "transparent",
  border: "1px solid #ccc",
});

export interface RadioPropertiesDefaults {
  label: string;
  name: string;
  value: string; // Đảm bảo value là bắt buộc
  checked: boolean;
  color: string;
  fontSize: string;
  padding: string;
  margin: string;
  backgroundColor: string;
  border: string;
}