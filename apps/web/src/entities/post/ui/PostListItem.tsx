"use client";

import { Post } from "@/entities/post/model";
import { postListItemStyles } from "@/entities/post/ui/postListItem.css";
import { formatDayOrTime, formatYMDHM } from "@/shared/lib/format/date/formatters";
import { CheckBox, cx, Icon } from "@workly/ui";
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
  const { post } = useItem();
  return (
    <h3 className={postListItemStyles.title} title={post.title}>
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
      {typeof post.likesCount === "number" && (
        <div className={postListItemStyles.like}>
          <Icon name="thumb-up-line" color="var(--color-gray-500)" size={{ width: 14, height: 14 }} />
          <span aria-label="좋아요 수">{post.likesCount.toLocaleString()}</span>
        </div>
      )}
    </div>
  );
}

function BottomContentWithoutAuthor() {
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
      {typeof post.likesCount === "number" && (
        <div className={postListItemStyles.like}>
          <Icon name="thumb-up-line" color="var(--color-gray-500)" size={{ width: 14, height: 14 }} />
          <span aria-label="좋아요 수">{post.likesCount.toLocaleString()}</span>
        </div>
      )}
    </div>
  );
}

function DeletedDate() {
  const { post } = useItem();
  if (!post.trashedDateTime) return null;
  return <div className={postListItemStyles.deletedDate}>삭제일: {formatYMDHM(post.trashedDateTime)}</div>;
}

function RequiredBadge() {
  const { post } = useItem();
  if (!post.mustRead) return null;

  return (
    <div className={postListItemStyles.requiredBadge}>
      <Icon name="star-line" color="var(--color-brand-500)" size={{ width: 14, height: 14 }} />
    </div>
  );
}

function BookmarkedDate() {
  const { post } = useItem();
  if (!post.isBookmarked) return null;

  return <div className={postListItemStyles.bookmarkedDate}>스크랩일: {formatDayOrTime(post.createdDateTime)}</div>;
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

function Root({ as = "li", className, children, hideLeft, hideRight, hideBottomMeta, onClick, ...ctx }: RootProps) {
  const Comp: any = as;
  return (
    <Ctx.Provider value={ctx}>
      <Comp role={as === "li" ? "listitem" : undefined} onClick={onClick ? () => onClick(ctx.post) : undefined} data-active={ctx.active ? "true" : "false"} data-checked={ctx.checked ? "true" : "false"} aria-selected={ctx.checked ?? false} className={cx(postListItemStyles.container, className)}>
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
  BottomContentWithoutAuthor,
  Check,
  DeletedDate,
  RequiredBadge,
  BookmarkedDate,
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
