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
  unstyled?: boolean;
};

export const Button: React.FC<ButtonProps> = ({ size = "md", variant = "solid", color = "brand-600", loading = false, loadingIcon, loadingPosition = "end", unstyled, children, className, ...rest }) => {
  const spinner = loading && loadingIcon ? <>{loadingIcon}</> : null;
  const showLeft = !!(spinner && loadingPosition === "start");
  const showRight = !!(spinner && loadingPosition === "end");

  const isDisabled = loading || rest.disabled;

  const cls = unstyled ? className : [styles.buttonRecipe({ variant, size, color }), className].filter(Boolean).join(" ");

  return (
    <button className={cls} disabled={isDisabled} aria-busy={loading || undefined} aria-disabled={isDisabled || undefined} {...rest}>
      {loading && loadingPosition === "overlay" && spinner && <span className={styles.overlay}>{spinner}</span>}

      {showLeft && (
        <span className={styles.iconSlot} aria-hidden>
          {spinner}
        </span>
      )}

      <span className={unstyled ? undefined : styles.label}>{loading && loadingPosition === "replace" && spinner ? spinner : children}</span>

      {showRight && (
        <span className={styles.iconSlot} aria-hidden>
          {spinner}
        </span>
      )}
    </button>
  );
};
