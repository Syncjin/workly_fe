"use client";

import React from "react";
import { inputRecipe, sizeVariants, InputColorVariant } from "./input.css";

export type InputSize = keyof typeof sizeVariants;
export type InputVariant = InputColorVariant;

type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> & {
  size?: InputSize;
  variant?: InputVariant;
};

const Input: React.FC<InputProps> = ({ size = "md", variant = "gray-50", ...rest }) => {
  return <input className={inputRecipe({ size, variant })} {...rest} />;
};

export default Input;
