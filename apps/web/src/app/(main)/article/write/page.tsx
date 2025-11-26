import { EditorContainer, EditorEditContainer } from "@/widgets/post-editor";

type PageProps = {
  searchParams: Promise<{ postId: string }>;
};

export default async function ArticleWritePage({ searchParams }: PageProps) {
  const { postId } = await searchParams;

  const id = Number(postId);
  const isEdit = Number.isFinite(id) && id > 0;
  return isEdit ? <EditorEditContainer postId={id} /> : <EditorContainer />;
}
