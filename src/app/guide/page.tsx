"use client";
import React, { useState } from "react";
import { Button } from "@/shared/ui/Button";
import { colorGroups, colorLevels } from "@/shared/styles/colorVariants";
import { ButtonVariant } from "@/shared/ui/Button/button.css";
import type { ButtonSize } from "@/shared/ui/Button";
import { Badge } from "@/shared/ui/Badge";
import type { BadgeSize } from "@/shared/ui/Badge";
import Icon from "@/shared/ui/Icon";
import { Input } from "@/shared/ui/Input";
import InputHint from "@/shared/ui/InputHint";
import Textarea from "@/shared/ui/Input/Textarea";
import CheckBox from "@/shared/ui/CheckBox";
import CheckBoxField from "@/shared/ui/CheckBox/CheckBoxField";
import InputField from "@/shared/ui/Input/InputField";
import RadioGroup from "@/shared/ui/Radio/RadioGroup";

const variants: ButtonVariant[] = ["solid", "light", "border", "ghost", "link"];

const buttonStates = [
  { label: "Default", props: {} },
  { label: "Hover", props: { "data-demo-hover": true } },
  { label: "Focus", props: { "data-demo-focus": true } },
  { label: "Disabled", props: { disabled: true } },
];

export default function GuidePage() {
  const [checked, setChecked] = useState(false);
  const [checked2, setChecked2] = useState(true);
  const [radioValue, setRadioValue] = useState("option1");
  const [radioValue2, setRadioValue2] = useState("option2");
  

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
      <h1>Badge Size Guide</h1>
      <table style={{ borderCollapse: "collapse", marginBottom: 48 }}>
        <thead>
          <tr>
            <th style={{ width: 120, textAlign: "left" }}>Size</th>
            <th style={{ width: 120, textAlign: "center" }}>Badge</th>
            <th style={{ width: 160, textAlign: "center" }}>왼쪽 아이콘</th>
            <th style={{ width: 160, textAlign: "center" }}>오른쪽 아이콘</th>
          </tr>
        </thead>
        <tbody>
          {(["sm", "md", "lg"] as BadgeSize[]).map((size) => (
            <tr key={size}>
              <td style={{ fontWeight: 600, padding: "8px 12px" }}>{size}</td>
              <td style={{ padding: "8px 12px", textAlign: "center" }}>
                <Badge size={size} color="brand-50">
                  Label
                </Badge>
              </td>
              <td style={{ padding: "8px 12px", textAlign: "center" }}>
                <Badge size={size} color="brand-50" icon={<Icon name="arrow-right-line" color="orange-500" size={size === "sm" ? 14 : size === "md" ? 16 : 20} />}>
                  Label
                </Badge>
              </td>
              <td style={{ padding: "8px 12px", textAlign: "center" }}>
                <Badge size={size} color="brand-50" icon={<Icon name="arrow-right-line" color="orange-500" size={size === "sm" ? 14 : size === "md" ? 16 : 20} />} iconPosition="right">
                  Label
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Badge 아이콘 예제 */}

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
      {/* Input Guide */}
      <h1>Input Guide</h1>
      <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 400, marginBottom: 48 }}>
        <Input placeholder="기본 인풋" />
        <Input placeholder="왼쪽 아이콘" iconLeft={<Icon name="search-line" size={18} color="#000" />} />
        <Input placeholder="오른쪽 아이콘" iconRight={<Icon name="close-line" size={18} color="gray-500" />} />
        <Input placeholder="양쪽 아이콘" iconLeft={<Icon name="search-line" size={18} color="#000" />} iconRight={<Icon name="close-line" size={18} color="gray-500" />} />
        <Input
          placeholder="focus"
          style={{
            boxShadow: "0 0 0 4px var(--color-brand-300)",
            background: "#fff",
          }}
        />
        <Input placeholder="비활성화(disabled)" disabled />
      </div>
      {/* Input Field Guide */}
      <h1>Input Field Guide</h1>
      <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 400, marginBottom: 48 }}>
        <InputField
          label="이메일"
          placeholder="이메일을 입력하세요"
          helperText="기본 안내 메시지입니다."
        />
       
       <InputField
          label="검색"
          successText="성공 메시지입니다."
          placeholder="검색어 입력" status="success" iconLeft={<Icon name="search-line" size={18} color="#000" />}
        />

        <InputField
          label="비밀번호"
          errorText="에러 메시지입니다."
          placeholder="비밀번호 입력" status="error" iconLeft={<Icon name="eye-line" size={18} color="#000" />}
        />
     
      </div>
      {/* Textarea Guide */}
      <h1>Textarea Guide</h1>
      <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 400, marginBottom: 48 }}>
        <Textarea placeholder="기본 텍스트에어리어" />
        <Textarea placeholder="성공 상태" status="success" />
        <Textarea placeholder="에러 상태" status="error" />
        <Textarea placeholder="비활성화(disabled)" disabled />
      </div>
      {/* CheckBox Guide */}
      <h1>CheckBoxField Guide</h1>
      <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 400, marginBottom: 48 }}>
        <CheckBoxField label="기본 체크박스" checked={checked} onChange={e => setChecked(e.target.checked)} description="설명 메시지입니다."/>
        <CheckBoxField label="체크됨" checked={checked2} onChange={e => setChecked2(e.target.checked)} />
        <CheckBoxField label="비활성화" disabled readOnly/>
        <CheckBoxField label="체크+비활성화" checked disabled onChange={() => {}} />
      
        <h2>CheckBox Size (sm, md, lg)</h2>
        <div style={{ display: "flex", gap: 16 }}>
          <CheckBox size="sm" checked readOnly />
          <CheckBox size="md"  checked readOnly />
          <CheckBox size="lg" checked readOnly />
        </div>
      </div>
      {/* RadioGroup Guide */}
      <h1>RadioGroup Guide</h1>
      <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 400, marginBottom: 48 }}>
        <RadioGroup
          label="기본 라디오 그룹"
          options={[
            { label: "옵션 1", value: "option1" },
            { label: "옵션 2", value: "option2" },
            { label: "옵션 3", value: "option3" },
          ]}
          value={radioValue}
          onChange={setRadioValue}
          description="기본 라디오 그룹 예제입니다."
        />
        
        <RadioGroup
          label="가로 방향 라디오 그룹"
          options={[
            { label: "옵션 A", value: "optionA" },
            { label: "옵션 B", value: "optionB" },
            { label: "옵션 C", value: "optionC" },
          ]}
          value={radioValue2}
          onChange={setRadioValue2}
          direction="row"
          helperText="가로 방향으로 배치된 라디오 그룹입니다."
        />
        
        <RadioGroup
          label="에러 상태 라디오 그룹"
          options={[
            { label: "옵션 X", value: "optionX" },
            { label: "옵션 Y", value: "optionY" },
          ]}
          errorText="에러 메시지가 표시됩니다."
        />
        
        <RadioGroup
          label="비활성화 라디오 그룹"
          options={[
            { label: "옵션 1", value: "disabled1" },
            { label: "옵션 2", value: "disabled2", disabled: true },
            { label: "옵션 3", value: "disabled3" },
          ]}
          
        />
        
        <RadioGroup
          label="체크된 상태로 비활성화된 라디오 그룹"
          options={[
            { label: "옵션 1", value: "checked-disabled1" },
            { label: "옵션 2 (체크됨)", value: "checked-disabled2" },
            { label: "옵션 3", value: "checked-disabled3" },
          ]}
          value="checked-disabled2"
          disabled
        />
        
        <h2>RadioGroup Size (sm, md, lg)</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <RadioGroup
            label="Small Size"
            options={[
              { label: "Small 1", value: "small1" },
              { label: "Small 2", value: "small2" },
            ]}
            size="sm"
          />
          <RadioGroup
            label="Medium Size"
            options={[
              { label: "Medium 1", value: "medium1" },
              { label: "Medium 2", value: "medium2" },
            ]}
            size="md"
          />
          <RadioGroup
            label="Large Size"
            options={[
              { label: "Large 1", value: "large1" },
              { label: "Large 2", value: "large2" },
            ]}
            size="lg"
          />
        </div>
      </div>
    </div>
  );
}
