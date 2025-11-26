"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

// 사이드바 Context 타입 정의
interface SidebarContextValue {
  isCollapsed: boolean;
  toggle: () => void;
}

// Context 생성
const SidebarContext = createContext<SidebarContextValue | null>(null);

// 세션 스토리지 관리 함수들
const STORAGE_KEY = "sidebar-state";

const saveSidebarState = (isCollapsed: boolean) => {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ isCollapsed }));
  } catch (error) {
    console.warn("Failed to save sidebar state:", error);
  }
};

const loadSidebarState = (): boolean => {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.isCollapsed ?? false;
    }
  } catch (error) {
    console.warn("Failed to load sidebar state:", error);
  }
  return false; // 기본값: 확장 상태
};

// SidebarProvider 컴포넌트
interface SidebarProviderProps {
  children: React.ReactNode;
}

export function SidebarProvider({ children }: SidebarProviderProps) {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  // 컴포넌트 마운트 시 세션 스토리지에서 상태 복원
  useEffect(() => {
    const savedState = loadSidebarState();
    setIsCollapsed(savedState);
  }, []);

  // 상태 토글 함수
  const toggle = () => {
    setIsCollapsed((prev) => {
      const newState = !prev;
      saveSidebarState(newState);
      return newState;
    });
  };

  // Context 값 메모이제이션으로 불필요한 리렌더링 방지
  const contextValue = useMemo(
    () => ({
      isCollapsed,
      toggle,
    }),
    [isCollapsed]
  );

  return <SidebarContext.Provider value={contextValue}>{children}</SidebarContext.Provider>;
}

// useSidebar 커스텀 훅
export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within SidebarProvider");
  }
  return context;
};
