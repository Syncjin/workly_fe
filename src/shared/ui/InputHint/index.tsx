import React from "react";
import { inputHintVariants } from "./inputHint.css";

type InputHintProps = {
  variant?: "default" | "success" | "error";
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

const InputHint: React.FC<InputHintProps> = ({ variant = "default", children, className, style }) => (
  <div className={[inputHintVariants[variant], className].filter(Boolean).join(" ")} style={style}>
    {children}
  </div>
);

export default InputHint;
