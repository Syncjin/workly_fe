"use client";

import { CLEAR_FORMAT_COMMAND, CODE_LANGUAGE_COMMAND, INSERT_YOUTUBE_COMMAND } from "@/shared/ui/Editor/plugins/command";
import { INSERT_IMAGE_COMMAND, InsertImagePayload } from "@/shared/ui/Editor/plugins/ImagePlugin";
import Icon from "@/shared/ui/Icon";
import Select, { OptionShape } from "@/shared/ui/Select";
import { $createCodeNode, $isCodeNode, CODE_LANGUAGE_FRIENDLY_NAME_MAP } from "@lexical/code";
import { TOGGLE_LINK_COMMAND } from "@lexical/link";
import { $isListNode, INSERT_CHECK_LIST_COMMAND, INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND, ListNode, REMOVE_LIST_COMMAND } from "@lexical/list";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $createHeadingNode, $createQuoteNode, $isHeadingNode, $isQuoteNode } from "@lexical/rich-text";
import { $getSelectionStyleValueForProperty, $patchStyleText, $setBlocksType } from "@lexical/selection";
import { $getNearestNodeOfType } from "@lexical/utils";
import { $createParagraphNode, $getSelection, $isRangeSelection, COMMAND_PRIORITY_LOW, FORMAT_TEXT_COMMAND, REDO_COMMAND, SELECTION_CHANGE_COMMAND, UNDO_COMMAND } from "lexical";
import React from "react";
import * as s from "./editor.css";

const BLOCK_OPTION: OptionShape[] = [
  { text: "Normal", value: "paragraph" },
  { text: "", value: "h1", icon: <Icon name="h-1" size={{ width: 16, height: 16 }} color="var(--color-gray-900)" /> },
  { text: "", value: "h2", icon: <Icon name="h-2" size={{ width: 16, height: 16 }} color="var(--color-gray-900)" /> },
  { text: "", value: "h3", icon: <Icon name="h-3" size={{ width: 16, height: 16 }} color="var(--color-gray-900)" /> },
  { text: "", value: "quote", icon: <Icon name="double-quotes-r" size={{ width: 16, height: 16 }} color="var(--color-gray-900)" /> },
  { text: "", value: "bullet", icon: <Icon name="list-unordered" size={{ width: 16, height: 16 }} color="var(--color-gray-900)" /> },
  { text: "", value: "number", icon: <Icon name="list-ordered" size={{ width: 16, height: 16 }} color="var(--color-gray-900)" /> },
  { text: "", value: "check", icon: <Icon name="check-line" size={{ width: 16, height: 16 }} color="var(--color-gray-900)" /> },
  { text: "code", value: "code" },
];

const FONT_FAMILIES: OptionShape[] = [
  { text: "Default", value: "" },
  { text: "Pretendard", value: "Pretendard, system-ui, -apple-system" },
  { text: "Inter", value: "Inter, system-ui, -apple-system" },
  { text: "Serif", value: "Georgia, 'Times New Roman', serif" },
  { text: "Monospace", value: "ui-monospace, Menlo, Consolas, monospace" },
];

const FONT_SIZES = ["12px", "13px", "14px", "15px", "16px", "18px", "20px", "24px", "28px"];

const EFFECTS: OptionShape[] = [
  { text: "Lowercase", value: "lowercase" },
  { text: "Uppercase", value: "uppercase" },
  { text: "Capitalize", value: "capitalize" },
  { text: "Strikethrough", value: "strikethrough" },
  { text: "Subscript", value: "subscript" },
  { text: "Superscript", value: "superscript" },
  { text: "Highlight", value: "highlight" },
  { text: "Clear formatting", value: "clear" },
];

const CODE_LANGUAGE_OPTION: OptionShape[] = Object.entries(CODE_LANGUAGE_FRIENDLY_NAME_MAP).map(([value, lable]) => ({
  value,
  text: lable,
}));

export function Toolbar() {
  const [editor] = useLexicalComposerContext();

  const [isBold, setBold] = React.useState(false);
  const [isItalic, setItalic] = React.useState(false);
  const [isUnderline, setUnderline] = React.useState(false);

  const [currentBlock, setCurrentBlock] = React.useState<string>("paragraph");
  const [fontFamily, setFontFamily] = React.useState<string>("");
  const [fontSize, setFontSize] = React.useState<string>("15px");
  const [fontColor, setFontColor] = React.useState<string>("#000000");
  const [codeLanguage, setCodeLanguage] = React.useState<string>("js");
  const [effect, setEffect] = React.useState<string>("");

  const updateUIFromSelection = React.useCallback(() => {
    editor.getEditorState().read(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return;

      setBold(selection.hasFormat("bold"));
      setItalic(selection.hasFormat("italic"));
      setUnderline(selection.hasFormat("underline"));

      // 블록 타입 추론
      const anchor = selection.anchor.getNode();
      const target = anchor.getKey() === "root" ? anchor : anchor.getTopLevelElementOrThrow();

      if (!target) {
        setCurrentBlock("paragraph");
        return;
      }

      if ($isHeadingNode(target)) {
        setCurrentBlock(target.getTag() as "h1" | "h2" | "h3");
      } else if ($isListNode(target)) {
        const parentList = $getNearestNodeOfType(anchor, ListNode);
        const listType = parentList ? parentList.getListType() : target.getListType();
        setCurrentBlock(listType);
      } else if ($isCodeNode(target)) {
        setCurrentBlock("code");
        const lagnuage = target.getLanguage()?.replace("javascript", "js");
        setCodeLanguage(lagnuage || "js");
      } else if ($isQuoteNode(target)) {
        setCurrentBlock("quote");
      } else {
        setCurrentBlock("paragraph");
      }

      // 인라인 스타일 값
      const ff = $getSelectionStyleValueForProperty(selection, "font-family", "");
      const fs = $getSelectionStyleValueForProperty(selection, "font-size", "15px");
      const color = $getSelectionStyleValueForProperty(selection, "color", "#000000");
      if (ff !== undefined) setFontFamily(ff);
      if (fs !== undefined) setFontSize(fs);
      if (color !== undefined) setFontColor(toHexColor(color));
    });
  }, [editor]);

  React.useEffect(() => {
    const u1 = editor.registerUpdateListener(() => updateUIFromSelection());
    const u2 = editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        updateUIFromSelection();
        return false;
      },
      COMMAND_PRIORITY_LOW
    );
    return () => {
      u1();
      u2();
    };
  }, [editor, updateUIFromSelection]);

  // 블록 타입 변경
  const applyBlock = (opt: string) => {
    editor.update(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return;
      switch (opt) {
        case "paragraph":
          editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
          $setBlocksType(selection, () => $createParagraphNode());
          break;
        case "h1":
        case "h2":
        case "h3":
          editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
          $setBlocksType(selection, () => $createHeadingNode(opt));
          break;
        case "quote":
          editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
          $setBlocksType(selection, () => $createQuoteNode());
          break;
        case "bullet":
          editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
          break;
        case "number":
          editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
          break;
        case "check":
          editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined);
          break;
        case "code":
          editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
              $setBlocksType(selection, () => $createCodeNode());
            }
          });
          break;
      }
    });
  };

  // 링크 토글
  const insertOrToggleLink = () => {
    const url = window.prompt("URL을 입력하세요:", "https://");
    if (url == null) return;
    editor.dispatchCommand(TOGGLE_LINK_COMMAND, url.trim() || null);
  };

  // 인라인 스타일 적용 (font-family / font-size / color)
  const patchStyle = (style: Record<string, string>) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $patchStyleText(selection, style);
      }
    });
  };

  const applyEffect = (value: (typeof EFFECTS)[number]["value"]) => {
    editor.update(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return;

      switch (value) {
        case "lowercase":
        case "uppercase":
        case "capitalize": {
          if (selection.isCollapsed()) return;
          const text = selection.getTextContent();
          const replaced = value === "lowercase" ? text.toLowerCase() : value === "uppercase" ? text.toUpperCase() : text.replace(/\b(\p{L})(\p{L}*)/gu, (_, a, b) => a.toUpperCase() + b.toLowerCase());
          selection.insertText(replaced);
          break;
        }
        case "strikethrough":
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
          break;
        case "subscript":
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "subscript");
          break;
        case "superscript":
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "superscript");
          break;
        case "highlight":
          $patchStyleText(selection, { "background-color": "yellow" });
          break;
        case "clear": {
          editor.dispatchCommand(CLEAR_FORMAT_COMMAND, "");
          break;
        }
      }
    });
  };

  const addImage = (payload: InsertImagePayload) => {
    console.log("payload", payload);
    editor.dispatchCommand(INSERT_IMAGE_COMMAND, payload);
  };

  return (
    <div className={s.toolbar}>
      {/* Undo / Redo */}
      <button className={s.btn} title="Undo" onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}>
        <Icon name="arrow-go-back-line" size={{ width: 20, height: 20 }} color="var(--color-gray-900)" />
      </button>
      <button className={s.btn} title="Redo" onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}>
        <Icon name="arrow-go-forward-line" size={{ width: 20, height: 20 }} color="var(--color-gray-900)" />
      </button>

      <div className={s.divider} />

      {/* 블록 타입 Select */}
      <Select
        value={currentBlock}
        onChange={(e) => {
          const v = e.value;
          setCurrentBlock(v);

          applyBlock(v);
        }}
        options={BLOCK_OPTION}
        classes={{ root: s.selectRoot }}
      />

      <Select
        value={fontFamily}
        onChange={(e) => {
          const v = e.value;
          setFontFamily(v);
          patchStyle({ "font-family": v || "" });
        }}
        options={[...FONT_FAMILIES.map((opt) => ({ value: opt.value.toString(), text: opt.text }))]}
        classes={{
          root: s.selectRoot,
        }}
      />

      <Select
        value={fontSize}
        onChange={(e) => {
          const v = e.value;
          setFontSize(v);
          patchStyle({ "font-size": v });
        }}
        options={[...FONT_SIZES.map((opt) => ({ value: opt.toString(), text: opt }))]}
        classes={{
          root: s.selectRoot,
        }}
      />

      <div className={s.divider} />

      {/* Bold / Italic / Underline / Inline Code */}
      <button className={s.btn} aria-pressed={isBold} title="Bold" onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")}>
        <Icon name="bold" size={{ width: 20, height: 20 }} color="var(--color-gray-900)" />
      </button>
      <button className={s.btn} aria-pressed={isItalic} title="Italic" onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")}>
        <Icon name="italic" size={{ width: 20, height: 20 }} color="var(--color-gray-900)" />
      </button>
      <button className={s.btn} aria-pressed={isUnderline} title="Underline" onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")}>
        <Icon name="underline" size={{ width: 20, height: 20 }} color="var(--color-gray-900)" />
      </button>

      {/* 링크 */}
      <button className={s.btn} title="Insert Link" onClick={insertOrToggleLink}>
        <Icon name="attachment-2" size={{ width: 20, height: 20 }} color="var(--color-gray-900)" />
      </button>

      {/* 글자색 */}
      <button className={s.colorBtn} title="Text Color">
        <input
          className={s.colorSwatch}
          type="color"
          value={fontColor}
          onChange={(e) => {
            const v = e.target.value;
            setFontColor(v);
            patchStyle({ color: v });
          }}
          aria-label="Text color"
        />
      </button>

      <div className={s.divider} />

      <Select
        value={codeLanguage}
        onChange={(e) => {
          const v = e.value;
          setCodeLanguage(v);
          editor.dispatchCommand(CODE_LANGUAGE_COMMAND, v);
        }}
        options={CODE_LANGUAGE_OPTION}
        classes={{ root: s.selectRoot }}
      />
      <Select
        value={effect}
        placeholder="Effect"
        onChange={(e) => {
          const v = e.value;
          setEffect(v);
          applyEffect(v);
        }}
        options={EFFECTS}
        classes={{ root: s.selectRoot }}
      />

      {/* Image */}
      <button
        className={s.btn}
        title="Insert Image"
        onClick={() =>
          addImage({
            altText: "Pink flowers",
            src: "https://images.pexels.com/photos/5656637/pexels-photo-5656637.jpeg?auto=compress&cs=tinysrgb&w=200",
          })
        }
      >
        <Icon name="image-add-line" size={{ width: 20, height: 20 }} color="var(--color-gray-900)" />
      </button>

      <button className={s.btn} title="Insert Youtube" onClick={() => editor.dispatchCommand(INSERT_YOUTUBE_COMMAND, "-cX9Tj8RZJE")}>
        <Icon name="youtube-line" size={{ width: 20, height: 20 }} color="var(--color-gray-900)" />
      </button>
    </div>
  );
}

/** rgb()/rgba()/hex → hex 표준화(간단 변환) */
function toHexColor(input: string): string {
  if (!input) return "#000000";
  if (input.startsWith("#")) {
    if (input.length === 4) {
      const r = input[1],
        g = input[2],
        b = input[3];
      return `#${r}${r}${g}${g}${b}${b}`.toLowerCase();
    }
    if (input.length === 7) return input.toLowerCase();
  }
  const m = input.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
  if (!m) return "#000000";
  const [r, g, b] = m.slice(1, 4).map((v) => Math.max(0, Math.min(255, parseInt(v, 10))));
  return `#${to2(r)}${to2(g)}${to2(b)}`;
}
function to2(n: number) {
  const s = n.toString(16);
  return s.length === 1 ? "0" + s : s;
}
