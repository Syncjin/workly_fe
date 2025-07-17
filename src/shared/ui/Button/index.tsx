"use client";

import React from "react";
import { buttonRecipe, sizeVariants, ButtonColorVariant } from "./button.css";

type ButtonSize = keyof typeof sizeVariants;
type ButtonVariant = ButtonColorVariant;
type ButtonTextColor = ButtonColorVariant;

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: ButtonSize;
  variant?: ButtonVariant;
  textColor?: ButtonTextColor;
};

const Button: React.FC<ButtonProps> = ({ size = "md", variant = "brand-500", textColor = "gray-900", children, ...rest }) => {
  return (
    <button className={buttonRecipe({ size, variant, textColor })} {...rest}>
      {children}
    </button>
  );
};

export default Button;
