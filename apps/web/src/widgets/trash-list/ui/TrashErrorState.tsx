"use client";

import { Icon } from "@workly/ui";
import * as styles from "./trashList.css";

interface TrashErrorStateProps {
  error?: Error;
  onRetry?: () => void;
}

export const TrashErrorState = ({ error, onRetry }: TrashErrorStateProps) => {
  return (
    <div className={styles.errorState}>
      <Icon name="error-warning-line" size={48} color="var(--color-red-400)" />
      <h3>휴지통을 불러올 수 없습니다</h3>
      <p>{error?.message || "알 수 없는 오류가 발생했습니다."}</p>
      {onRetry && (
        <button className={styles.actionButton} onClick={onRetry}>
          다시 시도
        </button>
      )}
    </div>
  );
};

TrashErrorState.displayName = "TrashErrorState";
