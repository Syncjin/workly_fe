"use client";

import Link, { LinkProps } from "next/link";
import { MouseEvent, useCallback } from "react";
import { useBoardManagePermission } from "../model/useBoardManagePermission";

type AdminBoardLinkProps = Omit<React.ComponentProps<typeof Link>, "href"> & {
  href?: LinkProps["href"];
  className?: string;
  children?: React.ReactNode;
};

export function AdminBoardLink({ className, children = "관리" }: AdminBoardLinkProps) {
  const { isPermitted, isLoading, isError } = useBoardManagePermission();

  const onClick = useCallback(
    (e: MouseEvent<HTMLAnchorElement>) => {
      if (isLoading || isError || !isPermitted) e.preventDefault();
    },
    [isLoading, isError, isPermitted]
  );

  const disabled = isLoading || isError || !isPermitted;

  return (
    <Link href="/admin/board" onClick={onClick} aria-disabled={disabled || undefined} className={[className].filter(Boolean).join(" ")}>
      {children}
    </Link>
  );
}
