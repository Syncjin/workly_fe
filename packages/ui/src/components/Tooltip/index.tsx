"use client";

import React, { useEffect, useRef, useState } from "react";
import * as styles from "./tooltip.css";

interface TooltipProps {
  content: string;
  children: React.ReactElement;
  position?: "top" | "right" | "bottom" | "left";
  delay?: number;
}

export const Tooltip: React.FC<TooltipProps> = ({ content, children, position = "right", delay = 500 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldShow, setShouldShow] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setShouldShow(true);
      setIsVisible(true);
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setShouldShow(false);
    setIsVisible(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      hideTooltip();
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const trigger = React.cloneElement(children, {
    onMouseEnter: showTooltip,
    onMouseLeave: hideTooltip,
    onFocus: showTooltip,
    onBlur: hideTooltip,
    onKeyDown: handleKeyDown,
    "aria-describedby": shouldShow ? "tooltip" : undefined,
  } as any);

  return (
    <div className={styles.container}>
      {trigger}
      {shouldShow && (
        <div id="tooltip" role="tooltip" className={`${styles.tooltip} ${styles.tooltipPosition[position]}`} data-visible={isVisible}>
          {content}
          <div className={`${styles.arrow} ${styles.arrowPosition[position]}`} />
        </div>
      )}
    </div>
  );
};

export default Tooltip;
