"use client";

import { cx, Icon, Select, type OptionShape } from "@workly/ui";
import React from "react";
import { filterDropdown, filterIconTrigger, filterMenu } from "./postFilter.css";

interface PostFilterDropdownProps {
  value: "all" | "unread";
  onChange: (value: "all" | "unread") => void;
  className?: string;
}

const FILTER_OPTIONS: OptionShape[] = [
  {
    value: "all",
    text: "전체",
  },
  {
    value: "unread",
    text: "안읽음",
  },
];

export const PostFilterDropdown: React.FC<PostFilterDropdownProps> = ({ value, onChange, className }) => {
  const handleChange = (option: OptionShape) => {
    const filterValue = option.value as "all" | "unread";
    onChange(filterValue);
  };

  const isFiltered = value !== "all";

  return (
    <Select
      value={value}
      onChange={handleChange}
      options={FILTER_OPTIONS}
      className={cx(filterDropdown, className)}
      classes={{
        trigger: filterIconTrigger,
        menu: filterMenu,
      }}
    >
      <Select.Trigger>
        <Icon name="filter" size={{ width: 18, height: 18 }} color={isFiltered ? "brand-600" : "gray-600"} />
      </Select.Trigger>
      <Select.Menu />
    </Select>
  );
};
