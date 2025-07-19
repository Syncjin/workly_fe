import React from "react";
import { fieldLabel } from "./field.css";

export const Field: React.FC<{ label: string; children: React.ReactNode; className?: string; style?: React.CSSProperties }> = ({ label, children, className, style }) => (
  <div className={className} style={{ display: "flex", flexDirection: "column", gap: 6, ...style }}>
    <label className={fieldLabel}>{label}</label>
    {children}
  </div>
);
