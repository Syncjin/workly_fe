"use client";

import { Comment, DEFAULT_REACTIONS, ReactionType } from "@/entities/comment";
import { ReactionPopup, type ReactionPopupOpeners } from "@/features/comment/comment-reaction-upsert";
import { formatYMDHM } from "@/shared/lib";
import { Avatar, Button, cx, Icon } from "@workly/ui";
import { createContext, useContext, useRef } from "react";
import * as styles from "./commentItem.css";

/** Context */
type CtxValue = {
  comment: Comment;
  active?: boolean;
  replyOnClick?: (comment: Comment) => void;
  reactionOnClick?: (comment: Comment) => void;
};
const Ctx = createContext<CtxValue | null>(null);
const useItem = () => {
  const v = useContext(Ctx);
  if (!v) throw new Error("CommentItem.* must be used within <CommentItem.Root>");
  return v;
};

function Profile() {
  const { comment } = useItem();

  if (comment.user.profile && comment.user.profile !== "프로필 이미지가 없습니다. 이미지를 등록해주세요.") {
    return <Avatar src={comment.user.profile} size="md" />;
  }
  return <Avatar size="md" />;
}

function Indicator() {
  const { comment } = useItem();

  if (!comment.parentId) {
    return null;
  }

  return <div className={styles.replyIndicator} />;
}

function Author() {
  const { comment } = useItem();
  return <span className={styles.author}>{comment.user.name}</span>;
}

function Date() {
  const { comment } = useItem();
  let date = comment.updatedDateTime ? formatYMDHM(comment.updatedDateTime) : formatYMDHM(comment.createdDateTime);
  return <span className={styles.date}>{date}</span>;
}

function Content() {
  const { comment } = useItem();
  return <p className={styles.content}>{comment.content}</p>;
}

function ReactionButton() {
  const { comment } = useItem();
  const reactionPopupRef = useRef<ReactionPopupOpeners>(null);

  const handleReactionClick = () => {
    reactionPopupRef.current?.open(comment);
  };

  const activeReactions = DEFAULT_REACTIONS.filter((reaction: ReactionType) => {
    const count = comment?.reactions?.[reaction.type as keyof typeof comment.reactions];
    return count && count > 0;
  });

  return (
    <div className={styles.reactionList}>
      {activeReactions.map((reaction: ReactionType) => {
        const count = comment?.reactions?.[reaction.type as keyof typeof comment.reactions];
        const isMyReaction = comment?.myReaction === reaction.type;

        return (
          <button key={reaction.type} onClick={handleReactionClick} className={`${styles.reactionBtn} ${isMyReaction ? styles.reactionBtnActive : ""}`} title={`${reaction.label} ${count}개`}>
            <span className={styles.reactionEmoji}>{reaction.emoji}</span>
            <span className={styles.reactionCount}>{count}</span>
          </button>
        );
      })}

      <div className={styles.reactionButtonWrapper}>
        <button onClick={handleReactionClick} className={styles.reactionBtn} title="반응 추가">
          <Icon name="emotion-happy-line" color="var(--color-gray-700)" />
        </button>
        <ReactionPopup ref={reactionPopupRef} />
      </div>
    </div>
  );
}

function ReplyButton() {
  const { replyOnClick, comment } = useItem();
  return (
    <Button variant="border" size="sm" color="gray-300" onClick={() => replyOnClick?.(comment)}>
      답글
    </Button>
  );
}

/** Slots: 레이아웃을 구성하는 영역들 */
function HeaderSlot({ children }: { children?: React.ReactNode }) {
  return (
    <div className={styles.header}>
      {children ?? (
        <>
          <Author />
          <Date />
        </>
      )}
    </div>
  );
}

function ContentSlot({ children }: { children?: React.ReactNode }) {
  return <div className={styles.contentArea}>{children ?? <Content />}</div>;
}

function FooterSlot({ children }: { children?: React.ReactNode }) {
  return <div className={styles.footer}>{children}</div>;
}

function RightSlot({ children }: { children?: React.ReactNode }) {
  return <div className={styles.right}>{children}</div>;
}

function ReplyFormSlot({ children }: { children?: React.ReactNode }) {
  return <>{children}</>;
}

/** Root */
type RootProps = React.PropsWithChildren<
  CtxValue & {
    as?: "li" | "div";
    className?: string;
    right?: React.ReactNode;
    footer?: React.ReactNode;
    replyForm?: React.ReactNode;
  }
>;

function Root({ as = "li", className, children, right, footer, replyForm, ...ctx }: RootProps) {
  const Comp: any = as;
  const isReply = ctx.comment.parentId ? true : false;

  const defaultContent = (
    <>
      <Indicator />
      <Profile />
      <div className={styles.main}>
        <HeaderSlot />
        <ContentSlot />
        {footer && <FooterSlot>{footer}</FooterSlot>}
      </div>
      {right && <RightSlot>{right}</RightSlot>}
    </>
  );

  const content = children ?? defaultContent;

  return (
    <Ctx.Provider value={ctx}>
      <>
        <Comp role={as === "li" ? "listitem" : undefined} className={cx(styles.container, isReply && styles.replyContainer, className)}>
          <div className={styles.commentContainer}>{content}</div>
        </Comp>
        {replyForm && <ReplyFormSlot>{replyForm}</ReplyFormSlot>}
      </>
    </Ctx.Provider>
  );
}

export const CommentItem = {
  Root,
  Profile,
  Indicator,
  Author,
  Date,
  Content,
  ReplyButton,
  ReactionButton,
  HeaderSlot,
  ContentSlot,
  FooterSlot,
  RightSlot,
  ReplyFormSlot,
};
