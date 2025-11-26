"use client";
import { createContext, useContext } from "react";

import type { PopupClassNames, PopupVariant } from "./types";

export interface PopupContextValue {
  isOpen: boolean;
  onClose?: () => void;
  variant: PopupVariant;
  loading: boolean;
  classes?: PopupClassNames;

  getPopupElement(): HTMLDivElement | null;
  getOverlayElement(): HTMLDivElement | null;
  getPopupRect(): DOMRect | null;
  getFocusableElements(): HTMLElement[];
}

const PopupContext = createContext<PopupContextValue | null>(null);
export const PopupProvider = PopupContext.Provider;

export const usePopupRef = () => {
  const ctx = useContext(PopupContext);
  if (!ctx) throw new Error("usePopupRef must be used within Popup");
  return {
    getPopupElement: ctx.getPopupElement.bind(ctx),
    getOverlayElement: ctx.getOverlayElement.bind(ctx),
    getPopupRect: ctx.getPopupRect.bind(ctx),
    getFocusableElements: ctx.getFocusableElements.bind(ctx),
  };
};

export default PopupContext;
