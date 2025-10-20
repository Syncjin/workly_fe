"use client";

import { Comment } from "@/entities/comment/model";
import { formatYMDHM } from "@/shared/lib";
import { Avatar, Button, cx } from "@workly/ui";
import { createContext, useContext } from "react";
import * as styles from "./commentItem.css";

/** Context */
type CtxValue = {
  comment: Comment;
  active?: boolean;
  replyOnClick?: (comment: Comment) => void;
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
    return <Avatar src={comment.user.profile} size={"md"} />;
  }
  return <Avatar size="md" />;
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

function ReplyButton() {
  const { replyOnClick, comment } = useItem();
  return (
    <Button variant="border" size="md" color="gray-300" onClick={() => replyOnClick?.(comment)}>
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

/** Root */
type RootProps = React.PropsWithChildren<
  CtxValue & {
    as?: "li" | "div";
    className?: string;
    right?: React.ReactNode;
    footer?: React.ReactNode;
  }
>;

function Root({ as = "li", className, children, right, footer, ...ctx }: RootProps) {
  const Comp: any = as;
  return (
    <Ctx.Provider value={ctx}>
      <Comp role={as === "li" ? "listitem" : undefined} className={cx(styles.container, className)}>
        {/* 기본 레이아웃 제공 */}
        {children ?? (
          <>
            <Profile />
            <div className={styles.main}>
              <HeaderSlot />
              <ContentSlot />
              {footer && <FooterSlot>{footer}</FooterSlot>}
            </div>
            {right && <RightSlot>{right}</RightSlot>}
          </>
        )}
      </Comp>
    </Ctx.Provider>
  );
}

export const CommentItem = {
  Root,
  Profile,
  Author,
  Date,
  Content,
  ReplyButton,
  HeaderSlot,
  ContentSlot,
  FooterSlot,
  RightSlot,
};
