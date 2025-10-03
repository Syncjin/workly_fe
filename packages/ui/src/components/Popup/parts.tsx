"use client";

import { FC, ReactNode, useContext } from "react";
import { cx } from "../../theme/classes";
import PopupContext from "./context";
import * as styles from "./popup.css";

export const Content: React.FC<{ className?: string; children: ReactNode }> = ({ className, children }) => {
  const ctx = useContext(PopupContext);
  if (!ctx) throw new Error("Popup.Content must be used within Popup");
  if (ctx.loading) {
    return (
      <div className={cx(styles.loadingContainer, ctx.classes?.loading, className)}>
        <div className={styles.spinner} />
      </div>
    );
  }
  return <div className={className}>{children}</div>;
};

export const Header: FC<{ className?: string; children: ReactNode }> = ({ className, children }) => (
  <div className={cx(styles.header, className)} data-slot="header">
    {children}
  </div>
);

export const Body: FC<{ className?: string; children: ReactNode }> = ({ className, children }) => (
  <div className={cx(styles.body, className)} data-slot="body">
    {children}
  </div>
);

export const Footer: FC<{ className?: string; children: ReactNode }> = ({ className, children }) => (
  <div className={cx(styles.footer, className)} data-slot="footer">
    {children}
  </div>
);
