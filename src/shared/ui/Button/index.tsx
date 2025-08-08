"use client";

import React from "react";
import { ButtonColor, buttonRecipe, ButtonVariant, sizeVariants } from "./button.css";

type ButtonSize = keyof typeof sizeVariants;

export type { ButtonSize };

type ButtonState = {
  forceHover?: boolean;
  forceFocus?: boolean;
  forceDisabled?: boolean;
};

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: ButtonSize;
  variant?: ButtonVariant;
  color?: ButtonColor;
};

export const Button: React.FC<ButtonProps & ButtonState> = ({ size = "md", variant = "solid", color = "brand-600", forceHover, forceFocus, forceDisabled, children, className, ...rest }) => {
  return (
    <button
      className={[buttonRecipe({ size, variant, color }), className].filter(Boolean).join(" ")}
      data-hover={forceHover || undefined}
      data-focus={forceFocus || undefined}
      data-focus-visible={forceFocus || undefined}
      data-disabled={forceDisabled || undefined}
      disabled={rest.disabled || forceDisabled}
      {...rest}
    >
      {children}
    </button>
  );
};
