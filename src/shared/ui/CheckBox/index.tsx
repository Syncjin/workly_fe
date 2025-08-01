import React from "react";
import { checkboxBase, checkboxSize, checkboxChecked, checkboxContainer, checkboxIconWrapper } from "./checkbox.css";
import Icon from "@/shared/ui/Icon";

interface CheckBoxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  size?: "sm" | "md" | "lg";
  checked?: boolean;
  defaultChecked?: boolean;
}

const CheckBox: React.FC<CheckBoxProps> = ({ size = "md", checked, defaultChecked, className, style, ...rest }) => {
  const isControlled = checked !== undefined;
  const iconSize = size === "sm" ? 12 : size === "lg" ? 20 : 16;
  const boxSize = size === "sm" ? 16 : size === "lg" ? 24 : 20;
  const isChecked = isControlled ? checked : defaultChecked;
  return (
    <span className={checkboxContainer} style={{ width: boxSize, height: boxSize }}>
      <input
        type="checkbox"
        className={[checkboxBase, checkboxSize[size], isChecked ? checkboxChecked : "", className].filter(Boolean).join(" ")}
        style={{
          ...style,
          width: boxSize,
          height: boxSize,
          margin: 0,
          padding: 0,
        }}
        {...(isControlled ? { checked, onChange: rest.onChange } : { defaultChecked })}
        {...rest}
      />
      {isChecked && (
        <span className={checkboxIconWrapper}>
          <Icon name="check-line" size={iconSize} color="brand-600" />
        </span>
      )}
    </span>
  );
};

export default CheckBox;
