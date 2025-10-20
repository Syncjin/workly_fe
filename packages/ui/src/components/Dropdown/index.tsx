"use client";

import React, { createContext, useContext, useRef, useState } from "react";
import { useClickOutside } from "../../hooks";
import { cx } from "../../theme/classes";
import * as styles from "./dropdown.css";

export type DropdownClassNames = {
  root?: string;
  trigger?: string;
  menu?: string;
  item?: string;
  icon?: string;
  header?: string;
  line?: string;
};

interface DropdownProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  classes?: DropdownClassNames;
  className?: string;
  align: "start" | "end";
}

interface DropdownContextValue {
  open: boolean;
  toggle: () => void;
  close: () => void;
  classes?: DropdownClassNames;
  align: "start" | "end";
}

const DropdownContext = createContext<DropdownContextValue | null>(null);

export const Dropdown = ({ children, open: controlledOpen, onOpenChange, classes, className, align = "start" }: DropdownProps) => {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const setOpen = (v: boolean) => (isControlled ? onOpenChange?.(v) : setUncontrolledOpen(v));
  const toggle = () => setOpen(!open);
  const close = () => setOpen(false);

  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, close);

  return (
    <DropdownContext.Provider value={{ open, toggle, close, classes, align }}>
      <div className={cx(styles.dropdownContainer, classes?.root, className)} ref={ref} data-slot="root">
        {children}
      </div>
    </DropdownContext.Provider>
  );
};

const Trigger = ({ children, className, ...divProps }: React.HTMLAttributes<HTMLDivElement>) => {
  const ctx = useContext(DropdownContext);
  if (!ctx) throw new Error("Dropdown.Trigger 필수");
  return (
    <div
      {...divProps}
      className={cx(styles.triggerBase, ctx.classes?.trigger, className)}
      onClick={(e) => {
        divProps.onClick?.(e);
        ctx.toggle();
      }}
      data-slot="trigger"
      role="button"
      aria-haspopup="menu"
      aria-expanded={ctx.open}
    >
      {children}
    </div>
  );
};

const Menu = ({ children, className, ...divProps }: React.HTMLAttributes<HTMLDivElement>) => {
  const ctx = useContext(DropdownContext);
  if (!ctx?.open) return null;
  return (
    <div {...divProps} className={cx(styles.dropdownMenu, ctx.align === "end" && styles.menuAlignEnd, ctx.classes?.menu, className)} role="menu" data-slot="menu">
      {children}
    </div>
  );
};

const Header = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  const ctx = useContext(DropdownContext);
  return <div className={cx(styles.headerStyle, ctx?.classes?.header, className)}>{children}</div>;
};

const Line = ({ className }: { className?: string }) => {
  const ctx = useContext(DropdownContext);
  return <div className={cx(styles.lineStyle, ctx?.classes?.line, className)} />;
};

interface ItemProps {
  icon?: React.ReactNode;
  text?: string;
  onClick?: () => void;
  children?: React.ReactNode;
  closeOnClick?: boolean;
  className?: string;
}

const Item = ({ icon, text, onClick, children, closeOnClick = true, className }: ItemProps) => {
  const ctx = useContext(DropdownContext);
  const handleClick = () => {
    onClick?.();
    if (closeOnClick) ctx?.close();
  };
  return (
    <div className={cx(styles.dropdownItem, ctx?.classes?.item, className)} onClick={handleClick} role="menuitem">
      {icon && <span className={cx(styles.iconStyle, ctx?.classes?.icon)}>{icon}</span>}
      {text && <span>{text}</span>}
      {children}
    </div>
  );
};

Dropdown.Trigger = Trigger;
Dropdown.Menu = Menu;
Dropdown.Item = Item;
Dropdown.Header = Header;
Dropdown.Line = Line;

export const useDropdown = () => {
  const ctx = useContext(DropdownContext);
  if (!ctx) throw new Error("Dropdown.*는 <Dropdown> 내부에서만 사용하세요.");
  return ctx;
};
