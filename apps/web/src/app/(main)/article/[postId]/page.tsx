import { PostDetailContainer } from "@/widgets/post-detail";

type PageProps = {
  params: Promise<{ postId: string }>;
};
export default async function ArticleDetailPage({ params }: PageProps) {
  const { postId } = await params;
  const id = Number(postId);

  return <PostDetailContainer postId={id} />;
}
