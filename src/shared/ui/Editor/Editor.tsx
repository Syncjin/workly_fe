"use client";

import { TRANSFORMERS } from "@lexical/markdown";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
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
import { $createParagraphNode, $getRoot, type Klass, type LexicalNode } from "lexical";
import { useCallback } from "react";

import CodeHighlightPlugin from "@/shared/ui/Editor/plugins/CodeHighlightPlugin";
import FormatClearPlugin from "@/shared/ui/Editor/plugins/FormatClearPlugin";
import * as s from "./editor.css";
import { defaultNodes } from "./nodes";
import { HTMLIOPlugin } from "./plugins/HTMLIOPlugin";
import { ImagePlugin } from "./plugins/ImagePlugin";
import { IMESafeHotkeyPlugin } from "./plugins/IMESafeHotkeyPlugin";
import { lexicalTheme as defaultTheme } from "./theme.css";
import { Toolbar } from "./Toolbar";

type Props = {
  namespace: string;
  initialJSON?: string;
  initialHTML?: string;
  onChangeJSON?: (json: string) => void;
  onChangeHTML?: (html: string) => void;
  placeholder?: string;
  onPickImageFile?: () => Promise<{ url: string; width?: number; height?: number; alt?: string } | null>;
  theme?: Record<string, any>;
  nodes?: ReadonlyArray<Klass<LexicalNode>>;
  onError?: (e: Error) => void;
};
export function Editor({ namespace, initialJSON, initialHTML, onChangeJSON, onChangeHTML, placeholder = "여기에 작성하세요…", onPickImageFile, theme = defaultTheme, nodes = defaultNodes, onError = (e) => console.error(e) }: Props) {
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

  const handleChange = useCallback(
    (editorState: any) => {
      if (!onChangeJSON) return;
      const json = JSON.stringify(editorState);
      onChangeJSON(json);
    },
    [onChangeJSON]
  );

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className={s.editorRoot}>
        <Toolbar />

        <div className={s.editorSurface}>
          <RichTextPlugin contentEditable={<ContentEditable className={s.contentEditable} aria-label="에디터" spellCheck={false} />} placeholder={<div className={s.placeholder}>{placeholder}</div>} ErrorBoundary={LexicalErrorBoundary} />

          <HistoryPlugin />
          <ListPlugin />
          <LinkPlugin />
          <TablePlugin />
          <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
          <AutoFocusPlugin />
          <OnChangePlugin onChange={handleChange} />
          <IMESafeHotkeyPlugin />
          <FormatClearPlugin />
          <CodeHighlightPlugin />
          <HTMLIOPlugin initialHTML={initialHTML} onExportHTML={onChangeHTML} />
          <ImagePlugin onPickFile={onPickImageFile} />
        </div>
      </div>
    </LexicalComposer>
  );
}
