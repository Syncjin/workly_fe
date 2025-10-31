"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export const usePageSizeManager = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentPageSize = parseInt(searchParams?.get("size") || "10", 10);

  const setPageSize = useCallback(
    (size: number) => {
      const next = new URLSearchParams(searchParams || "");

      if (size !== 10) {
        next.set("size", size.toString());
      } else {
        next.delete("size");
      }

      next.delete("page");

      router.push(`${pathname}?${next.toString()}`, { scroll: false });
    },
    [searchParams, router, pathname]
  );

  return {
    pageSize: currentPageSize,
    setPageSize,
  };
};
