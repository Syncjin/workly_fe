"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { useClickOutside } from "../../hooks";
import { cx } from "../../theme/classes";
import Icon from "../Icon";
import * as styles from "./select.css";

export interface OptionShape {
  value: string;
  text: string;
  subText?: string;
  icon?: React.ReactNode;
  dotColor?: string;
  avatar?: React.ReactNode;
  visualType?: "icon" | "dot" | "avatar";
}

export type SelectClassNames = {
  root?: string;
  trigger?: string;
  placeholder?: string;
  searchInput?: string;
  menu?: string;
  option?: string;
  optionContent?: string;
  leftVisual?: string;
  dot?: string;
  mainText?: string;
  subText?: string;
  empty?: string;
};

interface SelectProps {
  value?: string;
  onChange?: (value: OptionShape) => void;
  placeholder?: string;
  children?: React.ReactNode;
  options: OptionShape[];
  searchable?: boolean;
  classes?: SelectClassNames;
  className?: string;
}

interface SelectContextValue {
  selected?: OptionShape;
  onSelect: (value: string) => void;
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
  search: string;
  setSearch: (val: string) => void;
  filteredOptions: OptionShape[];
  searchable: boolean;
  placeholder?: string;
  classes?: SelectClassNames;
}

const SelectContext = createContext<SelectContextValue | null>(null);

const SelectRoot = ({ value, onChange, placeholder, children, options, searchable = false, classes, className }: SelectProps) => {
  const selected = options.find((opt) => opt.value === value);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const toggle = () => setOpen((prev) => !prev);
  const close = () => {
    setOpen(false);
    setSearch("");
  };

  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, () => {
    setOpen(false);
    setSearch("");
  });

  const onSelect = (val: string) => {
    const selectedOption = options.find((opt) => opt.value === val);
    if (selectedOption) {
      onChange?.(selectedOption);
      close();
    }
  };
  const filteredOptions = searchable ? options.filter((opt) => opt.text.toLowerCase().includes(search.toLowerCase())) : options;

  return (
    <SelectContext.Provider
      value={{
        selected,
        onSelect,
        isOpen: open,
        toggle,
        close,
        search,
        setSearch,
        filteredOptions,
        searchable,
        placeholder,
        classes,
      }}
    >
      <div className={cx(styles.selectContainer, classes?.root, className)} ref={ref} data-slot="root">
        {children ?? (
          <>
            <Trigger />
            <Menu />
          </>
        )}
      </div>
    </SelectContext.Provider>
  );
};

const Trigger: React.FC<{ className?: string; children?: React.ReactNode } & React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...divProps }) => {
  const ctx = useContext(SelectContext);
  if (!ctx) throw new Error("Select.Trigger 필수");
  const { selected, isOpen, toggle, search, setSearch, searchable, placeholder, classes } = ctx;

  return (
    <div
      {...divProps}
      className={cx(styles.trigger({ focused: isOpen }), classes?.trigger, className)}
      onClick={(e) => {
        divProps.onClick?.(e);
        toggle();
      }}
      data-slot="trigger"
      role="button"
      aria-haspopup="listbox"
      aria-expanded={isOpen}
    >
      {children ? (
        children
      ) : isOpen && searchable ? (
        <input type="text" placeholder={placeholder} value={search} onChange={(e) => setSearch(e.target.value)} className={cx(styles.searchInput, classes?.searchInput)} onClick={(e) => e.stopPropagation()} />
      ) : selected ? (
        <div className={cx(styles.optionContent({ visualType: selected.visualType }), classes?.optionContent)}>
          <div className={cx(styles.centerText)}>
            {renderLeftVisual(selected, classes)}
            <span className={cx(styles.mainText, classes?.mainText)}>{selected.text}</span>
            {selected.subText && <span className={cx(styles.subText, classes?.subText)}>{selected.subText}</span>}
          </div>
        </div>
      ) : (
        <span className={cx(styles.placeholder, classes?.placeholder)}>{placeholder}</span>
      )}
      {!children && <Icon name={isOpen ? "arrow-up-s-line" : "arrow-down-s-line"} size={{ width: 20, height: 20 }} color="gray-500" />}
    </div>
  );
};

const Menu: React.FC<{ className?: string } & React.HTMLAttributes<HTMLDivElement>> = ({ className, ...divProps }) => {
  const ctx = useContext(SelectContext);
  const menuRef = useRef<HTMLDivElement>(null);

  // 메뉴 위치 자동 조정 - Hook은 항상 최상단에서 호출
  useEffect(() => {
    if (!ctx?.isOpen || !menuRef.current) return;

    const menu = menuRef.current;
    const rect = menu.getBoundingClientRect();
    const viewportWidth = window.innerWidth;

    // 오른쪽으로 벗어나는 경우
    if (rect.right > viewportWidth) {
      menu.style.left = "auto";
      menu.style.right = "0";
    }
    // 왼쪽으로 벗어나는 경우
    else if (rect.left < 0) {
      menu.style.left = "0";
      menu.style.right = "auto";
    }
  }, [ctx?.isOpen]);

  if (!ctx?.isOpen) return null;

  const { filteredOptions, searchable, search, classes } = ctx;

  return (
    <div {...divProps} ref={menuRef} className={cx(styles.menu, classes?.menu, className)} role="listbox" data-slot="menu">
      {filteredOptions.length > 0 ? filteredOptions.map((opt) => <Option key={opt.value} {...opt} />) : searchable && search.trim() !== "" ? <div className={cx(styles.empty, classes?.empty)}>검색 결과가 없습니다</div> : null}
    </div>
  );
};

interface OptionProps extends OptionShape {
  className?: string;
  contentClassName?: string;
}

function renderLeftVisual({ visualType = "icon", icon, avatar, dotColor }: Pick<OptionShape, "visualType" | "icon" | "avatar" | "dotColor">, classes?: SelectClassNames) {
  switch (visualType) {
    case "dot":
      return <div className={cx(styles.dot, classes?.dot)} style={{ backgroundColor: dotColor ?? "#ccc" }} />;
    case "avatar":
      if (!avatar) return null;
      return <div className={cx(styles.leftVisual, classes?.leftVisual)}>{avatar}</div>;
    case "icon":
      if (!icon) return null;
      return <div className={cx(styles.leftVisual, classes?.leftVisual)}>{icon}</div>;
    default:
      return null;
  }
}

const Option: React.FC<OptionProps> = ({ value, text, subText, icon, avatar, dotColor, visualType = "icon", className, contentClassName }) => {
  const ctx = useContext(SelectContext);
  if (!ctx) throw new Error("Select.Option must be used within <Select>");

  const isSelected = ctx.selected?.value === value;

  const handleClick = () => {
    ctx.onSelect(value);
  };

  return (
    <div className={cx(styles.option({ selected: isSelected }), ctx.classes?.option, className)} onClick={handleClick} data-slot="option" role="option" aria-selected={isSelected}>
      <div className={cx(styles.optionContent({ visualType }), ctx.classes?.optionContent, contentClassName)}>
        <div className={styles.centerText}>
          {renderLeftVisual({ visualType, icon, avatar, dotColor }, ctx.classes)}
          <span className={cx(styles.mainText, ctx.classes?.mainText)}>{text}</span>
          {subText && <span className={cx(styles.subText, ctx.classes?.subText)}>{subText}</span>}
        </div>
      </div>
      {isSelected && <Icon name="check-line" size={{ width: 20, height: 20 }} color="brand-600" />}
    </div>
  );
};

export const Select = Object.assign(SelectRoot, {
  Trigger,
  Menu,
  Option,
});

export default Select;
