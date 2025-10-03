import type { LoaderRegistry } from "@workly/ui/overlays";
import { BOARD_SELECT_MODAL_KEY } from "./keys";

export const registry: LoaderRegistry = {
  [BOARD_SELECT_MODAL_KEY]: () => import("../ui/BoardSelectDialog"),
};
