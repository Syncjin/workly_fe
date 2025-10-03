import React from "react";

export type PopupPosition = "top" | "bottom" | "left" | "right" | "center";
export type PopupVariant = "modal" | "tooltip" | "dropdown";
export type PopupSize = "sm" | "md" | "lg" | "xl" | "auto";

export type PopupClassNames = {
  root?: string;
  overlay?: string;
  content?: string;
  loading?: string;
};

export interface PopupRefMethods {
  getElement(): HTMLDivElement | null;
  getOverlay(): HTMLDivElement | null;
  getRect(): DOMRect | null;
  focus(): void;
  getFocusableElements(): HTMLElement[];
  focusFirstElement(): void;
  focusLastElement(): void;
  scrollIntoView(options?: ScrollIntoViewOptions): void;
}

export interface PopupProps {
  /** 외부 제어 */
  open: boolean;
  onClose?: () => void;

  /** 스타일 변형 */
  variant?: PopupVariant;
  size?: PopupSize;
  position?: PopupPosition;

  /** 동작 제어 */
  closeOnOutsideClick?: boolean;
  closeOnEscape?: boolean;
  trapFocus?: boolean;

  /** 비동기 라이프사이클 */
  onOpen?: () => void | Promise<void>;
  onSuccess?: (result?: unknown) => void;
  onError?: (error: Error) => void;
  loading?: boolean;

  /** 접근성 */
  ariaLabel?: string;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;

  className?: string;
  classes?: PopupClassNames;
  animationDuration?: number;
  ref?: React.Ref<PopupRefMethods>;
  children: React.ReactNode;
}