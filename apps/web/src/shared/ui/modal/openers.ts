"use client";
import { BOARD_SELECT_MODAL_KEY } from "@/features/board/board-select";
import { modalClient } from "./client";

export async function openBoardSelect(params?: { initialBoardId?: number }) {
  return modalClient.open(BOARD_SELECT_MODAL_KEY, { params });
}
