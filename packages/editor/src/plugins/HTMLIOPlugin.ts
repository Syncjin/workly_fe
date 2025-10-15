"use client";

import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getRoot } from "lexical";
import { useEffect } from "react";

type Props = {
  initialHTML?: string;
  onExportHTML?: (html: string) => void;
};

function isEditorEffectivelyEmpty(): boolean {
  const root = $getRoot();

  const text = root
    .getTextContent()
    .replace(/\u200B/g, "") // zero-width space
    .replace(/\xa0/g, " ") // &nbsp;
    .trim();

  if (text.length > 0) return false;

  const hasNonEmptyNode = root.getChildren().some((node) => {
    const type = node.getType();
    if (type === "paragraph") {
      return node.getTextContent().trim().length > 0;
    }
    // 문단 외 노드(이미지/표/코드블록 등)는 컨텐츠로 간주
    return true;
  });

  return !hasNonEmptyNode;
}

export function HTMLIOPlugin({ initialHTML, onExportHTML }: Props) {
  const [editor] = useLexicalComposerContext();

  // 초기 HTML → 에디터
  useEffect(() => {
    if (!initialHTML) return;
    editor.update(() => {
      const parser = new DOMParser();
      const dom = parser.parseFromString(initialHTML, "text/html");
      const nodes = $generateNodesFromDOM(editor, dom);
      const root = $getRoot();
      root.clear();
      nodes.forEach((n) => root.append(n));
    });
  }, [editor, initialHTML]);

  // 변경 시 HTML 내보내기
  useEffect(() => {
    if (!onExportHTML) return;
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const html = $generateHtmlFromNodes(editor);
        const empty = isEditorEffectivelyEmpty();
        onExportHTML(empty ? "" : html);
      });
    });
  }, [editor, onExportHTML]);

  return null;
}
