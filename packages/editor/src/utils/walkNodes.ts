/**
 * lexical 노드 순회
 */
export type JSONNode = {
  type?: string;
  children?: JSONNode[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

export function walkNodes(node: JSONNode | undefined | null, visit: (n: JSONNode) => void) {
  if (!node || typeof node !== "object") return;
  visit(node);
  const kids = node.children;
  if (Array.isArray(kids)) kids.forEach((child) => walkNodes(child, visit));
}
