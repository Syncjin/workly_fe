import React from "react";
import { radioBase, radioChecked, radioContainer, radioDot, radioSize } from "./radio.css";

interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  size?: "sm" | "md" | "lg";
  checked?: boolean;
  defaultChecked?: boolean;
}

const dotSizeMap = {
  sm: 8,
  md: 10,
  lg: 12,
};

export const Radio: React.FC<RadioProps> = ({ size = "md", checked, defaultChecked, className, style, disabled, ...rest }) => {
  const isControlled = checked !== undefined;
  const boxSize = size === "sm" ? 16 : size === "lg" ? 24 : 20;
  const dotSize = dotSizeMap[size];
  const isChecked = isControlled ? checked : defaultChecked;
  return (
    <span className={radioContainer} style={{ width: boxSize, height: boxSize }}>
      <input
        type="radio"
        className={[radioBase, radioSize[size], isChecked ? radioChecked : "", className].filter(Boolean).join(" ")}
        style={{
          ...style,
          width: boxSize,
          height: boxSize,
          margin: 0,
          padding: 0,
        }}
        {...(isControlled ? { checked, onChange: rest.onChange } : { defaultChecked })}
        disabled={disabled}
        {...rest}
      />
      {isChecked && (
        <span
          className={radioDot}
          style={{
            width: dotSize,
            height: dotSize,
            background: disabled ? "var(--color-gray-200)" : "var(--color-brand-600)",
          }}
        />
      )}
    </span>
  );
};

