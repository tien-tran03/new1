export interface ColumnPropertiesDefaults {
  columnCount: number;
  gap: string;
  padding: string;
  margin: string;
  backgroundColor: string;
  border: string;
  justifyContent: string;
  alignItems: string;
}

export const getColumnPropertiesDefaults = (): ColumnPropertiesDefaults => ({
  columnCount: 1,
  gap: "10px",
  padding: "0px",
  margin: "0px",
  backgroundColor: "transparent",
  border: "none",
  justifyContent: "flex-start",
  alignItems: "stretch",
});