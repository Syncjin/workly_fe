import { useMyInfoSuspense } from "@/entities/users/api/usersQueries";
import { useMemo } from "react";

export function useBoardManagePermission() {
  const { data, isLoading, isError } = useMyInfoSuspense();

  const isPermitted = useMemo(() => {
    if (!data?.data) return false;
    return data.data.role?.includes("ROLE_ADMIN") ?? false;
  }, [data]);

  return { isPermitted, isLoading, isError };
}
