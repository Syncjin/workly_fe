import React from "react";
import CheckBox from "./index";
import { fieldWrapper, descriptionStyle } from "./checkboxField.css";

interface CheckBoxFieldProps extends Omit<React.ComponentProps<typeof CheckBox>, "label"> {
  label?: React.ReactNode;
  description?: React.ReactNode;
  size?: "sm" | "md" | "lg";
}

const sizeToMargin: Record<"sm" | "md" | "lg", number> = {
  sm: 16,
  md: 20,
  lg: 24,
};

const CheckBoxField: React.FC<CheckBoxFieldProps> = ({ label, description, size = "md", ...props }) => (
  <div className={fieldWrapper}>
    <label
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        cursor: props.disabled ? "not-allowed" : "pointer",
      }}
    >
      <CheckBox size={size} {...props} />
      {label && <span style={{ userSelect: "none" }}>{label}</span>}
    </label>
    {description && (
      <div className={descriptionStyle} style={{ marginLeft: sizeToMargin[size] + 8 }}>
        {description}
      </div>
    )}
  </div>
);

export default CheckBoxField;
