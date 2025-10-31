"use client";

import { Select, type OptionShape } from "@workly/ui";
import React from "react";
import { pageSizeSelector, pageSizeTrigger } from "./postFilter.css";

interface PageSizeSelectorProps {
  value: number;
  onChange: (size: number) => void;
  options?: number[];
  className?: string;
}

const DEFAULT_OPTIONS = [10, 20, 50, 100];

export const PageSizeSelector: React.FC<PageSizeSelectorProps> = ({ value, onChange, options = DEFAULT_OPTIONS, className }) => {
  const selectOptions: OptionShape[] = options.map((size) => ({
    value: size.toString(),
    text: `${size}개`,
  }));

  const handleChange = (option: OptionShape) => {
    const size = parseInt(option.value, 10);
    onChange(size);
  };

  return (
    <Select
      value={value.toString()}
      onChange={handleChange}
      options={selectOptions}
      placeholder="페이지 크기"
      className={[pageSizeSelector, className].filter(Boolean).join(" ")}
      classes={{
        trigger: pageSizeTrigger,
      }}
    />
  );
};
