"use client";
import { PostEditorProvider, usePostEditorActions } from "@/widgets/post-editor/model";
import ArticleWriteActions from "@/widgets/post-editor/ui/ArticleWriteActions";
import BoardSelector from "@/widgets/post-editor/ui/BoardSelector";
import { Editor } from "@workly/editor";
import * as styles from "./postEditor.css";

export const EditorBody = () => {
  const { setHtml } = usePostEditorActions();

  return (
    <div className={styles.container}>
      <ArticleWriteActions />
      <BoardSelector />
      <div className={styles.editor.container}>
        <Editor
          namespace="post-editor"
          placeholder="내용을 입력하세요…"
          onChangeHTML={setHtml}
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

export const EditorContainer = () => (
  <PostEditorProvider>
    <EditorBody />
  </PostEditorProvider>
);

EditorContainer.displayName = "EditorContainer";
