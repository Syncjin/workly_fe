"use client";

import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { ListItemNode, ListNode } from "@lexical/list";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { TablePlugin } from "@lexical/react/LexicalTablePlugin";
import { HeadingNode } from "@lexical/rich-text";
import { $createParagraphNode, $getRoot, type Klass, type LexicalNode } from "lexical";

import CodeHighlightPlugin from "./plugins/CodeHighlightPlugin";

import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { lexicalTheme as defaultTheme } from "./theme.css";

type Props = {
  namespace: string;
  initialJSON?: string;
  theme?: Record<string, any>;
  nodes?: ReadonlyArray<Klass<LexicalNode>>;
  onError?: (e: Error) => void;
  contentClassName?: string;
};

export function EditorViewer({
  namespace,
  initialJSON,
  theme = defaultTheme,
  nodes = [HeadingNode, ListNode, ListItemNode, LinkNode, AutoLinkNode, CodeNode, CodeHighlightNode, TableNode, TableRowNode, TableCellNode /*, ImageNode, YouTubeNode*/],
  onError = (e) => console.error(e),
  contentClassName,
}: Props) {
  const initialConfig = {
    namespace,
    theme,
    nodes,
    editable: false,
    onError,
    editorState: (editor: any) => {
      try {
        const parsed = typeof initialJSON === "string" ? JSON.parse(initialJSON) : initialJSON;
        const state = editor.parseEditorState(parsed);
        editor.setEditorState(state);
      } catch {
        editor.update(() => {
          const root = $getRoot();
          root.clear();
          root.append($createParagraphNode());
        });
      }
    },
  } as const;

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <RichTextPlugin
        contentEditable={<ContentEditable aria-readonly className={contentClassName}/>}
        placeholder={null}
        ErrorBoundary={LexicalErrorBoundary}
      />
      <ListPlugin />
      <LinkPlugin />
      <TablePlugin />
      <CodeHighlightPlugin />
    </LexicalComposer>
  );
}

export default EditorViewer;