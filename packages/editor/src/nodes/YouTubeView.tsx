"use client";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getNodeByKey } from "lexical";
import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { $isYouTubeNode } from "./YoutubeNode";

type Props = {
  videoID: string;
  width?: number;
  height?: number;
  nodeKey: string;
  isEditable?: boolean;
  minSize?: number;
};

type LoadingState = "loading" | "loaded" | "error";
type Size = {
  w?: number;
  h?: number;
};

export function YouTubeView({ videoID, width, height, nodeKey, isEditable = true, minSize = 200 }: Props) {
  const [editor] = useLexicalComposerContext();

  // 렌더 사이즈 상태
  const [size, setSize] = useState<Size>({ w: width, h: height });
  const initialSizeRef = useRef<Size>({ w: width, h: height });

  const [loadingState, setLoadingState] = useState<LoadingState>("loading");

  // 리사이징 중 여부
  const isResizingRef = useRef(false);
  const [isResizing, setIsResizing] = useState(false);

  // div 컨테이너 요소
  const containerRef = useRef<HTMLDivElement | null>(null);

  // props 크기 변경 시 내부 상태 동기화
  useLayoutEffect(() => {
    setSize({ w: width, h: height });
    initialSizeRef.current = { w: width, h: height };
  }, [width, height]);

  // YouTube 표준 16:9 종횡비
  const aspectRef = useRef<number>(16 / 9);

  // 미디어 로딩 핸들러 (iframe 또는 이미지)
  const handleMediaLoad = useCallback(() => {
    setLoadingState("loaded");
  }, []);

  const handleMediaError = useCallback(() => {
    setLoadingState("error");
  }, []);

  // 리사이즈
  const startPointRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const startSizeRef = useRef<{ w: number; h: number }>({ w: width ?? 560, h: height ?? 315 });
  const rafRef = useRef<number | null>(null);
  const pendingSizeRef = useRef<{ w: number; h: number } | null>(null);

  const flushRaf = () => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  };

  const scheduleRaf = () => {
    if (rafRef.current !== null) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      const next = pendingSizeRef.current;

      if (next) {
        setSize(next);
        pendingSizeRef.current = null;

        // div 컨테이너에 직접 스타일 적용하여 즉시 반영
        if (containerRef.current) {
          containerRef.current.style.width = `${next.w}px`;
          containerRef.current.style.height = `${next.h}px`;
        }
      }
    });
  };

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!isEditable || loadingState === "error") return;

      e.preventDefault();
      e.stopPropagation();

      // 활성화
      isResizingRef.current = true;
      setIsResizing(true);

      // div 컨테이너 요소 사용
      const currentElement = containerRef.current;
      const rect = currentElement?.getBoundingClientRect();

      startPointRef.current = { x: e.clientX, y: e.clientY };

      // rect가 없거나 잘못된 경우 현재 state 크기 사용
      startSizeRef.current = {
        w: rect?.width ?? size.w ?? 560,
        h: rect?.height ?? size.h ?? 315,
      };

      // 포인터 캡처(핸들에서 포인터 고정)
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);

      const handleMove = (pe: PointerEvent) => {
        if (!isResizingRef.current) return;

        const dw = pe.clientX - startPointRef.current.x;
        const dh = pe.clientY - startPointRef.current.y;

        const ratio = aspectRef.current;
        const leadIsWidth = Math.abs(dw) >= Math.abs(dh);

        let newW = startSizeRef.current.w;
        let newH = startSizeRef.current.h;

        if (leadIsWidth) {
          newW = startSizeRef.current.w + dw;
          newH = newW / ratio;
        } else {
          newH = startSizeRef.current.h + dh;
          newW = newH * ratio;
        }

        // 최소 크기 적용 (한 변 기준 → 다른 변은 비율로 보정)
        if (newW < minSize) {
          newW = minSize;
          newH = newW / ratio;
        }
        if (newH < minSize) {
          newH = minSize;
          newW = newH * ratio;
        }

        // 반올림 및 적용
        pendingSizeRef.current = { w: Math.round(newW), h: Math.round(newH) };
        scheduleRaf();
      };

      const handleUp = (pe: PointerEvent) => {
        // 정리
        isResizingRef.current = false;
        setIsResizing(false);
        flushRaf();

        window.removeEventListener("pointermove", handleMove, { capture: true } as any);
        window.removeEventListener("pointerup", handleUp, { capture: true } as any);

        const currentRect = containerRef.current?.getBoundingClientRect();
        const finalW = currentRect?.width ?? startSizeRef.current.w;
        const finalH = currentRect?.height ?? startSizeRef.current.h;
        const initialW = initialSizeRef.current.w ?? startSizeRef.current.w;
        const initialH = initialSizeRef.current.h ?? startSizeRef.current.h;

        const changed = finalW !== initialW || finalH !== initialH;
        if (!changed) return;

        // 에디터 노드 업데이트
        editor.update(() => {
          const node = $getNodeByKey(nodeKey);
          if (node && $isYouTubeNode(node)) {
            node.setSize(finalW, finalH);
          }
        });

        // 다음 비교를 위해 초기값 업데이트
        initialSizeRef.current = { w: finalW, h: finalH };
      };

      window.addEventListener("pointermove", handleMove, { capture: true });
      window.addEventListener("pointerup", handleUp, { capture: true });
    },
    [editor, isEditable, loadingState, minSize, nodeKey, size.w, size.h]
  );

  useEffect(() => {
    return () => {
      flushRaf();
      isResizingRef.current = false;
      window.removeEventListener("pointermove", () => {});
      window.removeEventListener("pointerup", () => {});
    };
  }, []);

  // 로딩/에러 오버레이
  const showOverlay = loadingState !== "loaded";
  const overlayContent = loadingState === "loading" ? <span style={{ color: "#666", fontSize: 12 }}>YouTube 비디오 로딩 중…</span> : loadingState === "error" ? <span style={{ color: "#d32f2f", fontSize: 12 }}>YouTube 비디오 로딩 실패</span> : null;

  const displayW = size.w ?? 560;
  const displayH = size.h ?? 315;

  return (
    <span
      style={{
        display: "inline-block",
        position: "relative",
        userSelect: isResizing ? "none" : "auto",
        lineHeight: 0,
      }}
    >
      {/* 스켈레톤/에러 오버레이 */}
      {showOverlay && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 4,
            backgroundColor: loadingState === "loading" ? "#f5f5f5" : "#ffeaea",
            border: loadingState === "loading" ? "1px dashed #ccc" : "1px solid #ffcdd2",
            zIndex: 1,
            pointerEvents: "none",
          }}
        >
          {overlayContent}
        </div>
      )}

      {/* div 컨테이너로 감싸서 ImageView와 동일한 패턴 */}
      <div
        ref={containerRef}
        style={{
          width: displayW || 560,
          height: displayH || 315,
          maxWidth: "100%",
          display: "block",
          position: "relative",
          backgroundColor: "#000",
          borderRadius: 8,
          overflow: "hidden",
          transition: isResizing ? "none" : "transform 0.06s ease, opacity 0.12s ease",
        }}
      >
        <iframe
          width={displayW || 560}
          height={displayH || 315}
          src={`https://www.youtube-nocookie.com/embed/${videoID}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen={true}
          title="YouTube video"
          style={{
            width: "100%",
            height: "100%",
            border: "none",
            display: "block",
            opacity: loadingState === "loaded" ? 1 : 0.8,
            pointerEvents: isResizing ? "none" : "auto",
          }}
          onLoad={handleMediaLoad}
          onError={handleMediaError}
        />
      </div>

      {isEditable && loadingState !== "error" && (
        <button
          type="button"
          onPointerDown={onPointerDown}
          title="드래그하여 크기 조정"
          aria-label="드래그하여 크기 조정"
          style={{
            position: "absolute",
            right: -6,
            bottom: -6,
            width: 12,
            height: 12,
            border: "2px solid #007acc",
            backgroundColor: "#fff",
            cursor: "nwse-resize",
            borderRadius: 2,
            boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
            opacity: isResizing ? 1 : 0.8,
            touchAction: "none", // 터치 환경 드래그 제스처와 충돌 방지
          }}
        />
      )}
    </span>
  );
}
