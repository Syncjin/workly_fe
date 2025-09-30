"use client";

import * as React from "react";
import { useStore } from "zustand";
import { createStore, type StoreApi } from "zustand/vanilla";

type SelectionState = {
  visibleIds: number[]; // 보이는 ㅌpostlistItem postId
  selected: Set<number>; // 체크된 postlistItem postId
  scopeKey: string | null;

  setVisible: (ids: number[]) => void;
  setScopeKey: (key: string, reset?: boolean) => void;

  toggle: (id: number, next?: boolean) => void;
  clearAll: () => void;
  selectAllVisible: () => void;
  clearVisible: () => void;
};

/**
 * Selection Store는 PostList 내부에서만 사용할 것으로 전역으로 공개되지 않고 Provider에 주입합니다.
 */
function makeStore() {
  return createStore<SelectionState>((set) => ({
    visibleIds: [],
    selected: new Set(),
    scopeKey: null,

    setVisible: (ids) => set({ visibleIds: ids }),
    setScopeKey: (key, reset = true) => set((s) => (s.scopeKey === key ? s : { scopeKey: key, selected: reset ? new Set() : s.selected })),

    toggle: (id, next) =>
      set((s) => {
        const sel = new Set(s.selected);
        const should = typeof next === "boolean" ? next : !sel.has(id);
        if (should) {
          sel.add(id);
        } else {
          sel.delete(id);
        }
        return { selected: sel };
      }),

    clearAll: () => set({ selected: new Set() }),

    selectAllVisible: () =>
      set((s) => {
        const sel = new Set(s.selected);
        for (const id of s.visibleIds) sel.add(id);
        return { selected: sel };
      }),

    clearVisible: () =>
      set((s) => {
        const sel = new Set(s.selected);
        for (const id of s.visibleIds) sel.delete(id);
        return { selected: sel };
      }),
  }));
}

/** --- React Context에 '스토어 인스턴스'를 담는다 --- */
const SelectionStoreContext = React.createContext<StoreApi<SelectionState> | null>(null);

/** Provider: 한 번만 스토어 생성 → Context로 주입 */
export function SelectionStoreProvider({
  children,
  scopeKey,
  resetOnScopeChange = true,
}: {
  children: React.ReactNode;
  scopeKey: string; // boardId/categoryId/keyword만 포함 (page/size 제외)
  resetOnScopeChange?: boolean; // 필터 변경 시 선택 초기화 여부
}) {
  const [store] = React.useState(() => makeStore());

  // scopeKey 변경 반영(사이드이펙트)
  React.useEffect(() => {
    store.getState().setScopeKey(scopeKey, resetOnScopeChange);
  }, [store, scopeKey, resetOnScopeChange]);

  return <SelectionStoreContext.Provider value={store}>{children}</SelectionStoreContext.Provider>;
}

/** 공용 훅: Context에서 store를 꺼내 selector 구독 */
export function useSelectionStore<T>(selector: (s: SelectionState) => T) {
  const store = React.useContext(SelectionStoreContext);
  if (!store) throw new Error("Missing <SelectionStoreProvider>");
  return useStore(store, selector);
}

/** 파생 훅들(프리미티브만 반환 → 리렌더/스냅샷 경고 방지) */
export function usePageSelectionMeta() {
  // 개별 값들을 구독하여 안정성 확보 (객체 생성 방지)
  const total = useSelectionStore((s) => s.visibleIds.length);
  const totalSelected = useSelectionStore((s) => s.selected.size);

  // 선택된 항목 수를 별도로 계산하되 메모이제이션 적용
  const countOnPage = useSelectionStore((s) => {
    let count = 0;
    for (let i = 0; i < s.visibleIds.length; i++) {
      if (s.selected.has(s.visibleIds[i])) count++;
    }
    return count;
  });

  // 파생 상태들을 메모이제이션
  return React.useMemo(
    () => ({
      total,
      countOnPage,
      isAllCheck: total > 0 && countOnPage === total,
      isIndeterminateOnPage: countOnPage > 0 && countOnPage < total,
      totalSelected,
    }),
    [total, countOnPage, totalSelected]
  );
}

export function useIsSelected(id: number) {
  return useSelectionStore((s) => s.selected.has(id));
}

export function useSyncVisibleIds(ids: number[]) {
  const setVisible = useSetVisible();

  const idsString = React.useMemo(() => ids.join(","), [ids]);

  React.useEffect(() => {
    setVisible(ids);
  }, [setVisible, idsString]); // 문자열 비교로 불필요한 리렌더링 방지
}

/** 개별 액션 훅들 - 안정적인 참조 보장 */
export function useToggleSelection() {
  return useSelectionStore((s) => s.toggle);
}

export function useClearAllSelection() {
  return useSelectionStore((s) => s.clearAll);
}

export function useSelectAllVisible() {
  return useSelectionStore((s) => s.selectAllVisible);
}

export function useClearVisible() {
  return useSelectionStore((s) => s.clearVisible);
}

export function useSetVisible() {
  return useSelectionStore((s) => s.setVisible);
}

export function useSelectedPostIdsOnPage() {
  const { visibleIds, selected } = useSelectionStore((s) => s);
  return visibleIds.filter((id) => selected.has(id));
}

export function useSelectionActions() {
  const toggle = useToggleSelection();
  const clearAll = useClearAllSelection();
  const selectAllVisible = useSelectAllVisible();
  const clearVisible = useClearVisible();
  const setVisible = useSetVisible();
  const setScopeKey = useSelectionStore((s) => s.setScopeKey);

  return React.useMemo(
    () => ({
      toggle,
      clearAll,
      selectAllVisible,
      clearVisible,
      setVisible,
      setScopeKey,
    }),
    [toggle, clearAll, selectAllVisible, clearVisible, setVisible, setScopeKey]
  );
}
