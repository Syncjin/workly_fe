"use client";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getNodeByKey } from "lexical";
import React, { useCallback, useLayoutEffect, useRef, useState } from "react";
import { $isImageNode } from "./ImageNode";

type Props = {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  nodeKey: string;
  isEditable?: boolean;
  minSize?: number;
  maxSize?: number;
};

type Size = { w?: number; h?: number };

export function ImageView({ src, alt, width, height, nodeKey, isEditable = true, minSize = 40, maxSize }: Props) {
  const [editor] = useLexicalComposerContext();
  const [size, setSize] = useState<Size>({ w: width, h: height });
  const [loadingState, setLoadingState] = useState<"loading" | "loaded" | "error">("loading");
  const [isResizing, setIsResizing] = useState(false);

  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const initialSizeRef = useRef<Size>({ w: width, h: height });
  const aspectRef = useRef<number | null>(null);
  const isResizingRef = useRef(false);

  // Props 변경 시 상태 동기화
  useLayoutEffect(() => {
    setSize({ w: width, h: height });
    initialSizeRef.current = { w: width, h: height };
  }, [width, height]);

  // 이미지 로딩 완료 시 자동 크기 설정
  const handleImageLoad = useCallback(() => {
    setLoadingState("loaded");
    const el = imgRef.current;
    if (!el || width !== undefined || height !== undefined) return;

    aspectRef.current = el.naturalWidth / el.naturalHeight;
    let finalW = el.naturalWidth;
    let finalH = el.naturalHeight;

    if (maxSize && finalW > maxSize) {
      finalW = maxSize;
      finalH = finalW / aspectRef.current;
    }

    const roundedW = Math.round(finalW);
    const roundedH = Math.round(finalH);

    editor.update(
      () => {
        const node = $getNodeByKey(nodeKey);
        if (node && $isImageNode(node)) {
          node.setSize(roundedW, roundedH);
        }
      },
      { discrete: true }
    );

    setSize({ w: roundedW, h: roundedH });
    initialSizeRef.current = { w: roundedW, h: roundedH };
  }, [editor, nodeKey, width, height, maxSize]);

  // 리사이즈 핸들러
  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!isEditable || loadingState !== "loaded") return;

      e.preventDefault();
      e.stopPropagation();

      isResizingRef.current = true;
      setIsResizing(true);

      const rect = containerRef.current?.getBoundingClientRect();
      const startPoint = { x: e.clientX, y: e.clientY };
      const startSize = { w: rect?.width ?? size.w ?? 40, h: rect?.height ?? size.h ?? 40 };

      if (!aspectRef.current) {
        aspectRef.current = startSize.w / startSize.h;
      }

      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);

      const handleMove = (pe: PointerEvent) => {
        if (!isResizingRef.current) return;

        const dw = pe.clientX - startPoint.x;
        const dh = pe.clientY - startPoint.y;
        const ratio = aspectRef.current || 1;

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
            if (node && $isImageNode(node)) {
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

  const displayW = size.w;
  const displayH = size.h;
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
            borderRadius: 4,
            backgroundColor: loadingState === "loading" ? "#f5f5f5" : "#ffeaea",
            border: loadingState === "loading" ? "1px dashed #ccc" : "1px solid #ffcdd2",
            zIndex: 1,
            pointerEvents: "none",
          }}
        >
          <span style={{ color: loadingState === "loading" ? "#666" : "#d32f2f", fontSize: 12 }}>{loadingState === "loading" ? "이미지 로딩 중…" : "이미지 로딩 실패"}</span>
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
          transition: isResizing ? "none" : "transform 0.06s ease, opacity 0.12s ease",
        }}
      >
        <img
          ref={imgRef}
          src={src}
          alt={alt ?? ""}
          style={{
            width: "100%",
            height: "100%",
            display: "block",
            opacity: loadingState === "loaded" ? 1 : 0,
            objectFit: "contain",
          }}
          draggable={false}
          onLoad={handleImageLoad}
          onError={() => setLoadingState("error")}
        />
      </div>

      {isEditable && loadingState === "loaded" && (
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
