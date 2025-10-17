"use client";

import React, { useEffect, useRef } from "react";
import Icon from "../Icon";
import { checkboxBase, checkboxChecked, checkboxContainer, checkboxIconWrapper, checkboxSize } from "./checkbox.css";

interface CheckBoxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  size?: "sm" | "md" | "lg";
  checked?: boolean;
  indeterminate?: boolean;
  defaultChecked?: boolean;
}

export const CheckBox: React.FC<CheckBoxProps> = ({ size = "md", checked, indeterminate = false, defaultChecked, className, style, ...rest }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const isControlled = checked !== undefined;
  const iconSize = size === "sm" ? { width: 12, height: 12 } : size === "lg" ? { width: 20, height: 20 } : { width: 16, height: 16 };
  const boxSize = size === "sm" ? 16 : size === "lg" ? 24 : 20;
  const isChecked = isControlled ? checked : defaultChecked;

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);
  return (
    <span className={checkboxContainer} style={{ width: boxSize, height: boxSize }}>
      <input
        ref={inputRef}
        type="checkbox"
        className={[checkboxBase, checkboxSize[size], isChecked || indeterminate ? checkboxChecked : "", className].filter(Boolean).join(" ")}
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
      {(isChecked || indeterminate) && (
        <span className={checkboxIconWrapper}>
          <Icon name={indeterminate ? "checkbox-indeterminate-line" : "check-line"} size={iconSize} color="brand-600" />
        </span>
      )}
    </span>
  );
};
