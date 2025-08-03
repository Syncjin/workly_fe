import Icon from "@/shared/ui/Icon";
import React from "react";
import { checkboxBase, checkboxChecked, checkboxContainer, checkboxIconWrapper, checkboxSize } from "./checkbox.css";

interface CheckBoxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  size?: "sm" | "md" | "lg";
  checked?: boolean;
  defaultChecked?: boolean;
}

const CheckBox: React.FC<CheckBoxProps> = ({ size = "md", checked, defaultChecked, className, style, ...rest }) => {
  const isControlled = checked !== undefined;
  const iconSize = size === "sm" ? { widht: 12, height: 12 } : size === "lg" ? { widht: 20, height: 20 } : { widht: 16, height: 16 };
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
