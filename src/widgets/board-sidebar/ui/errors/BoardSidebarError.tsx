"use client";

import { Button } from "@/shared/ui/Button";
import * as styles from "../boardSidebar.css";

export const BoardSidebarError = ({
    error,
    onRetry,
}: {
    error?: unknown;
    onRetry?: () => void;
}) => {
    return <aside className={[styles.container].filter(Boolean).join(" ")} aria-label="Sidebar Navigation">
        <p style={{ marginBottom: 8 }}>사이드바를 불러오지 못했습니다.</p>
        {process.env.NODE_ENV !== "production" && (
            <pre style={{ whiteSpace: "pre-wrap" }}>{String(error)}</pre>
        )}
        {onRetry && (
            <Button onClick={onRetry} style={{ marginTop: 8, margin: 8 }}>
                다시 불러오기
            </Button>
        )}
    </aside>
};
