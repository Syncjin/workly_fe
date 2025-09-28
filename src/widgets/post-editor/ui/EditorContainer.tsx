// import { Editor } from "@/widgets/post-editor/ui/Editor";
"use client";
import ArticleWriteActions from "@/widgets/post-editor/ui/ArticleWriteActions";
import BoardSelector from "@/widgets/post-editor/ui/BoartSelector";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import * as styles from "./postEditor.css";
const Editor = dynamic(() => import("@/shared/ui/Editor").then((mod) => mod.Editor), { ssr: false });

export const EditorContainer = () => {
  const [html, setHtml] = useState<string>("");
  const [json, setJson] = useState<string>("");

  useEffect(() => {
    console.log("html,", html);
  }, [html]);
  return (
    <div className={styles.container}>
      <ArticleWriteActions />
      <BoardSelector />
      <div className={styles.editor.container}>
        <Editor
          namespace="post-editor"
          placeholder="내용을 입력하세요…"
          onChangeHTML={setHtml}
          onChangeJSON={setJson}
          onPickImageFile={async () => {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = "image/*";
            return new Promise((resolve) => {
              input.onchange = async () => {
                const file = input.files?.[0];
                if (!file) return resolve(null);
                const url = URL.createObjectURL(file); // 데모: 업로드 대신 blob URL
                resolve({ url, alt: file.name });
              };
              input.click();
            });
          }}
        />
      </div>
    </div>
  );
};
