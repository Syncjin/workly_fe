import { PostListWidget } from "@/widgets/post-list";
import { PostListBoundary } from "@/widgets/post-list/ui/PostListBoundary";

export default function BoardPage() {
  return (
    <PostListBoundary>
      <PostListWidget />
    </PostListBoundary>
  );
}
