import { CommentCreate } from "@/features/comment/comment-create";
import { CommentActionHeader } from "@/widgets/comment-thread/ui";
import { CommentList } from "@/widgets/comment-thread/ui/CommentList";
import { PostDetailContainer } from "@/widgets/post-detail";

type PageProps = {
  params: Promise<{ postId: string }>;
};
export default async function ArticleDetailPage({ params }: PageProps) {
  const { postId } = await params;
  const id = Number(postId);

  return (
    <>
      <PostDetailContainer postId={id} />
      <CommentActionHeader />
      <CommentList postId={id} />
      <CommentCreate postId={id} />
    </>
  );
}
