"use client";
import { Post } from "@/entities/post";
import { usePostDetail } from "@/widgets/post-detail/model";
import { PostEditorProvider, usePostEditorActions } from "@/widgets/post-editor/model";
import ArticleWriteActions from "@/widgets/post-editor/ui/ArticleWriteActions";
import BoardSelector from "@/widgets/post-editor/ui/BoardSelector";
import { Editor } from "@workly/editor";
import { useEffect } from "react";
import * as styles from "./postEditor.css";

export const EditorBody = ({ post }: { post?: Post }) => {
  const { setJson, setTitle, setPost } = usePostEditorActions();
  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setPost(post);
      setJson(post.content);
    }
  }, [post]);

  return (
    <div className={styles.container}>
      <ArticleWriteActions />
      <BoardSelector />
      <div className={styles.editor.container}>
        <Editor
          namespace="post-editor"
          placeholder="내용을 입력하세요…"
          onChangeJSON={setJson}
          initialJSON={post?.content}
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
  <PostEditorProvider key="create">
    <EditorBody />
  </PostEditorProvider>
);

EditorContainer.displayName = "EditorContainer";

export const EditorEditContainer = ({ postId }: { postId: number }) => {
  const { data } = usePostDetail({ postId });

  return <PostEditorProvider key={`edit-${postId}`}>{data && <EditorBody post={data} />}</PostEditorProvider>;
};

EditorEditContainer.displayName = "EditorEditContainer";
