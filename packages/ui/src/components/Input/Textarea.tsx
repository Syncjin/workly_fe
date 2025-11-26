"use client";

import React, { useRef } from "react";

import { cx } from "../../theme/classes";

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

export const Textarea: React.FC<TextareaProps> = ({ status = "default", className, style, ...rest }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  return <textarea ref={textareaRef} className={cx(baseTextarea, textareaStatus[status], className)} style={style} {...rest} />;
};
