import type { ProcessTreeItem } from "../api/processes";
import { findNode } from "./findNode";


/** retorna todos os descendentes (ids) de um nó */
export function collectDescendants(node: ProcessTreeItem): Set<string> {
  const set = new Set<string>();
  const walk = (n: ProcessTreeItem) => {
    for (const c of n.children ?? []) {
      set.add(c.id);
      walk(c);
    }
  };
  walk(node);
  return set;
}

/** retorna os filhos diretos de um parent_id (null = roots) */
export function getSiblings(tree: ProcessTreeItem[], parentId: string | null): ProcessTreeItem[] {
  if (parentId === null) {
    return [...tree].sort((a, b) => a.position - b.position);
  }

  const parent = findNode(tree, parentId);
  return [...(parent?.children ?? [])].sort((a, b) => a.position - b.position);
}

/**
 * Calcula a "position" baseada no X do drop:
 * - ordena irmãos pelo X (centro)
 * - encontra em qual "gap" o dropX cai
 */
export function calcInsertPositionByX(
  siblingIdsInOrder: string[],
  rfNodesById: Map<string, { x: number; width: number }>
, dropX: number) {
  // centros dos irmãos (na ordem esquerda->direita)
  const centers = siblingIdsInOrder
    .map((id) => {
      const n = rfNodesById.get(id);
      if (!n) return null;
      return { id, cx: n.x + n.width / 2 };
    })
    .filter(Boolean) as { id: string; cx: number }[];

  let pos = 0;
  for (let i = 0; i < centers.length; i++) {
    if (dropX > centers[i].cx) pos = i + 1;
    else break;
  }
  return pos; // 0..len
}
