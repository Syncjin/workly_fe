"use client";
import React from "react";

import { useModal, useModalState } from "./context";

type ModalLoader = () => Promise<{ default: React.ComponentType<unknown> }>;
type LoaderRegistry = Record<string, ModalLoader>;

export function ModalHost({ loaders, fallback }: { loaders: LoaderRegistry; fallback?: React.ReactNode }) {
  const { resolve, cancel } = useModal();
  const { type, props } = useModalState();

  const LazyComp = React.useMemo(() => {
    if (!type) return null;
    const loader = loaders[type];
    return loader ? React.lazy(loader) : null;
  }, [type, loaders]);

  if (!type || !LazyComp) return null;

  return (
    <React.Suspense fallback={fallback ?? null}>
      {/* @ts-expect-error - LazyComp props are dynamically loaded */}
      <LazyComp open onClose={cancel} onResolve={resolve} {...(props || {})} />
    </React.Suspense>
  );
}
