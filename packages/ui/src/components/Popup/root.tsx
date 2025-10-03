"use client";

import { FC, useCallback, useEffect, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import { cx } from "../../theme/classes";
import { PopupProvider } from "./context";
import { useEscapeClose, useFocusTrap, useOutsideClose, usePortalContainer, useVisibility } from "./hooks";
import * as styles from "./popup.css";
import { useImperativePopupRef } from "./ref";
import type { PopupPosition, PopupProps, PopupSize, PopupVariant } from "./types";

const PopupRoot: FC<PopupProps> = (props) => {
  const {
    open,
    onClose,
    variant = "modal",
    size = "md",
    position = "center",
    closeOnOutsideClick = true,
    closeOnEscape = true,
    trapFocus = variant === "modal",
    onOpen,
    onSuccess,
    onError,
    loading = false,
    ariaLabel,
    ariaLabelledBy,
    ariaDescribedBy,
    className,
    classes,
    animationDuration = 200,
    ref,
    children,
  } = props;

  const popupRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const getPopup = useCallback(() => popupRef.current, []);
  const getOverlay = useCallback(() => overlayRef.current, []);
  const getRect = useCallback(() => popupRef.current?.getBoundingClientRect() ?? null, []);
  const getFocusable = useCallback(() => {
    const el = popupRef.current;
    if (!el) return [];
    return Array.from(
      el.querySelectorAll(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled])'
      )
    ) as HTMLElement[];
  }, []);

  // 외부 ref + 내부 ref 동기화
  const handleRefCallback = useImperativePopupRef(
    ref,
    getPopup,
    getOverlay,
    getFocusable,
    (node) => { popupRef.current = node; }
  );

  const portal = usePortalContainer();
  useEscapeClose(closeOnEscape && open, onClose);
  useOutsideClose(popupRef, overlayRef, closeOnOutsideClick && open, onClose);
  useFocusTrap(open, trapFocus, popupRef);

  useEffect(() => {
    if (!open || !onOpen) return;
    (async () => {
      try {
        const r = await onOpen();
        onSuccess?.(r);
      } catch (e) {
        onError?.(e as Error);
      }
    })();
  }, [open, onOpen, onSuccess, onError]);

  const visible = useVisibility(open, animationDuration);

  const ctxValue = useMemo(
    () => ({
      isOpen: open,
      onClose,
      variant: variant as PopupVariant,
      loading,
      classes,
      getPopupElement: getPopup,
      getOverlayElement: getOverlay,
      getPopupRect: getRect,
      getFocusableElements: getFocusable,
    }),
    [open, onClose, variant, loading, classes, getPopup, getOverlay, getRect, getFocusable]
  );

  if (!visible || !portal) return null;

  const overlayClasses = cx(
    styles.overlay({ variant: variant as PopupVariant }),
    classes?.overlay,
    variant === "modal" ? className : undefined
  );

  const popupClasses = cx(
    styles.popupRecipe({
      variant: variant as PopupVariant,
      size: size as PopupSize,
      position: position as PopupPosition,
      state: open ? "open" : "closed",
    }),
    classes?.content,
    variant !== "modal" ? className : undefined
  );

  const role = variant === "modal" ? "dialog" : variant === "tooltip" ? "tooltip" : "menu";

  return createPortal(
    <PopupProvider value={ctxValue}>
      <div
        ref={overlayRef}
        className={overlayClasses}
        data-slot="overlay"
        onClick={(e) => {
          if (e.target === e.currentTarget && closeOnOutsideClick) onClose?.();
        }}
      >
        <div
          ref={handleRefCallback}
          className={popupClasses}
          role={role}
          aria-modal={variant === "modal" ? true : undefined}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          aria-describedby={ariaDescribedBy}
          data-slot="popup"
          style={{ animationDuration: `${animationDuration}ms` }}
        >
          {children}
        </div>
      </div>
    </PopupProvider>,
    portal
  );
};

export default PopupRoot;
