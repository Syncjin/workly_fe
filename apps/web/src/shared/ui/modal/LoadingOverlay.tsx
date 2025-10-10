"use client";

import { LOADING_OVERLAY_MODAL_KEY } from "@/shared/ui/modal/model";
import { useModalStore } from "@/shared/ui/modal/store";
import { LoadingSpinner, Popup } from "@workly/ui";
import { FC } from "react";
import * as s from "./loadingOverlay.css";

type Props = {
  visible: boolean;
  text?: string;
};

export const LoadingOverlay: FC<Props> = ({ visible, text = "처리 중…" }) => {
  const modalState = useModalStore((state) => state.current);
  const isOpen = modalState.type === LOADING_OVERLAY_MODAL_KEY;
  return (
    <Popup
      open={isOpen}
      onClose={undefined}
      variant="modal" // 전체 오버레이
      size="md"
      position="center"
      closeOnOutsideClick={false}
      closeOnEscape={false}
      trapFocus={false}
      ariaLabel="로딩 중"
      classes={{ content: s.popup }}
    >
      <Popup.Content>
        <LoadingSpinner size="lg" />
      </Popup.Content>
    </Popup>
  );
};

export default LoadingOverlay;
