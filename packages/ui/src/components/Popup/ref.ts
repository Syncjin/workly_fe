"use client";

import { useCallback } from "react";

import type { PopupRefMethods } from "./types";

export function useImperativePopupRef(
  externalRef: React.Ref<PopupRefMethods> | undefined,
  getPopup: () => HTMLDivElement | null,
  getOverlay: () => HTMLDivElement | null,
  getFocusable: () => HTMLElement[],
  setInternalRef?: (node: HTMLDivElement | null) => void // ★ 추가
) {
  return useCallback(
    (instance: HTMLDivElement | null) => {
      setInternalRef?.(instance);

      const methods: PopupRefMethods = {
        getElement: getPopup,
        getOverlay: getOverlay,
        getRect: () => getPopup()?.getBoundingClientRect() ?? null,
        getFocusableElements: getFocusable,
        focus: () => getPopup()?.focus(),
        focusFirstElement: () => {
          const l = getFocusable();
          l[0]?.focus();
        },
        focusLastElement: () => {
          const l = getFocusable();
          l[l.length - 1]?.focus();
        },
        scrollIntoView: (opt) => getPopup()?.scrollIntoView(opt),
      };

      if (typeof externalRef === "function") {
        externalRef(instance ? methods : null);
      } else if (externalRef && typeof externalRef === "object") {
        (externalRef as unknown as { current: PopupRefMethods | null }).current = instance ? methods : null;
      }
    },
    [externalRef, setInternalRef, getPopup, getOverlay, getFocusable]
  );
}
