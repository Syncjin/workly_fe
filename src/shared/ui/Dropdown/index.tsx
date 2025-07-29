import React, { useRef, useState } from "react";
import * as styles from "./dropdown.css";
import { useClickOutside } from "@/hooks/useClickOutside";

interface DropdownProps {
  children: React.ReactNode;
}

const DropdownContext = React.createContext<{
  open: boolean;
  toggle: () => void;
  close: () => void;
} | null>(null);

const Dropdown = ({ children }: DropdownProps) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggle = () => setOpen((prev) => !prev);
  const close = () => setOpen(false);

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
  const context = React.useContext(DropdownContext);
  if (!context) throw new Error("Dropdown.Trigger must be used within Dropdown");

  return <div onClick={context.toggle}>{children}</div>;
};

const Menu = ({ children }: { children: React.ReactNode }) => {
  const context = React.useContext(DropdownContext);
  if (!context) throw new Error("Dropdown.Menu must be used within Dropdown");

  if (!context.open) return null;

  return <div className={styles.dropdownMenu}>{children}</div>;
};

interface ItemProps {
  icon?: React.ReactNode;
  text: string;
  onClick?: () => void;
}

const Item = ({ icon, text, onClick }: ItemProps) => {
  const context = React.useContext(DropdownContext);
  const handleClick = () => {
    onClick?.();
    context?.close();
  };

  return (
    <div className={styles.dropdownItem} onClick={handleClick}>
      {icon && <span className={styles.iconStyle}>{icon}</span>}
      {text}
    </div>
  );
};

Dropdown.Trigger = Trigger;
Dropdown.Menu = Menu;
Dropdown.Item = Item;

export default Dropdown;
