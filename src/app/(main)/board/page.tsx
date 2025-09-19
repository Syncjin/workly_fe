import { PostListGate } from "@/widgets/post-list";
import { PostListBoundary } from "@/widgets/post-list/ui/PostListBoundary";

export default function BoardPage() {
  return (
    <PostListBoundary>
      <PostListGate />
    </PostListBoundary>
  );
}
