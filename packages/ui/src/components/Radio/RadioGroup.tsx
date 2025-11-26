import React from "react";

import { Radio } from "./Radio";

interface RadioOption {
  label: React.ReactNode;
  value: string;
  disabled?: boolean;
}

interface RadioGroupProps {
  options: RadioOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  name?: string;
  size?: "sm" | "md" | "lg";
  direction?: "row" | "column";
  label?: React.ReactNode;
  description?: React.ReactNode;
  errorText?: React.ReactNode;
  helperText?: React.ReactNode;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({ options, value, defaultValue, onChange, name, size = "md", direction = "column", label, description, errorText, helperText, disabled = false, className, style }) => {
  const isControlled = value !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue);
  const groupValue = isControlled ? value : uncontrolledValue;

  const handleChange = (val: string) => {
    if (!isControlled) setUncontrolledValue(val);
    onChange?.(val);
  };

  return (
    <div className={className} style={{ ...style, display: "flex", flexDirection: "column", gap: 6 }}>
      {label && (
        <label
          style={{
            fontWeight: 500,
            fontSize: 14,
            color: "var(--color-gray-900)",
            lineHeight: "20px",
          }}
        >
          {label}
        </label>
      )}
      {description && (
        <div
          style={{
            fontSize: 12,
            color: "var(--color-gray-600)",
            lineHeight: "16px",
          }}
        >
          {description}
        </div>
      )}
      <div
        style={{
          display: "flex",
          flexDirection: direction,
          gap: direction === "row" ? 24 : 8,
        }}
      >
        {options.map((opt) => (
          <label
            key={String(opt.value)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              cursor: disabled || opt.disabled ? "not-allowed" : "pointer",
            }}
          >
            <Radio name={name} size={size} checked={groupValue === opt.value} disabled={disabled || opt.disabled} onChange={() => handleChange(opt.value)} />
            <span
              style={{
                userSelect: "none",
                color: disabled || opt.disabled ? "var(--color-gray-400)" : "var(--color-gray-900)",
              }}
            >
              {opt.label}
            </span>
          </label>
        ))}
      </div>
      {errorText && (
        <div
          style={{
            color: "var(--color-error-600)",
            fontSize: 12,
            lineHeight: "16px",
          }}
        >
          {errorText}
        </div>
      )}
      {!errorText && helperText && (
        <div
          style={{
            color: "var(--color-gray-500)",
            fontSize: 12,
            lineHeight: "16px",
          }}
        >
          {helperText}
        </div>
      )}
    </div>
  );
};
