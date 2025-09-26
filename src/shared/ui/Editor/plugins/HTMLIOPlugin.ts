"use client";

import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getRoot } from "lexical";
import { useEffect } from "react";

type Props = {
  initialHTML?: string;
  onExportHTML?: (html: string) => void;
};

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
        onExportHTML(html);
      });
    });
  }, [editor, onExportHTML]);

  return null;
}
