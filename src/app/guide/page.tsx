import React from "react";
import Button from "@/shared/ui/Button";
import { colorGroups, colorLevels } from "@/shared/styles/colorVariants";
import { ButtonVariant } from "@/shared/ui/Button/button.css";
import type { ButtonSize } from "@/shared/ui/Button";

const variants: ButtonVariant[] = ["solid", "light", "border", "ghost", "link"];
const colors = colorGroups.flatMap((group) =>
  colorLevels.map((level) => ({
    key: `${group}-${level}`,
    group,
    level,
  }))
);

const buttonStates = [
  { label: "Default", props: {} },
  { label: "Hover", props: { "data-demo-hover": true } },
  { label: "Focus", props: { "data-demo-focus": true } },
  { label: "Disabled", props: { disabled: true } },
];

export default function GuidePage() {
  return (
    <div style={{ padding: 32 }}>
      <h1>Button Variant Guide</h1>
      <table style={{ borderCollapse: "collapse", marginBottom: 48 }}>
        <thead>
          <tr>
            <th style={{ width: 120, textAlign: "left" }}>Variant</th>
            {buttonStates.map((state) => (
              <th key={state.label} style={{ width: 120 }}>
                {state.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {variants.map((variant) => (
            <tr key={variant}>
              <td style={{ fontWeight: 600, padding: "8px 12px" }}>{variant}</td>
              {buttonStates.map((state) => {
                const forceHover = state.label === "Hover";
                const forceFocus = state.label === "Focus";
                return (
                  <td key={state.label} style={{ padding: "8px 12px" }}>
                    <Button variant={variant} color="brand-600" forceHover={forceHover} forceFocus={forceFocus} style={{ minWidth: 100 }} {...state.props}>
                      {state.label}
                    </Button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      {/* Button Size Guide 추가 */}
      <h1>Button Size Guide</h1>
      <table style={{ borderCollapse: "collapse", marginBottom: 48 }}>
        <thead>
          <tr>
            <th style={{ width: 120, textAlign: "left" }}>Size</th>
            <th style={{ width: 120 }}>Button</th>
          </tr>
        </thead>
        <tbody>
          {["sm", "md", "lg", "xl"].map((size) => (
            <tr key={size}>
              <td style={{ fontWeight: 600, padding: "8px 12px" }}>{size}</td>
              <td style={{ padding: "8px 12px" }}>
                <Button size={size as ButtonSize} variant="solid" color="brand-600" style={{ minWidth: 100 }}>
                  {size}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h1>Color Palette</h1>
      <table style={{ borderCollapse: "collapse", marginBottom: 48 }}>
        <thead>
          <tr>
            <th style={{ width: 80 }}></th>
            {colorLevels.map((level) => (
              <th key={level} style={{ width: 80, textAlign: "center" }}>
                {level}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {colorGroups.map((group) => (
            <tr key={group}>
              <td style={{ fontWeight: 600, padding: "8px 4px", textAlign: "right" }}>{group}</td>
              {colorLevels.map((level) => (
                <td key={level} style={{ padding: "8px 4px" }}>
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 8,
                      background: `var(--color-${group}-${level})`,
                      border: "1px solid #eee",
                      margin: "0 auto 4px auto",
                    }}
                  />
                  <span style={{ fontSize: 12 }}>
                    {group}-{level}
                  </span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
