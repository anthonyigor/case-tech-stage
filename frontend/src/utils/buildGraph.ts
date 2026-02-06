import type { Edge, Node } from "@xyflow/react";
import type { ProcessTreeItem } from "../api/processes";

type Graph = { nodes: Node[]; edges: Edge[] };

export function buildGraphFromTree(tree: ProcessTreeItem[]): Graph {
    const nodes: Node[] = []
    const edges: Edge[] = []


    function walk(item: ProcessTreeItem) {

        nodes.push({
            id: item.id,
            type: 'processNode',
            position: { x: 0, y: 0},
            data: {
                title: item.title,
                status: item.status,
                typeProcess: item.type,
                raw: item,
                // ajuda o dagre: tamanho aproximado do node
                width: 260,
                height: 92,
            }
        })

        // ordena por position
        const children = [...(item.children ?? [])].sort((a, b) => a.position - b.position);
        
        for (const child of children) {
            edges.push({
                id: `${item.id}=>${child.id}`,
                source: item.id,
                target: child.id,
                animated: child.status === "DRAFT",
            });

            walk(child);
        }
    }

    // Pode ter mais de uma raiz
    const roots = [...tree].sort((a, b) => a.position - b.position);
    for (const root of roots) walk(root);

    return { nodes, edges };

}