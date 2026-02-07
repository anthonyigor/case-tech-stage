import type { ProcessTreeItem } from "../api/processes";

export function findNode(tree: ProcessTreeItem[], id: string): ProcessTreeItem | null {
  for (const n of tree) {
    if (n.id === id) return n;
    const hit = n.children?.length ? findNode(n.children, id) : null;
    if (hit) return hit;
  }
  return null;
}
