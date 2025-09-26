"use client";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $insertNodes } from "lexical";
import { useCallback } from "react";
import { $createImageNode } from "../nodes/ImageNode";

type Props = {
  onPickFile?: () => Promise<{ url: string; width?: number; height?: number; alt?: string } | null>;
};

export function ImagePlugin({ onPickFile }: Props) {
  const [editor] = useLexicalComposerContext();

  const insert = useCallback(async () => {
    if (!onPickFile) return;
    const file = await onPickFile();
    if (!file) return;
    editor.update(() => {
      $insertNodes([
        $createImageNode({
          src: file.url,
          width: file.width,
          height: file.height,
          alt: file.alt,
        }),
      ]);
    });
  }, [editor, onPickFile]);

  // 툴바에서 호출할 수 있게 임시로 editor에 등록
  (editor as any).__insertImage = insert;

  return null;
}
