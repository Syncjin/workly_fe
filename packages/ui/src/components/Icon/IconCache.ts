import type { IconName } from "@workly/icons";
import React from "react";

interface IconCacheEntry {
  component: React.ComponentType<React.SVGProps<SVGSVGElement>> | null;
  loadedAt: number;
  error?: Error;
}

export interface IconLoadingState {
  isLoading: boolean;
  error: boolean;
  component: React.ComponentType<React.SVGProps<SVGSVGElement>> | null;
}
export class IconCache {
  private cache: Map<IconName, IconCacheEntry> = new Map();
  private loadingPromises: Map<IconName, Promise<React.ComponentType<React.SVGProps<SVGSVGElement>> | null>> = new Map();
  private subscribers: Map<IconName, Set<() => void>> = new Map();

  get(name: IconName): React.ComponentType<React.SVGProps<SVGSVGElement>> | null | undefined {
    const entry = this.cache.get(name);
    return entry?.component;
  }

  has(name: IconName): boolean {
    return this.cache.has(name);
  }

  /**
   * 아이콘이 현재 로딩 중인지 확인
   * @param name 아이콘 이름
   * @returns 로딩 중 여부
   */
  isLoading(name: IconName): boolean {
    return this.loadingPromises.has(name);
  }

  /**
   * 아이콘 로딩 상태 조회
   * @param name 아이콘 이름
   * @returns 로딩 상태 객체
   */
  getLoadingState(name: IconName): IconLoadingState {
    const entry = this.cache.get(name);
    const isLoading = this.loadingPromises.has(name);

    return {
      isLoading,
      error: !!entry?.error,
      component: entry?.component ?? null,
    };
  }

  /**
   * 캐시에 아이콘 컴포넌트 저장
   * @param name 아이콘 이름
   * @param component 아이콘 컴포넌트 (null인 경우 로딩 실패)
   * @param error 에러 정보 (선택적)
   */
  private set(name: IconName, component: React.ComponentType<React.SVGProps<SVGSVGElement>> | null, error?: Error): void {
    const entry: IconCacheEntry = {
      component,
      loadedAt: Date.now(),
      error,
    };

    this.cache.set(name, entry);
    this.notifySubscribers(name);
  }

  /**
   * 캐시에서 아이콘 제거
   * @param name 아이콘 이름
   */
  delete(name: IconName): boolean {
    const deleted = this.cache.delete(name);
    if (deleted) {
      this.notifySubscribers(name);
    }
    return deleted;
  }

  /**
   * 전체 캐시 초기화
   */
  clear(): void {
    const names = Array.from(this.cache.keys());
    this.cache.clear();
    this.loadingPromises.clear();

    // 모든 구독자에게 알림
    names.forEach((name) => this.notifySubscribers(name));
  }

  /**
   * 캐시 크기 조회
   * @returns 캐시된 아이콘 수
   */
  size(): number {
    return this.cache.size;
  }

  /**
   * 캐시된 모든 아이콘 이름 조회
   * @returns 아이콘 이름 배열
   */
  keys(): IconName[] {
    return Array.from(this.cache.keys());
  }

  /**
   * 아이콘 로드 및 캐시 저장
   * 중복 로딩을 방지하고 Promise를 캐싱하여 동시 요청을 처리
   * @param name 아이콘 이름
   * @returns 로드된 아이콘 컴포넌트 또는 null (실패 시)
   */
  async load(name: IconName): Promise<React.ComponentType<React.SVGProps<SVGSVGElement>> | null> {
    // 이미 캐시된 경우 즉시 반환
    if (this.has(name)) {
      return this.get(name) ?? null;
    }

    // 이미 로딩 중인 경우 기존 Promise 반환 (중복 로딩 방지)
    if (this.loadingPromises.has(name)) {
      return this.loadingPromises.get(name)!;
    }

    // 새로운 로딩 Promise 생성
    const loadingPromise = this.loadIcon(name);
    this.loadingPromises.set(name, loadingPromise);

    // 구독자들에게 로딩 시작 알림
    this.notifySubscribers(name);

    try {
      const component = await loadingPromise;
      this.set(name, component);
      return component;
    } catch (error) {
      const err = error instanceof Error ? error : new Error(`Failed to load icon: ${name}`);
      this.set(name, null, err);
      return null;
    } finally {
      // 로딩 완료 후 Promise 제거
      this.loadingPromises.delete(name);
    }
  }

  /**
   * 실제 SVG 파일을 동적으로 import하는 내부 메서드
   * @param name 아이콘 이름
   * @returns 로드된 아이콘 컴포넌트 또는 null
   */
  private async loadIcon(name: IconName): Promise<React.ComponentType<React.SVGProps<SVGSVGElement>> | null> {
    try {
      // @workly/icons/svgs에서 SVG 파일을 동적으로 import
      const svgModule = await import(`@workly/icons/svgs/${name}.svg`);
      return svgModule.default;
    } catch (error) {
      // 테스트 환경에서는 경고를 출력하지 않음
      if (process.env.NODE_ENV !== "test") {
        console.warn(`Failed to load icon: ${name}`, error);
      }
      throw error;
    }
  }

  /**
   * 아이콘 로딩 상태 변화를 구독
   * @param name 아이콘 이름
   * @param callback 상태 변화 시 호출될 콜백 함수
   * @returns 구독 해제 함수
   */
  subscribe(name: IconName, callback: () => void): () => void {
    // 해당 아이콘의 구독자 Set이 없으면 생성
    if (!this.subscribers.has(name)) {
      this.subscribers.set(name, new Set());
    }

    const subscribers = this.subscribers.get(name)!;
    subscribers.add(callback);

    // 구독 해제 함수 반환
    return () => {
      subscribers.delete(callback);

      // 구독자가 없으면 Set 제거 (메모리 누수 방지)
      if (subscribers.size === 0) {
        this.subscribers.delete(name);
      }
    };
  }

  /**
   * 특정 아이콘의 구독자들에게 상태 변화 알림
   * @param name 아이콘 이름
   */
  private notifySubscribers(name: IconName): void {
    const subscribers = this.subscribers.get(name);
    if (subscribers) {
      subscribers.forEach((callback) => {
        try {
          callback();
        } catch (error) {
          console.error(`Error in icon cache subscriber for ${name}:`, error);
        }
      });
    }
  }
}

// 싱글톤 인스턴스로 사용
export const iconCache = new IconCache();
