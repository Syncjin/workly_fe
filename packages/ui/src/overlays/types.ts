export type ModalKey = string;

export type ModalState = {
  type: ModalKey | null;
  props?: any;
};
export type ModalLoader = () => Promise<{ default: React.ComponentType<any> }>;
export type LoaderRegistry<K extends string = ModalKey> = Record<K, ModalLoader>;
export type ModalClient = {
  open<T = any>(type: ModalKey, props?: any): Promise<T | null>;
  resolve(result: any): void;
  cancel(): void;
  subscribe(l: () => void): () => void;
  getState(): ModalState;
};