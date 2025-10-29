"use client";

import { $createCodeNode, $isCodeNode, CODE_LANGUAGE_FRIENDLY_NAME_MAP } from "@lexical/code";
import { TOGGLE_LINK_COMMAND } from "@lexical/link";
import { $isListNode, INSERT_CHECK_LIST_COMMAND, INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND, ListNode, REMOVE_LIST_COMMAND } from "@lexical/list";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $createHeadingNode, $createQuoteNode, $isHeadingNode, $isQuoteNode } from "@lexical/rich-text";
import { $getSelectionStyleValueForProperty, $patchStyleText, $setBlocksType } from "@lexical/selection";
import { $getNearestNodeOfType } from "@lexical/utils";
import { Icon, Select, type OptionShape } from "@workly/ui";
import { $createParagraphNode, $getSelection, $isRangeSelection, COMMAND_PRIORITY_LOW, FORMAT_TEXT_COMMAND, REDO_COMMAND, SELECTION_CHANGE_COMMAND, UNDO_COMMAND } from "lexical";
import { useCallback, useEffect, useState } from "react";
import * as s from "./editor.css";
import { CLEAR_FORMAT_COMMAND, CODE_LANGUAGE_COMMAND } from "./plugins/command";
import { INSERT_IMAGE_COMMAND } from "./plugins/ImagePlugin";
import { DropdownColorPicker } from "./ui/DropdownColorPicker";
import { YouTubeDialog } from "./ui/YouTubeDialog";

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

type ToolbarProps = {
  onPickImageFile?: () => Promise<File | null>;
  onPickYoutubeVideo?: () => Promise<string | null>;
  rememberFile?: (tempId: string, file: File) => void;
};
export function Toolbar({ onPickImageFile, onPickYoutubeVideo, rememberFile }: ToolbarProps) {
  const [editor] = useLexicalComposerContext();

  const [isBold, setBold] = useState(false);
  const [isItalic, setItalic] = useState(false);
  const [isUnderline, setUnderline] = useState(false);

  const [currentBlock, setCurrentBlock] = useState<string>("paragraph");
  const [fontFamily, setFontFamily] = useState<string>("");
  const [fontSize, setFontSize] = useState<string>("15px");
  const [fontColor, setFontColor] = useState<string>("#000000");
  const [recentFontColor, setRecentFontColor] = useState<string[]>([]);
  const [codeLanguage, setCodeLanguage] = useState<string>("js");
  const [effect, setEffect] = useState<string>("");

  const updateUIFromSelection = useCallback(() => {
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
      if (color !== undefined) setFontColor(color);
    });
  }, [editor]);

  useEffect(() => {
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

  const handleColorChange = (color: string | null) => {
    if (!color) {
      applyEffect("clear");
      return;
    }
    setFontColor(color);
    editor.update(() => {
      const sel = $getSelection();
      if ($isRangeSelection(sel)) {
        if (color) $patchStyleText(sel, { color });
        else $patchStyleText(sel, { color: null as unknown as string }); // 제거
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
          editor.dispatchCommand(CLEAR_FORMAT_COMMAND, null);
          break;
        }
      }
    });
  };

  // 지원되는 이미지 파일 형식
  const SUPPORTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp", "image/svg+xml"];

  // 최대 파일 크기 (10MB)
  const MAX_FILE_SIZE = 10 * 1024 * 1024;

  const validateImageFile = (file: File): { isValid: boolean; error?: string } => {
    // 파일 형식 검증
    if (!SUPPORTED_IMAGE_TYPES.includes(file.type)) {
      return {
        isValid: false,
        error: `지원하지 않는 파일 형식입니다. 지원 형식: ${SUPPORTED_IMAGE_TYPES.join(", ")}`,
      };
    }

    // 파일 크기 검증
    if (file.size > MAX_FILE_SIZE) {
      return {
        isValid: false,
        error: `파일 크기가 너무 큽니다. 최대 크기: ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
      };
    }

    return { isValid: true };
  };

  // 기본 파일 선택 대화상자 구현
  const openDefaultFileDialog = (): Promise<File | null> => {
    return new Promise((resolve) => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.multiple = false;

      // 파일 선택 완료 처리
      input.onchange = (event) => {
        const target = event.target as HTMLInputElement;
        const file = target.files?.[0] ?? null;
        resolve(file);
      };

      // 파일 선택 취소 처리 (ESC 키나 대화상자 닫기)
      input.oncancel = () => {
        resolve(null);
      };

      // 포커스가 다른 곳으로 이동했을 때 취소로 간주 (일정 시간 후)
      const handleFocusOut = () => {
        setTimeout(() => {
          if (!input.files?.length) {
            resolve(null);
          }
        }, 100);
      };

      input.addEventListener("blur", handleFocusOut, { once: true });

      // 파일 선택 대화상자 열기
      input.click();
    });
  };

  const addImage = async () => {
    try {
      let file: File | null = null;

      // 커스텀 파일 선택기가 제공된 경우 사용, 그렇지 않으면 기본 대화상자 사용
      if (onPickImageFile) {
        file = await onPickImageFile();
      } else {
        file = await openDefaultFileDialog();
      }

      if (!file) {
        console.log("파일 선택이 취소되었습니다.");
        return;
      }

      // 파일 검증
      const validation = validateImageFile(file);
      if (!validation.isValid) {
        alert(validation.error);
        return;
      }

      // blob URL 생성 및 임시 ID 할당
      const objectURL = URL.createObjectURL(file);
      const tempId = crypto.randomUUID?.() ?? String(Date.now());

      // 파일 저장소에 파일 기억
      rememberFile?.(tempId, file);

      // 이미지 삽입 명령 실행
      editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
        src: objectURL,
        altText: file.name || "선택된 이미지",
        tempId,
      });

      console.log("이미지가 성공적으로 삽입되었습니다:", file.name);
    } catch (error) {
      console.error("이미지 추가 중 오류:", error);
      alert("이미지 추가 중 오류가 발생했습니다.");
    }
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

      <DropdownColorPicker title="글자색" value={fontColor} onChange={handleColorChange} recent={recentFontColor} onRecentChange={setRecentFontColor} />

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
      <button className={s.btn} title="Insert Image" onClick={addImage}>
        <Icon name="image-add-line" size={{ width: 20, height: 20 }} color="var(--color-gray-900)" />
      </button>

      <YouTubeDialog editor={editor} onPickYoutubeVideo={onPickYoutubeVideo} className={s.btn} />
    </div>
  );
}
export default Toolbar;
