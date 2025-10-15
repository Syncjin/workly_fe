"use client";
import { useFileDelete, useFileUpload } from "@/entities/file/api";
import { Post } from "@/entities/post";
import { log } from "@/lib/logger";
import { usePostDetail } from "@/widgets/post-detail/model";
import { PostEditorProvider, usePostEditorActions } from "@/widgets/post-editor/model";
import ArticleWriteActions from "@/widgets/post-editor/ui/ArticleWriteActions";
import BoardSelector from "@/widgets/post-editor/ui/BoardSelector";
import { Editor, EditorRef } from "@workly/editor";
import { useCallback, useEffect, useRef } from "react";
import * as styles from "./postEditor.css";

export const EditorBody = ({ post }: { post?: Post }) => {
  const { setJson, setTitle, setPost } = usePostEditorActions();
  const editorRef = useRef<EditorRef>(null);
  const { mutateAsync: uploadMutate } = useFileUpload();
  const { mutateAsync: deleteMutate } = useFileDelete();

  const uploadAPI = useCallback(async (files: File[]) => {
    const result = await uploadMutate({ files });
    return result.data.map((item) => ({
      fileId: item.fileId,
      fileUrl: item.fileUrl,
    }));
  }, []);

  const deleteAPI = useCallback(async (fileId: string) => {
    try {
      await deleteMutate({ fileId: fileId });
    } catch (error) {
      log.error("Delete API 실패:", error);
    }
  }, []);

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setPost(post);
      setJson(post.content);
    }
  }, [post]);

  return (
    <div className={styles.container}>
      <ArticleWriteActions editor={editorRef} />
      <BoardSelector />
      <div className={styles.editor.container}>
        <Editor ref={editorRef} namespace="post-editor" placeholder="내용을 입력하세요…" onChangeJSON={setJson} initialJSON={post?.content} uploadAPI={uploadAPI} deleteAPI={deleteAPI} />
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
