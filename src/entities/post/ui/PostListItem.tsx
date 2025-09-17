"use client";

import { Post } from "@/entities/post/model";
import { postListItemStyles } from "@/entities/post/ui/postListItem.css";
import { formatDayOrTime } from "@/shared/lib/date/formatters";
import CheckBox from "@/shared/ui/CheckBox";
import React, { createContext, useContext } from "react";

/** Context */
type CtxValue = {
  post: Post;
  active?: boolean;
  onClick?: (post: Post) => void;
  checked?: boolean;
  onCheckedChange?: (next: boolean) => void;
  selectable?: boolean; // true면 강제로 체크박스 노출
};
const Ctx = createContext<CtxValue | null>(null);
const useItem = () => {
  const v = useContext(Ctx);
  if (!v) throw new Error("PostListItem.* must be used within <PostListItem.Root>");
  return v;
};

/** 기본 렌더러 */
function LeftSlot({ children }: { children?: React.ReactNode }) {
  return <div className={postListItemStyles.checkView}>{children ?? <Check />}</div>;
}
function CenterSlot({ children }: { children?: React.ReactNode }) {
  return (
    <div className={postListItemStyles.contentView}>
      {children ?? (
        <>
          <Title />
          <BottomContent />
        </>
      )}
    </div>
  );
}
function RightSlot({ children }: { children?: React.ReactNode }) {
  const { post } = useItem();
  const fallback = <Date>{formatDayOrTime(post.createdDateTime)}</Date>;
  return <div className={postListItemStyles.rightView}>{children ?? fallback}</div>;
}

/** Primitive Parts */
function Check() {
  const { selectable, onCheckedChange, checked } = useItem();
  if (!selectable && !onCheckedChange) return null;

  const stop = (e: React.SyntheticEvent) => {
    e.stopPropagation();
  };

  return (
    <div onClick={stop} onPointerDown={stop} onKeyDown={stop}>
      <CheckBox aria-label="select post" checked={!!checked} onChange={(e: React.ChangeEvent<HTMLInputElement>) => onCheckedChange?.(e.target.checked)} />
    </div>
  );
}

function Title() {
  const { post, onClick } = useItem();
  return (
    <h3 className={postListItemStyles.title} title={post.title} onClick={onClick ? () => onClick(post) : undefined} role={onClick ? "button" : undefined}>
      {post.title}
    </h3>
  );
}

const Date: React.FC<React.PropsWithChildren> = ({ children }) => {
  return <span className={postListItemStyles.date}>{children}</span>;
};

function BottomContent() {
  const { post } = useItem();
  return (
    <div className={postListItemStyles.bottomContentView}>
      <span className={postListItemStyles.boardName}>{post?.board?.boardName ?? ""}</span>
      {typeof post.readCount === "number" && (
        <>
          <span aria-label="읽음 수">읽음 {post.readCount.toLocaleString()}</span>
          <span aria-hidden>·</span>
        </>
      )}
      {typeof post.commentsCount === "number" && (
        <>
          <span aria-label="댓글 수">댓글 {post.commentsCount.toLocaleString()}</span>
          <span aria-hidden>·</span>
        </>
      )}
      {typeof post.likesCount === "number" && <span aria-label="좋아요 수">좋아요 {post.likesCount.toLocaleString()}</span>}
    </div>
  );
}

/** Layout */
function Layout({ children }: { children: React.ReactNode }) {
  // 커스텀 레이아웃: 사용자가 Left/Center/Right를 원하는 순서로 배치
  return <>{children}</>;
}

/** Root */
type RootProps = React.PropsWithChildren<
  CtxValue & {
    as?: "li" | "div";
    className?: string;

    /** 기본 렌더러 제어용 편의 옵션 */
    hideLeft?: boolean;
    hideRight?: boolean;
    hideBottomMeta?: boolean; // BottomContent를 감추고 싶을 때
  }
>;

function Root({ as = "li", className, children, hideLeft, hideRight, hideBottomMeta, ...ctx }: RootProps) {
  const Comp: any = as;

  return (
    <Ctx.Provider value={ctx}>
      <Comp role={as === "li" ? "listitem" : undefined} data-active={ctx.active ? "true" : "false"} className={[postListItemStyles.container, className].filter(Boolean).join(" ")}>
        {children ?? (
          <>
            {!hideLeft && <LeftSlot />}
            <CenterSlot>
              <Title />
              {!hideBottomMeta && <BottomContent />}
            </CenterSlot>
            {!hideRight && <RightSlot />}
          </>
        )}
      </Comp>
    </Ctx.Provider>
  );
}

export const PostListItem = {
  Root,
  Layout,
  Left: LeftSlot,
  Center: CenterSlot,
  Right: RightSlot,

  Title,
  Date,
  BottomContent,
  Check,
};

export default PostListItem;

/** ================== 사용 예시 ==================
1) 기본:
<PostListItem.Root post={post} />

2) 체크 가능 + onClick:
<PostListItem.Root post={post} selectable checked={selected} onCheckedChange={setSelected} onClick={open} />

3) 커스텀 레이아웃:
<PostListItem.Root post={post}>
  <PostListItem.Left /> 
  <PostListItem.Center>
    <PostListItem.Title />
    <div>커스텀 메타</div>
  </PostListItem.Center>
  <PostListItem.Right>
    <PostListItem.Date>{format(post.createdDateTime)}</PostListItem.Date>
  </PostListItem.Right>
</PostListItem.Root>

4) 하단 메타 숨김:
<PostListItem.Root post={post} hideBottomMeta />
===================================================== */
