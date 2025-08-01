import React, { createContext, useContext, useRef, useState } from "react";
import * as styles from "./select.css";
import { useClickOutside } from "@/hooks/useClickOutside";
import Icon from "../Icon";

export interface OptionShape {
  value: string;
  text: string;
  subText?: string;
  icon?: React.ReactNode;
  dotColor?: string;
  avatar?: React.ReactNode;
  visualType?: "icon" | "dot" | "avatar";
}

interface SelectProps {
  value?: string;
  onChange?: (value: OptionShape) => void;
  placeholder?: string;
  children: React.ReactNode;
  options: OptionShape[];
  searchable?: boolean;
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
}

const SelectContext = createContext<SelectContextValue | null>(null);

const Select = ({ value, onChange, placeholder, children, options, searchable = false }: SelectProps) => {
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
      }}
    >
      <div className={styles.selectContainer} ref={ref}>
        <Trigger placeholder={placeholder} />
        {children}
      </div>
    </SelectContext.Provider>
  );
};

const Trigger = ({ placeholder }: { placeholder?: string }) => {
  const ctx = useContext(SelectContext);
  if (!ctx) throw new Error("Select.Trigger 필수");
  const { selected, isOpen, toggle, search, setSearch, searchable } = ctx;

  return (
    <div className={styles.trigger({ focused: isOpen })} onClick={toggle}>
      {isOpen && searchable ? (
        <input type="text" placeholder={placeholder} value={search} onChange={(e) => setSearch(e.target.value)} className={styles.searchInput} onClick={(e) => e.stopPropagation()} />
      ) : selected ? (
        <div className={styles.optionContent({ visualType: selected.visualType })}>
          <div className={styles.centerText}>
            {renderLeftVisual(selected)}
            <span className={styles.mainText}>{selected.text}</span>
            {selected.subText && <span className={styles.subText}>{selected.subText}</span>}
          </div>
        </div>
      ) : (
        <span className={styles.placeholder}>{placeholder}</span>
      )}
      <Icon name={isOpen ? "arrow-up-s-line" : "arrow-down-s-line"} size={20} color="gray-500" />
    </div>
  );
};

const Menu = () => {
  const ctx = useContext(SelectContext);
  if (!ctx?.isOpen) return null;

  const { filteredOptions, searchable, search } = ctx;

  return <div className={styles.menu}>{filteredOptions.length > 0 ? filteredOptions.map((opt) => <Select.Option key={opt.value} {...opt} />) : searchable && search.trim() !== "" ? <div className={styles.empty}>검색 결과가 없습니다</div> : null}</div>;
};

interface OptionProps extends OptionShape {
  visualType?: "icon" | "dot" | "avatar";
}

function renderLeftVisual({ visualType = "icon", icon, avatar, dotColor }: Pick<OptionShape, "visualType" | "icon" | "avatar" | "dotColor">) {
  switch (visualType) {
    case "dot":
      return <div className={styles.dot} style={{ backgroundColor: dotColor ?? "#ccc" }} />;
    case "avatar":
      if (!avatar) return null;
      return <div className={styles.leftVisual}>{avatar}</div>;
    case "icon":
      if (!icon) return null;
      return <div className={styles.leftVisual}>{icon}</div>;
    default:
      return null;
  }
}

const Option = ({ value, text, subText, icon, avatar, dotColor, visualType = "icon" }: OptionProps) => {
  const ctx = useContext(SelectContext);
  if (!ctx) throw new Error("Select.Option 필수");

  const isSelected = ctx.selected?.value === value;

  const handleClick = () => {
    ctx.onSelect(value);
  };

  return (
    <div className={styles.option({ selected: isSelected })} onClick={handleClick}>
      <div className={styles.optionContent({ visualType })}>
        <div className={styles.centerText}>
          {renderLeftVisual({ visualType, icon, avatar, dotColor })}
          <span className={styles.mainText}>{text}</span>
          {subText && <span className={styles.subText}>{subText}</span>}
        </div>
      </div>
      {isSelected && <Icon name="check-line" size={20} color="brand-600" />}
    </div>
  );
};

Select.Menu = Menu;
Select.Option = Option;

export default Select;
