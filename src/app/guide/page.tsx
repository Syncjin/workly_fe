"use client";
import { colorGroups, colorLevels } from "@/shared/styles/colorVariants";
import Avatar from "@/shared/ui/Avatar";
import AvatarGroup from "@/shared/ui/Avatar/AvatarGroup";
import type { BadgeSize } from "@/shared/ui/Badge";
import { Badge } from "@/shared/ui/Badge";
import type { ButtonSize } from "@/shared/ui/Button";
import { Button } from "@/shared/ui/Button";
import { ButtonVariant } from "@/shared/ui/Button/button.css";
import Carousel from "@/shared/ui/Carousel";
import CheckBox from "@/shared/ui/CheckBox";
import CheckBoxField from "@/shared/ui/CheckBox/CheckBoxField";
import Dropdown from "@/shared/ui/Dropdown";
import Icon from "@/shared/ui/Icon";
import { Input } from "@/shared/ui/Input";
import InputField from "@/shared/ui/Input/InputField";
import Textarea from "@/shared/ui/Input/Textarea";
import RadioGroup from "@/shared/ui/Radio/RadioGroup";
import Select, { OptionShape } from "@/shared/ui/Select";
import { useState } from "react";

const variants: ButtonVariant[] = ["solid", "light", "border", "ghost", "link"];

const buttonStates = [
  { label: "Default", props: {} },
  { label: "Hover", props: { "data-demo-hover": true } },
  { label: "Focus", props: { "data-demo-focus": true } },
  { label: "Disabled", props: { disabled: true } },
];

const options: OptionShape[] = [
  {
    value: "apple",
    text: "사과",
    subText: "달콤한 과일",
    icon: <Icon name="add-box-line" />,
  },
  { value: "grape", text: "포도", subText: "달콤한 과일" },
  { value: "grape2", text: "포도2", subText: "달콤한 과일" },
  { value: "grape3", text: "포도3", subText: "달콤한 과일" },
  { value: "grape4", text: "포도4", subText: "달콤한 과일" },
  { value: "banana", text: "바나나" },
  {
    value: "melon",
    text: "멜론",
    visualType: "dot",
    dotColor: "var(--color-success-500)",
  },
  {
    value: "strawberry",
    text: "딸기",
    visualType: "avatar",
    avatar: <Avatar src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face" size="xs" />,
  },
];

export default function GuidePage() {
  const [checked, setChecked] = useState(false);
  const [checked2, setChecked2] = useState(true);
  const [radioValue, setRadioValue] = useState("option1");
  const [radioValue2, setRadioValue2] = useState("option2");
  const [open, setOpen] = useState(true);
  const [selected, setSelected] = useState<OptionShape | null>(null);

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
              <td
                style={{
                  fontWeight: 600,
                  padding: "8px 4px",
                  textAlign: "right",
                }}
              >
                {group}
              </td>
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
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 20,
          maxWidth: 400,
          marginBottom: 48,
        }}
      >
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
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 24,
          maxWidth: 400,
          marginBottom: 48,
        }}
      >
        <InputField label="이메일" placeholder="이메일을 입력하세요" helperText="기본 안내 메시지입니다." />

        <InputField label="검색" successText="성공 메시지입니다." placeholder="검색어 입력" status="success" iconLeft={<Icon name="search-line" size={18} color="#000" />} />

        <InputField label="비밀번호" errorText="에러 메시지입니다." placeholder="비밀번호 입력" status="error" iconLeft={<Icon name="eye-line" size={18} color="#000" />} />
      </div>
      {/* Textarea Guide */}
      <h1>Textarea Guide</h1>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 20,
          maxWidth: 400,
          marginBottom: 48,
        }}
      >
        <Textarea placeholder="기본 텍스트에어리어" />
        <Textarea placeholder="성공 상태" status="success" />
        <Textarea placeholder="에러 상태" status="error" />
        <Textarea placeholder="비활성화(disabled)" disabled />
      </div>
      {/* CheckBox Guide */}
      <h1>CheckBoxField Guide</h1>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 20,
          maxWidth: 400,
          marginBottom: 48,
        }}
      >
        <CheckBoxField label="기본 체크박스" checked={checked} onChange={(e) => setChecked(e.target.checked)} description="설명 메시지입니다." />
        <CheckBoxField label="체크됨" checked={checked2} onChange={(e) => setChecked2(e.target.checked)} />
        <CheckBoxField label="비활성화" disabled readOnly />
        <CheckBoxField label="체크+비활성화" checked disabled onChange={() => {}} />

        <h2>CheckBox Size (sm, md, lg)</h2>
        <div style={{ display: "flex", gap: 16 }}>
          <CheckBox size="sm" checked readOnly />
          <CheckBox size="md" checked readOnly />
          <CheckBox size="lg" checked readOnly />
        </div>
      </div>
      {/* RadioGroup Guide */}
      <h1>RadioGroup Guide</h1>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 24,
          maxWidth: 400,
          marginBottom: 48,
        }}
      >
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
      {/* Avatar Guide */}
      <h1>Avatar Guide</h1>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 24,
          maxWidth: 600,
          marginBottom: 48,
        }}
      >
        <div>
          <h2>Avatar Size (xs, sm, md, lg, xl, 2xl)</h2>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginTop: 12,
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Avatar size="xs" />
              <span style={{ fontSize: 12 }}>XS</span>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Avatar size="sm" />
              <span style={{ fontSize: 12 }}>Small</span>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Avatar size="md" />
              <span style={{ fontSize: 12 }}>Medium</span>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Avatar size="lg" />
              <span style={{ fontSize: 12 }}>Large</span>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Avatar size="xl" />
              <span style={{ fontSize: 12 }}>XLarge</span>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Avatar size="2xl" />
              <span style={{ fontSize: 12 }}>2XL</span>
            </div>
          </div>
        </div>

        <div>
          <h2>Avatar with Image</h2>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginTop: 12,
            }}
          >
            <Avatar src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face" alt="User Avatar" size="lg" />
            <span>이미지가 있는 아바타</span>
          </div>
        </div>

        <div>
          <h2>Avatar with Status Dot</h2>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginTop: 12,
            }}
          >
            <Avatar showDot size="lg" />
            <span>온라인 상태 (기본 초록색)</span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginTop: 12,
            }}
          >
            <Avatar showDot dotColor="var(--color-warning-500)" size="lg" />
            <span>자리 비움 상태 (주황색)</span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginTop: 12,
            }}
          >
            <Avatar showDot dotColor="var(--color-error-500)" size="lg" />
            <span>오프라인 상태 (빨간색)</span>
          </div>
        </div>

        <div>
          <h2>Avatar with Status Icon</h2>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginTop: 12,
            }}
          >
            <Avatar icon={<Icon name="check-line" size={12} color="var(--color-success-600)" />} size="lg" />
            <span>승인 상태 (체크 아이콘)</span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginTop: 12,
            }}
          >
            <Avatar icon={<Icon name="star-line" size={12} color="var(--color-warning-600)" />} size="lg" />
            <span>프리미엄 상태 (별 아이콘)</span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginTop: 12,
            }}
          >
            <Avatar icon={<Icon name="shield-check-line" color="var(--color-brand-600)" />} size="lg" />
            <span>인증 상태 (방패 아이콘)</span>
          </div>
        </div>

        <div>
          <h2>Avatar with Image and Status Dot</h2>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginTop: 12,
            }}
          >
            <Avatar src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face" alt="User Avatar" showDot size="lg" />
            <span>이미지와 온라인 상태</span>
          </div>
        </div>

        <div>
          <h2>Avatar Focus State</h2>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginTop: 12,
            }}
          >
            <Avatar
              size="lg"
              tabIndex={0}
              style={{
                boxShadow: "0 0 0 4px var(--color-brand-100)",
              }}
            />
            <span>포커스 상태 (Tab으로 포커스 가능)</span>
          </div>
        </div>
      </div>
      {/* AvatarGroup Guide */}
      <h1>AvatarGroup Guide</h1>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 24,
          maxWidth: 600,
          marginBottom: 48,
        }}
      >
        <div>
          <h2>AvatarGroup Size (xs, sm, md)</h2>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
              marginTop: 12,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <span style={{ minWidth: 40 }}>xs:</span>
              <AvatarGroup
                avatars={[
                  {
                    src: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
                  },
                  {
                    src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
                  },
                  {
                    src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
                  },
                ]}
                size="xs"
                max={3}
                showDot={true}
              />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <span style={{ minWidth: 40 }}>sm:</span>
              <AvatarGroup
                avatars={[
                  {
                    src: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
                  },
                  {
                    src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
                  },
                  {
                    src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
                  },
                ]}
                size="sm"
                max={5}
                showDot={true}
              />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <span style={{ minWidth: 40 }}>md:</span>
              <AvatarGroup
                avatars={[
                  {
                    src: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
                  },
                  {
                    src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
                  },
                  {
                    src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
                  },
                ]}
                size="md"
                max={2}
                showDot={true}
              />
            </div>
          </div>
        </div>

        <div>
          <h2>AvatarGroup with Different Max Values</h2>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
              marginTop: 12,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <span style={{ minWidth: 80 }}>Max 2:</span>
              <AvatarGroup
                avatars={[
                  {
                    src: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
                  },
                  {
                    src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
                  },
                  {
                    src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
                  },
                ]}
                size="md"
                max={2}
              />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <span style={{ minWidth: 80 }}>Max 4:</span>
              <AvatarGroup
                avatars={[
                  {
                    src: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
                  },
                  {
                    src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
                  },
                  {
                    src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
                  },
                  {
                    icon: <Icon name="star-line" color="var(--color-warning-600)" />,
                  },
                ]}
                size="md"
                max={4}
              />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <span style={{ minWidth: 80 }}>Max 6:</span>
              <AvatarGroup
                avatars={[
                  {
                    src: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
                  },
                  {
                    src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
                  },
                  {
                    src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
                  },
                  {
                    icon: <Icon name="star-line" color="var(--color-warning-600)" />,
                  },
                  {
                    icon: <Icon name="star-line" color="var(--color-warning-600)" />,
                  },
                  {
                    icon: <Icon name="star-line" color="var(--color-warning-600)" />,
                  },
                  {
                    icon: <Icon name="star-line" color="var(--color-warning-600)" />,
                  },
                ]}
                size="md"
                max={6}
                showDot={true}
              />
            </div>
          </div>
        </div>
      </div>
      {/* Dropdown Guide */}
      <h1>Dropdown Guide</h1>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 24,
          maxWidth: 600,
          marginBottom: 48,
        }}
      >
        <Dropdown>
          <Dropdown.Trigger>
            <button>옵션 열기 ⌄</button>
          </Dropdown.Trigger>
          <Dropdown.Menu>
            <Dropdown.Item icon={<Icon name="star-line" color="var(--color-warning-600)" />} text="설정" />
            <Dropdown.Item icon={<Icon name="star-line" color="var(--color-warning-600)" />} text="로그아웃" />
          </Dropdown.Menu>
        </Dropdown>
        <h2>Dropdown use setState</h2>
        <Dropdown open={open} onOpenChange={setOpen}>
          <Dropdown.Trigger>
            <button>메뉴 열기</button>
          </Dropdown.Trigger>
          <Dropdown.Menu>
            <Dropdown.Header>보기 설정</Dropdown.Header>
            <Dropdown.Item closeOnClick={false}>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <CheckBoxField label="기본 체크박스" checked={checked} onChange={(e) => setChecked(e.target.checked)} />
                <span>즐겨찾기만 보기</span>
              </div>
            </Dropdown.Item>
            <Dropdown.Line />
            <Dropdown.Item text="프로필" />
            <Dropdown.Item text="로그아웃" onClick={() => console.log("로그아웃")} />
          </Dropdown.Menu>
        </Dropdown>
      </div>

      {/* Select Guide */}
      <h1>Select Guide</h1>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 24,
          maxWidth: 320,
          marginBottom: 48,
        }}
      >
        <Select value={selected?.value} onChange={setSelected} options={options} placeholder="과일을 선택하세요">
          <Select.Menu />
        </Select>
        <h2>Select search</h2>
        <Select value={selected?.value} onChange={setSelected} options={options} placeholder="과일을 선택하세요" searchable>
          <Select.Menu />
        </Select>
      </div>

      {/* Carousel Guide */}
      <h1>Carousel Guide</h1>
      <Carousel autoSlide size="md">
        <div style={{ background: "lightcoral", height: 200 }}>Slide 1</div>
        <div style={{ background: "lightblue", height: 200 }}>Slide 2</div>
        <div style={{ background: "lightgreen", height: 200 }}>Slide 3</div>
      </Carousel>

      <Carousel autoSlide size="lg" color="light">
        <div style={{ background: "lightcoral", height: 200 }}>Slide 1</div>
        <div style={{ background: "lightblue", height: 200 }}>Slide 2</div>
        <div style={{ background: "lightgreen", height: 200 }}>Slide 3</div>
      </Carousel>

      <Carousel autoSlide size="lg" color="dark">
        <div style={{ background: "lightcoral", height: 200 }}>Slide 1</div>
        <div style={{ background: "lightblue", height: 200 }}>Slide 2</div>
        <div style={{ background: "lightgreen", height: 200 }}>Slide 3</div>
      </Carousel>
    </div>
  );
}
