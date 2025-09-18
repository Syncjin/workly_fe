"use client";

import { Button } from "@/shared/ui/Button";
import CheckBox from "@/shared/ui/CheckBox";
import { useCallback, useState } from "react";
import { toolbar } from "./postListWidget.css";

export const PostListToolbar = () => {
  const [checked, setChecked] = useState(false);
  const allCheckedChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("e.target.checke", e.target.checked);
  }, []);

  return (
    <div className={toolbar.container}>
      <div className={toolbar.leftArea}>
        <CheckBox aria-label="select all post" checked={!!checked} onChange={allCheckedChange} />
        <Button variant="border" size="md" color="gray-300">
          읽음
        </Button>
        <Button variant="border" size="md" color="gray-300">
          삭제
        </Button>
        <Button variant="border" size="md" color="gray-300">
          이동
        </Button>
      </div>
    </div>
  );
};
