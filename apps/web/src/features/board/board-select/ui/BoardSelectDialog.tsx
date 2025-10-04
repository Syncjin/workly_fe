"use client";

import { BOARD_SELECT_MODAL_KEY } from "@/features/board/board-select/model/keys";
import { BoardSelectDialogContent } from "@/features/board/board-select/ui/BoardSelectDialogContent";
import { modalClient } from "@/shared/ui/modal/client";
import { ModalBoundary } from "@/shared/ui/modal/ModalBoundary";
import { useModalStore } from "@/shared/ui/modal/store";
import { Button, LoadingSpinner, Popup } from "@workly/ui";
import { FC, useCallback, useEffect, useState } from "react";
import * as styles from "./boardSelectDialog.css";

type Props = {
  params?: {
    initialBoardId?: number;
  };
};

export const BoardSelectDialog: FC<Props> = () => {
  const modalState = useModalStore((state) => state.current);
  const isOpen = modalState.type === BOARD_SELECT_MODAL_KEY;
  const initialBoardId = modalState.props?.params?.initialBoardId as number | undefined;

  const [activeBoardId, setActiveBoardId] = useState<number | undefined>();

  useEffect(() => {
    if (!isOpen) {
      setActiveBoardId(undefined);
      return;
    }
    setActiveBoardId(initialBoardId);
  }, [isOpen, initialBoardId]);

  const handleChange = useCallback((b: { id: number }) => setActiveBoardId(b.id), []);
  const handleSelect = useCallback(() => activeBoardId && modalClient.resolve(activeBoardId), [activeBoardId]);
  const handleCancel = useCallback(() => modalClient.cancel(), []);

  return (
    <Popup open={isOpen} onClose={handleCancel} variant="modal" size="md" trapFocus ariaLabel="게시판 선택">
      <Popup.Header>게시판 선택</Popup.Header>

      <ModalBoundary
        pending={
          <div className={styles.loading}>
            <LoadingSpinner size="lg" />
          </div>
        }
        onClose={handleCancel}
      >
        <Popup.Content className={styles.popup}>
          <BoardSelectDialogContent activeBoardId={activeBoardId} onChange={handleChange} />
        </Popup.Content>
        <Popup.Footer>
          <Button variant="ghost" color="gray-400" onClick={handleCancel}>
            취소
          </Button>
          <Button onClick={handleSelect} disabled={!activeBoardId}>
            선택
          </Button>
        </Popup.Footer>
      </ModalBoundary>
    </Popup>
  );
};

export default BoardSelectDialog;
