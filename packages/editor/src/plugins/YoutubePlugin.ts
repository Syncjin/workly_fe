import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $insertNodes, COMMAND_PRIORITY_EDITOR } from "lexical";
import { JSX, useEffect } from "react";

import { $createYouTubeNode, YouTubeNode } from "../nodes/YouTubeNode";

import { INSERT_YOUTUBE_COMMAND } from "./command";

export type InsertYouTubePayload = {
  videoID: string;
  width?: number;
  height?: number;
};

export default function YouTubePlugin({ contentMaxWidth }: { contentMaxWidth?: number }): JSX.Element | null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([YouTubeNode])) {
      throw new Error("YouTubePlugin: YouTubeNode not registered on editor");
    }

    return editor.registerCommand<InsertYouTubePayload | string>(
      INSERT_YOUTUBE_COMMAND,
      (payload) => {
        let youTubeNode: YouTubeNode;

        if (typeof payload === "string") {
          youTubeNode = $createYouTubeNode(payload, 560, 315);
        } else {
          youTubeNode = $createYouTubeNode(payload.videoID, payload.width || 560, payload.height || 315);
        }

        $insertNodes([youTubeNode]);
        return true;
      },
      COMMAND_PRIORITY_EDITOR
    );
  }, [editor]);

  useEffect(() => {
    YouTubeNode.setContainerMaxWidth(contentMaxWidth);
  }, [contentMaxWidth]);

  return null;
}
