"use client";
import { BOARD_SELECT_MODAL_KEY } from "@/features/board/board-select";
import { CONFIRM_MODAL_KEY, LOADING_OVERLAY_MODAL_KEY } from "@/shared/ui/modal/model/keys";
import { modalClient } from "./client";

export async function openBoardSelect(params?: { initialBoardId?: number }) {
  return modalClient.open(BOARD_SELECT_MODAL_KEY, { params });
}

export async function openLoadingOverlay() {
  return modalClient.open(LOADING_OVERLAY_MODAL_KEY, {});
}

export async function closeLoadingOverlay() {
  return modalClient.cancel(LOADING_OVERLAY_MODAL_KEY);
}

export async function openConfirm(params?: { header?: string; title?: string; content?: string; oneBtnText?: string; twoBtnText?: string }) {
  return modalClient.open(CONFIRM_MODAL_KEY, { params });
}
