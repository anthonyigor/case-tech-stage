import dagre from "dagre";
import type { Edge, Node } from "@xyflow/react";

type Direction = "TB" | "LR"; // TB = top-bottom, LR = left-right

const DEFAULT_NODE_W = 260;
const DEFAULT_NODE_H = 92;

/**
 * Recebe nodes/edges do ReactFlow e devolve nodes com position calculado via dagre.
 * direction:
 *  - "TB" => top-down
 *  - "LR" => left-right
 */
export function layoutWithDagre(
  nodes: Node[],
  edges: Edge[],
  direction: Direction = "TB"
) {
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));

  // rankdir controla direção do layout
  g.setGraph({
    rankdir: direction,
    nodesep: 60, // distância horizontal entre nodes
    ranksep: 120, // distância vertical entre níveis
  });

  // 1) registrar nodes com largura/altura
  for (const node of nodes) {
    const w = (node.data?.width as number) ?? DEFAULT_NODE_W;
    const h = (node.data?.height as number) ?? DEFAULT_NODE_H;
    g.setNode(node.id, { width: w, height: h });
  }

  // 2) registrar edges (source->target)
  for (const e of edges) {
    g.setEdge(e.source, e.target);
  }

  // 3) calcular layout
  dagre.layout(g);

  // 4) aplicar posições nos nodes
  const layouted = nodes.map((node) => {
    const pos = g.node(node.id) as { x: number; y: number };

    const w = (node.data?.width as number) ?? DEFAULT_NODE_W;
    const h = (node.data?.height as number) ?? DEFAULT_NODE_H;

    // Dagre retorna o centro; ReactFlow usa canto superior esquerdo
    node.position = {
      x: pos.x - w / 2,
      y: pos.y - h / 2,
    };

    return node;
  });

  return { nodes: layouted, edges };
}
