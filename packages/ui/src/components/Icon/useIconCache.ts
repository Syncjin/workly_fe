import React from "react";

import { iconCache, type IconLoadingState } from "./IconCache";

import type { IconName } from "@workly/icons";

export interface UseIconCacheResult {
  component: React.ComponentType<React.SVGProps<SVGSVGElement>> | null;
  isLoading: boolean;
  error: boolean;
}

const INITIAL_ICON_STATE: IconLoadingState = Object.freeze({
  isLoading: false,
  error: false,
  component: null,
});

export function useIconCache(name: IconName): UseIconCacheResult {
  const stateRef = React.useRef<IconLoadingState | null>(null);

  const getSnapshot = React.useCallback(() => {
    const currentState = iconCache.getLoadingState(name);

    if (!stateRef.current || stateRef.current.isLoading !== currentState.isLoading || stateRef.current.error !== currentState.error || stateRef.current.component !== currentState.component) {
      stateRef.current = currentState;
    }

    return stateRef.current;
  }, [name]);

  const getServerSnapshot = React.useCallback(() => INITIAL_ICON_STATE, []);

  const subscribe = React.useCallback((callback: () => void) => iconCache.subscribe(name, callback), [name]);

  const state = React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  React.useEffect(() => {
    if (!iconCache.has(name) && !iconCache.isLoading(name)) {
      iconCache.load(name).catch(() => {});
    }
  }, [name]);

  return React.useMemo(
    () => ({
      component: state.component,
      isLoading: state.isLoading,
      error: state.error,
    }),
    [state.component, state.isLoading, state.error]
  );
}
