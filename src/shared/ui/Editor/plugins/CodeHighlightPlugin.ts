"use client";

import { CODE_LANGUAGE_COMMAND } from "@/shared/ui/Editor/plugins/command";
import { $isCodeNode, registerCodeHighlighting } from "@lexical/code";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getNearestNodeOfType, mergeRegister } from "@lexical/utils";
import { $getSelection, $isRangeSelection, COMMAND_PRIORITY_CRITICAL, LexicalEditor } from "lexical";
import { useEffect } from "react";

export default function CodeHighlightPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return mergeRegister(registerCodeHighlighting(editor), registerCodeLanguageSelecting(editor));
  }, [editor]);

  return null;
}

function registerCodeLanguageSelecting(editor: LexicalEditor): () => void {
  return editor.registerCommand(
    CODE_LANGUAGE_COMMAND,
    (language, editor) => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return false;

      const anchorNode = selection.anchor.getNode();
      const targetNode = $isCodeNode(anchorNode) ? anchorNode : $getNearestNodeOfType(anchorNode, CodeNode);
      if (!targetNode) return false;

      editor.update(() => {
        targetNode.setLanguage(language);
      });

      return true;
    },
    COMMAND_PRIORITY_CRITICAL
  );
}
