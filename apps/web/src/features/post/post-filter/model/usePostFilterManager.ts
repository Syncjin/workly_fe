import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export const usePostFilterManager = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentFilter = (searchParams?.get("filter") as "all" | "unread") || "all";

  const setFilter = useCallback(
    (filter: "all" | "unread") => {
      const next = new URLSearchParams(searchParams || "");

      if (filter !== "all") {
        next.set("filter", filter);
      } else {
        next.delete("filter");
      }

      next.delete("page");

      router.push(`${pathname}?${next.toString()}`, { scroll: false });
    },
    [searchParams, router, pathname]
  );

  return {
    filter: currentFilter,
    setFilter,
  };
};
