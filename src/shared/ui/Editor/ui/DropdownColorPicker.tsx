"use client";

import Dropdown, { useDropdown } from "@/shared/ui/Dropdown";
import { assignInlineVars } from "@vanilla-extract/dynamic";
import { useMemo, useState } from "react";
import * as s from "./dropdownColorPicker.css";
import { colorVar } from "./dropdownColorPicker.css";

type Color = string;

export function DropdownColorPicker({ value, onChange, colors = DEFAULT_COLORS, recent = [], onRecentChange, title = "텍스트 색상" }: { value?: Color | null; onChange?: (c: Color | null) => void; colors?: Color[]; recent?: Color[]; onRecentChange?: (next: Color[]) => void; title?: string }) {
  const trigger = useMemo(
    () => (
      <button type="button" className={s.trigger.btn} aria-label={title}>
        <span className={s.trigger.mini}>
          <span className={s.trigger.miniFill} style={assignInlineVars({ [colorVar]: value ?? "transparent" })} />
        </span>
        <span>{title}</span>
      </button>
    ),
    [value, title]
  );

  return (
    <Dropdown>
      <Dropdown.Trigger>{trigger}</Dropdown.Trigger>
      <Dropdown.Menu>
        <MenuPanel title={title} value={value ?? ""} colors={colors} recent={recent} onChange={onChange} onRecentChange={onRecentChange} />
      </Dropdown.Menu>
    </Dropdown>
  );
}

function MenuPanel({ title, value, colors, recent, onChange, onRecentChange }: { title: string; value: string; colors: string[]; recent: string[]; onChange?: (c: string | null) => void; onRecentChange?: (next: string[]) => void }) {
  const { close } = useDropdown();
  const [hex, setHex] = useState(value ?? "");

  const pick = (c: string | null) => {
    onChange?.(c);
    if (c && onRecentChange) {
      const next = [c, ...recent.filter((x) => x !== c)].slice(0, 8);
      onRecentChange(next);
    }
    close();
  };

  const applyHex = () => {
    const c = hex.trim();
    if (!c) return;
    onChange?.(c);
    if (onRecentChange) {
      const next = [c, ...recent.filter((x) => x !== c)].slice(0, 8);
      onRecentChange(next);
    }
    close();
  };

  return (
    <>
      <Dropdown.Header className={s.menu.header}>{title}</Dropdown.Header>

      <button type="button" className={s.menu.resetBtn} onClick={() => pick(null)}>
        <span className={s.menu.noneBox} />
        없음
      </button>

      {recent.length > 0 && (
        <>
          <div className={s.menu.section}>최근 사용</div>
          <div className={s.menu.row}>
            {recent.map((c) => (
              <button key={`r-${c}`} type="button" className={s.menu.palette} onClick={() => pick(c)} aria-label={`색상 ${c}`}>
                <span className={s.fill} style={assignInlineVars({ [colorVar]: c })} />
              </button>
            ))}
          </div>
        </>
      )}

      <div className={s.menu.section}>팔레트</div>
      <div className={s.menu.grid}>
        {colors.map((c) => (
          <button key={c} type="button" className={s.menu.palette} onClick={() => pick(c)} aria-label={`색상 ${c}`}>
            <span className={s.fill} style={assignInlineVars({ [colorVar]: c })} />
          </button>
        ))}
      </div>

      <div className={s.menu.rgbRow}>
        <input className={s.menu.hexInput} placeholder="#RRGGBB, rgb(), var(--token)" value={hex} onChange={(e) => setHex(e.target.value)} onKeyDown={(e) => e.key === "Enter" && applyHex()} />
        <span className={s.menu.preview}>
          <span
            className={s.menu.previewFill}
            style={assignInlineVars({
              [colorVar]: hex || "transparent",
            })}
          />
        </span>
        <button type="button" className={s.menu.applyBtn} onClick={applyHex}>
          적용
        </button>
      </div>
    </>
  );
}

const DEFAULT_COLORS: Color[] = ["#000000", "#1f2937", "#4b5563", "#6b7280", "#9ca3af", "#d1d5db", "#e5e7eb", "#f3f4f6", "#ffffff", "#ef4444", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6", "#ec4899", "#22c55e", "#f97316", "#14b8a6"];
