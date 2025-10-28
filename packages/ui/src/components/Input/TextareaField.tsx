import React from "react";
import InputHint from "../InputHint";
import { Textarea, TextareaSize } from "./Textarea";
import { descriptionStyle, fieldWrapper, labelStyle } from "./inputField.css";

interface TextareaFieldProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "size"> {
  size?: TextareaSize;
  variant?: string;
  label?: React.ReactNode;
  description?: React.ReactNode;
  errorText?: React.ReactNode;
  helperText?: React.ReactNode;
  successText?: React.ReactNode;
  status?: "default" | "success" | "error";
}

export const TextareaField: React.FC<TextareaFieldProps> = ({ label, description, errorText, helperText, successText, status = "default", size, variant, ...textareaProps }) => {
  return (
    <div className={fieldWrapper}>
      {label && <label className={labelStyle}>{label}</label>}
      <Textarea status={status} size={size} variant={variant} {...textareaProps} />
      {description && <div className={descriptionStyle}>{description}</div>}
      {status === "error" && errorText && <InputHint variant="error">{errorText}</InputHint>}
      {status === "success" && successText && <InputHint variant="success">{successText}</InputHint>}
      {helperText && <InputHint variant="default">{helperText}</InputHint>}
    </div>
  );
};
