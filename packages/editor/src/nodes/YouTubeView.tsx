"use client";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getNodeByKey } from "lexical";
import React, { useCallback, useLayoutEffect, useRef, useState } from "react";

import { $isYouTubeNode } from "./YoutubeNode";

type Props = {
  videoID: string;
  width?: number;
  height?: number;
  nodeKey: string;
  isEditable?: boolean;
  minSize?: number;
  maxSize?: number;
};

type Size = { w?: number; h?: number };

export function YouTubeView({ videoID, width, height, nodeKey, isEditable = true, minSize = 200, maxSize }: Props) {
  const [editor] = useLexicalComposerContext();
  const [size, setSize] = useState<Size>({ w: width, h: height });
  const [loadingState, setLoadingState] = useState<"loading" | "loaded" | "error">("loading");
  const [isResizing, setIsResizing] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const initialSizeRef = useRef<Size>({ w: width, h: height });
  const aspectRef = useRef<number>(16 / 9); // YouTube 표준 16:9 비율
  const isResizingRef = useRef(false);

  // Props 변경 시 상태 동기화
  useLayoutEffect(() => {
    setSize({ w: width, h: height });
    initialSizeRef.current = { w: width, h: height };
  }, [width, height]);

  // 자동 크기 설정
  const handleMediaLoad = useCallback(() => {
    setLoadingState("loaded");

    // 크기가 설정되지 않은 경우 기본 크기로 초기화
    if (width === undefined && height === undefined) {
      let finalW = 560; // YouTube 기본 너비
      let finalH = 315; // YouTube 기본 높이 (16:9)

      if (maxSize && finalW > maxSize) {
        finalW = maxSize;
        finalH = finalW / aspectRef.current;
      }

      const roundedW = Math.round(finalW);
      const roundedH = Math.round(finalH);

      editor.update(() => {
        const node = $getNodeByKey(nodeKey);
        if (node && $isYouTubeNode(node)) {
          node.setSize(roundedW, roundedH);
        }
      });

      setSize({ w: roundedW, h: roundedH });
      initialSizeRef.current = { w: roundedW, h: roundedH };
    }
  }, [editor, nodeKey, width, height, maxSize]);

  // 리사이즈 핸들러
  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!isEditable || loadingState === "error") return;

      e.preventDefault();
      e.stopPropagation();

      isResizingRef.current = true;
      setIsResizing(true);

      const rect = containerRef.current?.getBoundingClientRect();
      const startPoint = { x: e.clientX, y: e.clientY };
      const startSize = { w: rect?.width ?? size.w ?? 560, h: rect?.height ?? size.h ?? 315 };

      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);

      const handleMove = (pe: PointerEvent) => {
        if (!isResizingRef.current) return;

        const dw = pe.clientX - startPoint.x;
        const dh = pe.clientY - startPoint.y;
        const ratio = aspectRef.current;

        // 너비 기준으로 리사이즈 (16:9 비율 유지)
        let newW = startSize.w + (Math.abs(dw) >= Math.abs(dh) ? dw : dh * ratio);
        newW = Math.max(minSize, newW);
        if (maxSize) newW = Math.min(maxSize, newW);

        const newH = newW / ratio;
        const roundedSize = { w: Math.round(newW), h: Math.round(newH) };

        setSize(roundedSize);
        if (containerRef.current) {
          containerRef.current.style.width = `${roundedSize.w}px`;
          containerRef.current.style.height = `${roundedSize.h}px`;
        }
      };

      const handleUp = () => {
        isResizingRef.current = false;
        setIsResizing(false);

        window.removeEventListener("pointermove", handleMove, { capture: true });
        window.removeEventListener("pointerup", handleUp, { capture: true });

        const rect = containerRef.current?.getBoundingClientRect();
        const finalW = rect?.width ?? startSize.w;
        const finalH = rect?.height ?? startSize.h;
        const initialW = initialSizeRef.current.w ?? startSize.w;
        const initialH = initialSizeRef.current.h ?? startSize.h;

        if (finalW !== initialW || finalH !== initialH) {
          editor.update(() => {
            const node = $getNodeByKey(nodeKey);
            if (node && $isYouTubeNode(node)) {
              node.setSize(finalW, finalH);
            }
          });
          initialSizeRef.current = { w: finalW, h: finalH };
        }
      };

      window.addEventListener("pointermove", handleMove, { capture: true });
      window.addEventListener("pointerup", handleUp, { capture: true });
    },
    [editor, isEditable, loadingState, minSize, maxSize, nodeKey, size]
  );

  const displayW = size.w ?? 560;
  const displayH = size.h ?? 315;
  const showOverlay = loadingState !== "loaded";

  return (
    <span style={{ display: "inline-block", position: "relative", userSelect: isResizing ? "none" : "auto", lineHeight: 0 }}>
      {showOverlay && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 8,
            backgroundColor: loadingState === "loading" ? "#f5f5f5" : "#ffeaea",
            border: loadingState === "loading" ? "1px dashed #ccc" : "1px solid #ffcdd2",
            zIndex: 1,
            pointerEvents: "none",
          }}
        >
          <span style={{ color: loadingState === "loading" ? "#666" : "#d32f2f", fontSize: 12 }}>{loadingState === "loading" ? "YouTube 비디오 로딩 중…" : "YouTube 비디오 로딩 실패"}</span>
        </div>
      )}

      <div
        ref={containerRef}
        style={{
          width: displayW,
          height: displayH,
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
          width={displayW}
          height={displayH}
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
          onError={() => setLoadingState("error")}
        />
      </div>

      {isEditable && loadingState !== "error" && (
        <button
          type="button"
          onPointerDown={handlePointerDown}
          title="드래그하여 크기 조정"
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
            touchAction: "none",
          }}
        />
      )}
    </span>
  );
}
