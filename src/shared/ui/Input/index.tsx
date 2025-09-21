"use client";

import React, { useLayoutEffect, useRef, useState } from "react";
import { InputColorVariant, inputRecipe, sizeVariants } from "./input.css";

export type InputSize = keyof typeof sizeVariants;
export type InputVariant = InputColorVariant;

export type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> & {
  size?: InputSize;
  variant?: InputVariant;
  left?: React.ReactNode;
  right?: React.ReactNode;
  lefttOffset?: number;
  rightOffset?: number;
  status?: "default" | "success" | "error";
};

export const Input: React.FC<InputProps> = ({ size = "md", variant = "gray-50", left, right, lefttOffset, rightOffset, className, style, status = "default", ...rest }) => {
  const leftRef = useRef<HTMLSpanElement>(null);
  const rightRef = useRef<HTMLSpanElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [leftWidth, setLeftWidth] = useState(0);
  const [rightWidth, setRightWidth] = useState(0);

  const SIDE_OFFSET = 12;
  const GAP = 8;
  const BASE_PADDING = 14;

  useLayoutEffect(() => {
    const update = () => {
      setLeftWidth(leftRef.current?.offsetWidth ?? 0);
      setRightWidth(rightRef.current?.offsetWidth ?? 0);
    };
    update();

    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(update) : null;
    if (ro) {
      if (leftRef.current) ro.observe(leftRef.current);
      if (rightRef.current) ro.observe(rightRef.current);
    }
    return () => ro?.disconnect();
  }, [left, right]);

  const wrapperStyle: React.CSSProperties = {
    position: "relative",
    display: "flex",
    alignItems: "center",
  };

  const commonSlotStyle: React.CSSProperties = {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    // 클릭 가능해야 하므로 pointerEvents 설정 없음 (auto)
    display: "inline-flex",
    alignItems: "center",
  };

  const LEFT_OFFSET = lefttOffset ? lefttOffset : SIDE_OFFSET;
  const RIGHT_OFFSET = rightOffset ? rightOffset : SIDE_OFFSET;
  return (
    <div style={wrapperStyle} className={className}>
      {left && (
        <span
          ref={leftRef}
          style={{
            ...commonSlotStyle,
            left: LEFT_OFFSET,
          }}
        >
          {left}
        </span>
      )}
      <input
        ref={inputRef}
        className={inputRecipe({ size, variant, status })}
        style={{
          flex: 1,
          paddingLeft: left ? leftWidth + LEFT_OFFSET + GAP : BASE_PADDING,
          paddingRight: right ? rightWidth + RIGHT_OFFSET + GAP : BASE_PADDING,
          ...style,
        }}
        {...rest}
      />
      {right && (
        <span
          ref={rightRef}
          style={{
            ...commonSlotStyle,
            right: RIGHT_OFFSET,
          }}
        >
          {right}
        </span>
      )}
    </div>
  );
};
