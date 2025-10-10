import { Board } from "@/entities/board";
import { useBoardDetail } from "@/entities/board/api/boardQueries";
import { BoardCategory } from "@/entities/boardCategory";
import { useBoardCategoryList } from "@/entities/boardCategory/api/boardCategoryQueries";
import { useMemo } from "react";

export type CurrentBoard = {
  board?: Board;
  category?: BoardCategory;
};

export function useCurrentBoard({ boardId }: { boardId?: number }) {
  const boardQ = useBoardDetail<Board>(
    { boardId: boardId as number },
    {
      enabled: !!boardId,
      select: (resp) => resp.data,
    }
  );
  const categoryId = boardQ.data?.categoryId;
  const catQ = useBoardCategoryList<BoardCategory | undefined>({
    enabled: !!categoryId,
    select: (resp) => resp.data?.find((i) => i.categoryId === boardQ.data?.categoryId),
  });

  const data = useMemo<CurrentBoard>(() => {
    return {
      board: boardQ.data,
      category: catQ.data,
    };
  }, [catQ.data, boardQ.data]);

  const isFetching = catQ.isFetching || boardQ.isFetching;
  const refetch = async () => Promise.all([catQ.refetch(), boardQ.refetch()]);
  return { data, isFetching, refetch };
}
