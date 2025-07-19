"use client";

import React, { useRef, useLayoutEffect, useState, useEffect } from "react";
import { inputRecipe, sizeVariants, InputColorVariant } from "./input.css";

export type InputSize = keyof typeof sizeVariants;
export type InputVariant = InputColorVariant;

type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> & {
  size?: InputSize;
  variant?: InputVariant;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
};

export const Input: React.FC<InputProps> = ({ size = "md", variant = "gray-50", iconLeft, iconRight, className, style, ...rest }) => {
  const leftRef = useRef<HTMLSpanElement>(null);
  const rightRef = useRef<HTMLSpanElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [leftWidth, setLeftWidth] = useState(0);
  const [rightWidth, setRightWidth] = useState(0);
  const iconGap = 8;
  const basePadding = 14;

  useLayoutEffect(() => {
    if (leftRef.current) setLeftWidth(leftRef.current.offsetWidth);
    if (rightRef.current) setRightWidth(rightRef.current.offsetWidth);
  }, [iconLeft, iconRight]);

  const divStyle = {
    position: "relative" as const,
    display: "flex",
    alignItems: "center",
  };

  return (
    <div style={divStyle} className={className}>
      {iconLeft && (
        <span
          ref={leftRef}
          style={{
            position: "absolute",
            left: 12,
            top: "50%",
            transform: "translateY(-50%)",
            pointerEvents: "none",
            display: "inline-flex",
            alignItems: "center",
          }}
        >
          {iconLeft}
        </span>
      )}
      <input
        ref={inputRef}
        className={inputRecipe({ size, variant })}
        style={{
          flex: 1,
          paddingLeft: iconLeft ? leftWidth + 12 + iconGap : basePadding,
          paddingRight: iconRight ? rightWidth + 12 + iconGap : basePadding,
          ...style,
        }}
        {...rest}
      />
      {iconRight && (
        <span
          ref={rightRef}
          style={{
            position: "absolute",
            right: 12,
            top: "50%",
            transform: "translateY(-50%)",
            pointerEvents: "none",
            display: "inline-flex",
            alignItems: "center",
          }}
        >
          {iconRight}
        </span>
      )}
    </div>
  );
};

export const Field: React.FC<{ label: string; children: React.ReactNode; className?: string; style?: React.CSSProperties }> = ({ label, children, className, style }) => (
  <div className={className} style={{ display: "flex", flexDirection: "column", gap: 6, ...style }}>
    <label
      style={{
        color: "var(--Gray-700, #414651)",
        fontFamily: "Pretendard",
        fontSize: 14,
        fontStyle: "normal",
        fontWeight: 500,
        lineHeight: "20px",
        marginBottom: 2,
      }}
    >
      {label}
    </label>
    {children}
  </div>
);
