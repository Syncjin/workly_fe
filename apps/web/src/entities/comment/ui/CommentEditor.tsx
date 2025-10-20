"use client";
import { Textarea } from "@workly/ui";
import { ChangeEvent, createContext, KeyboardEvent, useContext } from "react";
import * as styles from "./commentEditor.css";

type CtxValue = {
  value: string;
  name?: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyDown: (e: KeyboardEvent<HTMLTextAreaElement>) => void;
  isPending: boolean;
  error?: string | null;
  placeHolder?: string;
};
const Ctx = createContext<CtxValue | null>(null);
const useItem = () => {
  const v = useContext(Ctx);
  if (!v) throw new Error("CommentEditor.* must be used within <CommentEditor.Root>");
  return v;
};
type RootProps = React.PropsWithChildren<
  CtxValue & {
    className?: string;
  }
>;

const Root = ({ children, ...ctx }: RootProps) => {
  return (
    <Ctx.Provider value={ctx}>
      <div className={styles.textareaBox}>{children}</div>
    </Ctx.Provider>
  );
};

const Editor = () => {
  const { name = "comment", value, onChange, onKeyDown, isPending, error, placeHolder = "댓글을 입력하세요." } = useItem();
  return <Textarea name={name} className={styles.textarea} placeholder={placeHolder} value={value} onChange={onChange} onKeyDown={onKeyDown} disabled={isPending} aria-invalid={!!error} aria-describedby={error ? "comment-error" : undefined} />;
};
const ActionSlot = ({ children }: { children?: React.ReactNode }) => {
  return children;
};

export const CommentEditor = {
  Root,
  Editor,
  ActionSlot,
};
