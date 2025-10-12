import type { LoaderRegistry } from "@workly/ui/overlays";
import { CONFIRM_MODAL_KEY, LOADING_OVERLAY_MODAL_KEY } from "./keys";

export const loadingRegistry: LoaderRegistry = {
  [LOADING_OVERLAY_MODAL_KEY]: () => import("../LoadingOverlay"),
};

export const confirmRegistry: LoaderRegistry = {
  [CONFIRM_MODAL_KEY]: () => import("../ConfirmDialog"),
};
