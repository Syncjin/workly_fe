"use client";

import React, { useRef } from "react";
import { baseTextarea, textareaStatus } from "./textarea.css";

export type TextareaSize = "sm" | "md" | "lg" | "xl";
export type TextareaVariant = string;

interface TextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "size"> {
  size?: TextareaSize;
  variant?: TextareaVariant;
  status?: "default" | "success" | "error";
  className?: string;
  style?: React.CSSProperties;
}

const Textarea: React.FC<TextareaProps> = ({ size = "md", variant = "gray-50", status = "default", className, style, ...rest }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  return <textarea ref={textareaRef} className={[baseTextarea, textareaStatus[status], className].filter(Boolean).join(" ")} style={style} {...rest} />;
};

export default Textarea;
