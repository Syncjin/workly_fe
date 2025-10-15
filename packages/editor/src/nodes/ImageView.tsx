"use client";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getNodeByKey } from "lexical";
import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { $isImageNode } from "./ImageNode";

type Props = {
  src: string;
  alt?: string;
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
export function ImageView({ src, alt, width, height, nodeKey, isEditable = true, minSize = 40 }: Props) {
  const [editor] = useLexicalComposerContext();

  // 렌더 사이즈 상태
  const [size, setSize] = useState<Size>({ w: width, h: height });
  const initialSizeRef = useRef<Size>({ w: width, h: height });

  const [loadingState, setLoadingState] = useState<LoadingState>("loading");

  // 리사이징 중 여부
  const isResizingRef = useRef(false);
  const [isResizing, setIsResizing] = useState(false);

  // img 요소
  const imgRef = useRef<HTMLImageElement | null>(null);

  // props 크기 변경 시 내부 상태 동기화
  useLayoutEffect(() => {
    setSize({ w: width, h: height });
    initialSizeRef.current = { w: width, h: height };
  }, [width, height]);

  const aspectRef = useRef<number | null>(null);

  // 이미지 로딩 핸들러
  const handleImageLoad = useCallback(() => {
    setLoadingState("loaded");
    const el = imgRef.current;
    if (el && el.naturalWidth && el.naturalHeight) {
      aspectRef.current = el.naturalWidth / el.naturalHeight;
    }
  }, []);
  const handleImageError = useCallback(() => setLoadingState("error"), []);

  // 리사이즈
  const startPointRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const startSizeRef = useRef<{ w: number; h: number }>({ w: width ?? 0, h: height ?? 0 });
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
      }
    });
  };

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!isEditable || loadingState !== "loaded") return;

      e.preventDefault();
      e.stopPropagation();

      // 활성화
      isResizingRef.current = true;
      setIsResizing(true);

      const rect = imgRef.current?.getBoundingClientRect();
      startPointRef.current = { x: e.clientX, y: e.clientY };
      startSizeRef.current = {
        w: rect?.width ?? size.w ?? 100,
        h: rect?.height ?? size.h ?? 100,
      };

      if (!aspectRef.current) {
        const w0 = startSizeRef.current.w || 1;
        const h0 = startSizeRef.current.h || 1;
        aspectRef.current = w0 / h0;
      }

      // 포인터 캡처(핸들에서 포인터 고정)
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);

      const handleMove = (pe: PointerEvent) => {
        if (!isResizingRef.current) return;

        const dw = pe.clientX - startPointRef.current.x;
        const dh = pe.clientY - startPointRef.current.y;

        const ratio = aspectRef.current || 1;
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

        const finalW = pendingSizeRef.current?.w ?? size.w ?? startSizeRef.current.w;
        const finalH = pendingSizeRef.current?.h ?? size.h ?? startSizeRef.current.h;

        const initialW = initialSizeRef.current.w ?? startSizeRef.current.w;
        const initialH = initialSizeRef.current.h ?? startSizeRef.current.h;

        const changed = finalW !== initialW || finalH !== initialH;
        if (!changed) return;

        // 에디터 노드 업데이트
        editor.update(() => {
          const node = $getNodeByKey(nodeKey);
          if (node && $isImageNode(node)) {
            node.setSize(finalW, finalH);
          }
        });

        // 다음 비교를 위해 초기값 업데이트
        initialSizeRef.current = { w: finalW, h: finalH };
        setSize({ w: finalW, h: finalH });
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
  const overlayContent = loadingState === "loading" ? <span style={{ color: "#666", fontSize: 12 }}>이미지 로딩 중…</span> : loadingState === "error" ? <span style={{ color: "#d32f2f", fontSize: 12 }}>이미지 로딩 실패</span> : null;

  const displayW = size.w ?? undefined;
  const displayH = size.h ?? undefined;

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

      <img
        ref={imgRef}
        src={src}
        alt={alt ?? ""}
        width={displayW}
        height={displayH}
        style={{
          maxWidth: "100%",
          display: "block",
          transition: isResizing ? "none" : "transform 0.06s ease, opacity 0.12s ease",
          opacity: loadingState === "loaded" ? 1 : 0,
        }}
        draggable={false}
        onLoad={handleImageLoad}
        onError={handleImageError}
      />

      {isEditable && loadingState === "loaded" && (
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
