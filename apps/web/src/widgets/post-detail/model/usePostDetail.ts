import { Post, usePostDetailSuspense } from "@/entities/post";

export function usePostDetail({ postId }: { postId: number }) {
  const postRes = usePostDetailSuspense<Post>(
    { postId },
    {
      select: (resp) => resp.data,
    }
  );
  const isFetching = postRes.isFetching;
  const refetch = postRes.refetch;
  return { data: postRes.data, isFetching, refetch };
}
