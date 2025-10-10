import type { LoaderRegistry } from "@workly/ui/overlays";
import { LOADING_OVERLAY_MODAL_KEY } from "./keys";

export const registry: LoaderRegistry = {
  [LOADING_OVERLAY_MODAL_KEY]: () => import("../LoadingOverlay"),
};
