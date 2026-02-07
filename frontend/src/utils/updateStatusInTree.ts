import type { ProcessStatus, ProcessTreeItem } from "../api/processes";


export function updateStatusInTree(
  tree: ProcessTreeItem[],
  targetId: string,
  status: ProcessStatus,
  cascade: boolean
): ProcessTreeItem[] {
  const walk = (nodes: ProcessTreeItem[]): ProcessTreeItem[] =>
    nodes.map((n) => {
      if (n.id === targetId) {
        // atualiza o próprio nó e, se cascade, toda a subárvore dele
        return cascade
          ? setStatusDeep({ ...n, status }, status)
          : { ...n, status };
      }

      if (!n.children?.length) return n;
      return { ...n, children: walk(n.children) };
    });

  return walk(tree);
}

function setStatusDeep(node: ProcessTreeItem, status: ProcessStatus): ProcessTreeItem {
  return {
    ...node,
    status,
    children: (node.children ?? []).map((c) => setStatusDeep({ ...c }, status)),
  };
}
