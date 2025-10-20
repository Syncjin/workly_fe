"use client";

import { PermissionGate } from "@/entities/permission";
import { PERM } from "@/entities/permission/lib/policies";
import { useBoardManagePermission } from "@/features/board/board-manage/model";
import Link, { LinkProps } from "next/link";
import { MouseEvent, useCallback } from "react";

type AdminBoardLinkProps = Omit<React.ComponentProps<typeof Link>, "href"> & {
  href?: LinkProps["href"];
  className?: string;
  children?: React.ReactNode;
};

export function AdminBoardLink({ className, children = "관리" }: AdminBoardLinkProps) {
  const { allowed, isPending, isError } = useBoardManagePermission();

  const onClick = useCallback(
    (e: MouseEvent<HTMLAnchorElement>) => {
      if (isPending || isError || !allowed) e.preventDefault();
    },
    [isPending, isError, allowed]
  );

  const disabled = isPending || isError || !allowed;

  return (
    <PermissionGate perm={PERM.BOARD_MANAGE} fallback={null}>
      <Link href="/admin/board" onClick={onClick} aria-disabled={disabled || undefined} className={[className].filter(Boolean).join(" ")}>
        {children}
      </Link>
    </PermissionGate>
  );
}
