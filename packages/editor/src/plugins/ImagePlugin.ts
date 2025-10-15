"use client";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $insertNodes, createCommand } from "lexical";
import { useCallback, useEffect } from "react";
import { $createImageNode, type InsertImagePayload } from "../nodes/ImageNode";
import { ImageFileManager } from "./ImageFileManager";

export const INSERT_IMAGE_COMMAND = createCommand<InsertImagePayload>("INSERT_IMAGE_COMMAND");

function uuid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

// 지원되는 이미지 파일 형식
const SUPPORTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg', 
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml'
];

// 최대 파일 크기 (10MB)
const MAX_FILE_SIZE = 10 * 1024 * 1024;

// 파일 형식, 크기 검증 함수
function validateImageFile(file: File): { isValid: boolean; error?: string } {
  if (!SUPPORTED_IMAGE_TYPES.includes(file.type)) {
    return { isValid: false, error: `지원하지 않는 파일 형식입니다. (${file.type})` };
  }
  if (file.size > MAX_FILE_SIZE) {
    return { isValid: false, error: `파일 크기가 너무 큽니다. 최대 ${MAX_FILE_SIZE / (1024 * 1024)}MB` };
  }
  return { isValid: true };
}

export default function ImagePlugin({
  fileManager, // 파일 매니저 인스턴스
  onError, // 오류 처리 콜백
  onEditorReady, // 에디터 준비 완료 콜백
}: {
  fileManager?: ImageFileManager;
  onError?: (error: Error) => void;
  onEditorReady?: (editor: any) => void;
}) {
  const [editor] = useLexicalComposerContext();

  const handleError = useCallback((e: unknown) => {
    const err = e instanceof Error ? e : new Error(String(e));
    console.error("[ImagePlugin]", err);
    onError?.(err);
  }, [onError]);

  useEffect(() => {
    onEditorReady?.(editor);
    return editor.registerCommand(
      INSERT_IMAGE_COMMAND,
      (payload) => {
        try {
          $insertNodes([$createImageNode(payload)]);
          return true;
        } catch (e) {
          handleError(e);
          return false;
        }
      },
      0
    );
  }, [editor, handleError, onEditorReady]);


  useEffect(() => {
    return editor.registerRootListener((rootElem, prevRootElem) => {
      if (prevRootElem) {
        prevRootElem.removeEventListener("paste", onPaste as EventListener);
        prevRootElem.removeEventListener("drop", onDrop as EventListener);
        prevRootElem.removeEventListener("dragover", onDragOver as EventListener);
      }
      if (rootElem) {
        rootElem.addEventListener("paste", onPaste as EventListener);
        rootElem.addEventListener("drop", onDrop as EventListener);
        rootElem.addEventListener("dragover", onDragOver as EventListener);
      }
    });
  }, [editor, fileManager, handleError]);

  const handleIncomingImage = useCallback(
    (file: File, fallbackAlt: string) => {
      const check = validateImageFile(file);
      if (!check.isValid) throw new Error(check.error);

      const tempId = uuid();
      const objectURL = URL.createObjectURL(file);

      fileManager?.rememberFile(tempId, file);

      editor.update(() => {
        $insertNodes([
          $createImageNode({
            src: objectURL,
            altText: file.name || fallbackAlt,
            tempId,
          }),
        ]);
      });
    },
    [editor, fileManager]
  );

  const onPaste = useCallback(
    (e: ClipboardEvent) => {
      try {
        const files = Array.from(e.clipboardData?.files ?? []);
        const img = files.find((f) => f.type.startsWith("image/"));
        if (!img) return;

        e.preventDefault();
        handleIncomingImage(img, "붙여넣은 이미지");
      } catch (err) {
        handleError(err);
      }
    },
    [handleIncomingImage, handleError]
  );

  const onDrop = useCallback(
    (e: DragEvent) => {
      try {
        const files = Array.from(e.dataTransfer?.files ?? []);
        const img = files.find((f) => f.type.startsWith("image/"));
        if (!img) return;

        e.preventDefault();
        handleIncomingImage(img, "드롭된 이미지");
      } catch (err) {
        handleError(err);
      }
    },
    [handleIncomingImage, handleError]
  );

  const onDragOver = useCallback((e: DragEvent) => {
    const files = Array.from(e.dataTransfer?.files ?? []);
    const hasImage = files.some((f) => f.type.startsWith("image/"));
    if (hasImage) e.preventDefault();
  }, []);
  
  return null;
}
