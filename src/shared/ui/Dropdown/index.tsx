import React, { createContext, useContext, useRef, useState } from "react";
import * as styles from "./dropdown.css";
import { useClickOutside } from "@/hooks/useClickOutside";

interface DropdownProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface DropdownContextValue {
  open: boolean;
  toggle: () => void;
  close: () => void;
}

const DropdownContext = createContext<DropdownContextValue | null>(null);

const Dropdown = ({ children, open: controlledOpen, onOpenChange }: DropdownProps) => {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const setOpen = (value: boolean) => {
    if (isControlled) {
      onOpenChange?.(value);
    } else {
      setUncontrolledOpen(value);
    }
  };

  const toggle = () => setOpen(!open);
  const close = () => setOpen(false);

  const containerRef = useRef<HTMLDivElement>(null);
  useClickOutside(containerRef, close);

  return (
    <DropdownContext.Provider value={{ open, toggle, close }}>
      <div className={styles.dropdownContainer} ref={containerRef}>
        {children}
      </div>
    </DropdownContext.Provider>
  );
};

const Trigger = ({ children }: { children: React.ReactNode }) => {
  const context = useContext(DropdownContext);
  if (!context) throw new Error("Dropdown.Trigger 필수");

  return <div onClick={context.toggle}>{children}</div>;
};

const Menu = ({ children }: { children: React.ReactNode }) => {
  const context = useContext(DropdownContext);
  if (!context || !context.open) return null;

  return <div className={styles.dropdownMenu}>{children}</div>;
};

interface HeaderProps {
  children: React.ReactNode;
}

const Header = ({ children }: HeaderProps) => {
  return <div className={styles.headerStyle}>{children}</div>;
};

const Line = () => {
  return <div className={styles.lineStyle} />;
};

interface ItemProps {
  icon?: React.ReactNode;
  text?: string;
  onClick?: () => void;
  children?: React.ReactNode;
  closeOnClick?: boolean;
}

const Item = ({ icon, text, onClick, children, closeOnClick = true }: ItemProps) => {
  const context = useContext(DropdownContext);
  const handleClick = () => {
    onClick?.();
    if (closeOnClick) {
      context?.close();
    }
  };

  return (
    <div className={styles.dropdownItem} onClick={handleClick}>
      {icon && <span className={styles.iconStyle}>{icon}</span>}
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

export default Dropdown;
