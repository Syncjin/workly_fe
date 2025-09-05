"use client";

import React from "react";
import * as styles from "./button.css";

type ButtonSize = keyof typeof styles.sizeVariants;

export type { ButtonSize };

type LoadingPosition = "start" | "end" | "replace" | "overlay";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: ButtonSize;
  variant?: styles.ButtonVariant;
  color?: styles.ButtonColor;
  loading?: boolean;
  loadingIcon?: React.ReactNode;
  loadingPosition?: LoadingPosition;
};

export const Button: React.FC<ButtonProps> = ({ size = "md", variant = "solid", color = "brand-600", loading = false, loadingIcon, loadingPosition = "end", children, className, ...rest }) => {

  const resolvedSpinner =
    loading && loadingIcon ? (
      <>{loadingIcon}</>
    ) : null;

  const isDisabled = loading || rest.disabled;

  return (
    <button
      className={[styles.buttonRecipe({ size, variant, color }), className].filter(Boolean).join(" ")}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      aria-disabled={isDisabled || undefined}
      {...rest}
    >
      {loading && loadingPosition === "overlay" && resolvedSpinner && (
        <span className={styles.overlay}>{resolvedSpinner}</span>
      )}
      <span className={styles.iconSlot} aria-hidden>
        {loading && loadingPosition === "start" ? resolvedSpinner : null}
      </span>
      <span className={styles.label}>
        {loading && loadingPosition === "replace" && resolvedSpinner
          ? resolvedSpinner
          : children}
      </span>
      <span className={styles.iconSlot} aria-hidden>
        {loading && loadingPosition === "end" ? resolvedSpinner : null}
      </span>
    </button>
  );
};
