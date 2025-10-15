"use client";

import { TRANSFORMERS } from "@lexical/markdown";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { CheckListPlugin } from "@lexical/react/LexicalCheckListPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { TablePlugin } from "@lexical/react/LexicalTablePlugin";
import { $createParagraphNode, $getRoot, LexicalEditor, type Klass, type LexicalNode } from "lexical";
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from "react";
import * as s from "./editor.css";
import { defaultNodes } from "./nodes";
import CodeHighlightPlugin from "./plugins/CodeHighlightPlugin";
import FormatClearPlugin from "./plugins/FormatClearPlugin";
import { HTMLIOPlugin } from "./plugins/HTMLIOPlugin";
import { ImageFileManager } from "./plugins/ImageFileManager";
import ImagesPlugin from "./plugins/ImagePlugin";
import { IMESafeHotkeyPlugin } from "./plugins/IMESafeHotkeyPlugin";
import YouTubePlugin from "./plugins/YoutubePlugin";
import { lexicalTheme as defaultTheme } from "./theme.css";
import { Toolbar } from "./Toolbar";
import type { FileDeleteAdapter, FileUploadAdapter, ImageDiff, SubmitOptions, UploadStatus } from "./types";

type Props = {
  namespace: string;
  initialJSON?: string;
  initialHTML?: string;
  onChangeJSON?: (json: string) => void;
  onChangeHTML?: (html: string) => void;
  placeholder?: string;
  onPickImageFile?: () => Promise<File | null>; // 파일 선택기
  theme?: Record<string, any>;
  nodes?: ReadonlyArray<Klass<LexicalNode>>;
  onError?: (e: Error) => void;

  // 업로드 관련
  uploadAPI?: FileUploadAdapter; // 파일 업로드 어댑터 함수
  deleteAPI?: FileDeleteAdapter; // 파일 삭제 어댑터 함수
  onUploadStart?: () => void; // 업로드 시작 콜백
  onUploadProgress?: (progress: { uploaded: number; total: number }) => void; // 진행률 콜백
  onUploadComplete?: () => void; // 업로드 완료 콜백
  onUploadError?: (error: Error) => void; // 업로드 에러 콜백
};

export type EditorRef = {
  submit: (options?: SubmitOptions) => Promise<string>;
  getCurrentJSON: () => string;
  hasUnsavedFiles: () => boolean;
  getUploadStatus: () => UploadStatus;

  // 필요 시만 사용
  getImageDiff: () => Promise<ImageDiff>;
};
export const Editor = forwardRef<EditorRef, Props>(function Editor(
  { namespace, initialJSON, initialHTML, onChangeJSON, onChangeHTML, placeholder = "내용을 작성하세요.", onPickImageFile, theme = defaultTheme, nodes = defaultNodes, onError = (e) => console.error(e), uploadAPI, deleteAPI, onUploadStart, onUploadProgress, onUploadComplete, onUploadError },
  ref
) {
  const editorRef = useRef<LexicalEditor | null>(null);
  const fileManagerRef = useRef<ImageFileManager>(new ImageFileManager());

  const initialConfig = {
    namespace,
    theme,
    nodes,
    onError,
    editorState: (editor: any) => {
      if (!initialJSON) return;
      try {
        const parsed = JSON.parse(initialJSON);
        editor.setEditorState(editor.parseEditorState(parsed));
      } catch {
        editor.update(() => {
          const root = $getRoot();
          if (root.isEmpty()) root.append($createParagraphNode());
        });
      }
    },
  } as const;

  // 파일 저장
  const rememberFile = useCallback((tempId: string, file: File) => {
    fileManagerRef.current.rememberFile(tempId, file);
  }, []);

  const submit = useCallback(
    async (options?: SubmitOptions): Promise<string> => {
      const editor = editorRef.current;
      if (!editor) throw new Error("에디터가 없음");
      return fileManagerRef.current.submit(editor, uploadAPI, deleteAPI, options, {
        onUploadStart,
        onUploadProgress,
        onUploadComplete,
        onUploadError,
      });
    },
    [uploadAPI, deleteAPI, onUploadStart, onUploadProgress, onUploadComplete, onUploadError]
  );

  const hasUnsavedFiles = useCallback((): boolean => {
    const editor = editorRef.current;
    return fileManagerRef.current.hasUnsavedFiles(editor ?? undefined);
  }, []);

  const getUploadStatus = useCallback((): UploadStatus => {
    return fileManagerRef.current.getUploadStatus();
  }, []);

  const getImageDiff = useCallback(async (): Promise<ImageDiff> => {
    const editor = editorRef.current;
    if (!editor) throw new Error("에디터가 없음");
    return fileManagerRef.current.getImageDiff(editor);
  }, []);

  const getCurrentJSON = useCallback((): string => {
    const editor = editorRef.current;
    if (!editor) throw new Error("에디터가 없음");
    return fileManagerRef.current.getCurrentJSON(editor);
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      submit,
      getCurrentJSON,
      hasUnsavedFiles,
      getUploadStatus,
      getImageDiff,
    }),
    [submit, getCurrentJSON, hasUnsavedFiles, getUploadStatus, getImageDiff]
  );

  // 초기 이미지 상태 세팅
  useEffect(() => {
    fileManagerRef.current.setInitialImageState(initialJSON);
  }, [initialJSON]);

  // 언마운트 시 파일 저장소 정리
  useEffect(() => {
    return () => fileManagerRef.current.clearFileStore();
  }, []);

  // 콘텐츠 변경 핸들러 (빈 컨텐츠 → 빈 문자열 제공)
  const handleChange = useCallback(
    (editorState: any) => {
      if (!onChangeJSON) return;

      try {
        editorRef.current?.getEditorState().read(() => {
          const root = $getRoot();
          const children = root.getChildren();
          const isEmpty = children.length === 0 || (children.length === 1 && children[0].getTextContent().trim() === "");
          if (isEmpty) {
            onChangeJSON("");
            return;
          }
          onChangeJSON(JSON.stringify(editorState));
        });
      } catch {
        onChangeJSON(JSON.stringify(editorState));
      }

      // 약간 지연 후 미사용 파일 정리
      const ed = editorRef.current;
      if (ed) setTimeout(() => fileManagerRef.current.cleanupUnusedFiles(ed), 120);
    },
    [onChangeJSON]
  );

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className={s.editorRoot}>
        <Toolbar onPickImageFile={onPickImageFile} rememberFile={rememberFile} />

        <div className={s.editorSurface}>
          <RichTextPlugin contentEditable={<ContentEditable className={s.contentEditable} aria-label="에디터" spellCheck={false} />} placeholder={<div className={s.placeholder}>{placeholder}</div>} ErrorBoundary={LexicalErrorBoundary} />
          <HistoryPlugin />
          <ListPlugin />
          <CheckListPlugin />
          <LinkPlugin />
          <TablePlugin />
          <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
          <AutoFocusPlugin />
          <OnChangePlugin onChange={handleChange} />
          <IMESafeHotkeyPlugin />
          <FormatClearPlugin />
          <CodeHighlightPlugin />
          <HTMLIOPlugin initialHTML={initialHTML} onExportHTML={onChangeHTML} />
          <ImagesPlugin
            fileManager={fileManagerRef.current}
            onError={onError}
            onEditorReady={(ed) => {
              editorRef.current = ed;
            }}
          />
          <YouTubePlugin />
        </div>
      </div>
    </LexicalComposer>
  );
});

export default Editor;
