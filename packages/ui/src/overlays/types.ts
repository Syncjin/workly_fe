export type ModalKey = string;

export type ModalState = {
  type: ModalKey | null;
  props?: unknown;
};
export type ModalLoader = () => Promise<{ default: React.ComponentType<unknown> }>;
export type LoaderRegistry<K extends string = ModalKey> = Record<K, ModalLoader>;
export type ModalClient = {
  open<T = unknown>(type: ModalKey, props?: unknown): Promise<T | null>;
  resolve(result: unknown, key?: ModalKey): void;
  cancel(key?: ModalKey): void;
  subscribe(l: () => void): () => void;
  getState(): ModalState;
};
