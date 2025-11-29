"use client";

import { modalClient } from "@/shared/ui/modal/client";
import { ModalBoundary } from "@/shared/ui/modal/ModalBoundary";
import { CONFIRM_MODAL_KEY } from "@/shared/ui/modal/model";
import { useModalStore } from "@/shared/ui/modal/store";
import { Button, LoadingSpinner, Popup } from "@workly/ui";
import { FC, useCallback } from "react";
import * as styles from "./confirmDialog.css";

type Props = {
  params?: {
    header?: string;
    title?: string;
    content?: string;
    oneBtnText?: string;
    twoBtnText?: string;
  };
};

export const ConfirmDialog: FC<Props> = () => {
  const modalState = useModalStore((state) => state.current);
  const isOpen = modalState.type === CONFIRM_MODAL_KEY;
  const props = modalState.props as Props | undefined;
  const header = props?.params?.header;
  const title = props?.params?.title;
  const content = props?.params?.content;
  const oneBtnText = props?.params?.oneBtnText;
  const twoBtnText = props?.params?.twoBtnText;

  const handleOne = useCallback(() => modalClient.resolve(false), []);
  const handleTwo = useCallback(() => modalClient.resolve(true), []);

  const handleCancel = useCallback(() => modalClient.cancel(), []);

  return (
    <Popup open={isOpen} onClose={handleCancel} variant="modal" size="md" trapFocus ariaLabel={header}>
      <Popup.Header>{header}</Popup.Header>

      <ModalBoundary
        pending={
          <div className={styles.loading}>
            <LoadingSpinner size="lg" />
          </div>
        }
        onClose={handleCancel}
      >
        <Popup.Content className={styles.popup}>
          <h4 className={styles.title}>{title}</h4>
          <p className={styles.content}>{content}</p>
        </Popup.Content>
        <Popup.Footer>
          <Button variant="ghost" color="gray-400" onClick={handleOne}>
            {oneBtnText ?? "취소"}
          </Button>
          <Button onClick={handleTwo}>{twoBtnText ?? "확인"}</Button>
        </Popup.Footer>
      </ModalBoundary>
    </Popup>
  );
};

export default ConfirmDialog;
