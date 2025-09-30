import React from "react";
import InputHint from "../InputHint";
import { Input, InputProps } from "./Input";
import { descriptionStyle, fieldWrapper, labelStyle } from "./inputField.css";

interface InputFieldProps extends Omit<InputProps, "status"> {
  label?: React.ReactNode;
  description?: React.ReactNode;
  errorText?: React.ReactNode;
  helperText?: React.ReactNode;
  successText?: React.ReactNode;
  status?: "default" | "success" | "error";
}

export const InputField: React.FC<InputFieldProps> = ({ label, description, errorText, helperText, successText, status = "default", ...inputProps }) => {
  return (
    <div className={fieldWrapper}>
      {label && <label className={labelStyle}>{label}</label>}
      <Input status={status} {...inputProps} />
      {description && <div className={descriptionStyle}>{description}</div>}
      {status === "error" && errorText && <InputHint variant="error">{errorText}</InputHint>}
      {status === "success" && successText && <InputHint variant="success">{successText}</InputHint>}
      {helperText && <InputHint variant="default">{helperText}</InputHint>}
    </div>
  );
};