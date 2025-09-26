"use client";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { COMMAND_PRIORITY_LOW } from "lexical";
import { useEffect } from "react";
import { clearFormatting } from "../lib/clearFormatting";
import { CLEAR_FORMAT_COMMAND } from "./command";

const FormatClearPlugin = () => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerCommand(
      CLEAR_FORMAT_COMMAND,
      () => {
        clearFormatting(editor);
        return true;
      },
      COMMAND_PRIORITY_LOW
    );
  }, [editor]);

  //  단축키 바인딩: Cmd/Ctrl + \
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const isMac = /Mac|iPod|iPhone|iPad/.test(navigator.platform);
      const mod = isMac ? e.metaKey : e.ctrlKey;
      if (mod && e.key === "\\") {
        e.preventDefault();
        editor.dispatchCommand(CLEAR_FORMAT_COMMAND, null);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [editor]);

  return null;
};

export default FormatClearPlugin;
