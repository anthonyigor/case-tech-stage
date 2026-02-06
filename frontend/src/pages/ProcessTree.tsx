import { useParams } from "react-router-dom";
import { useMemo } from "react";
import { buildGraphFromTree } from "../utils/buildGraph";
import { Background, Controls, ReactFlow } from "@xyflow/react";
import { ProcessNode } from "../components/processes/ProcessNode";
import "@xyflow/react/dist/style.css";
import { useQuery } from "@tanstack/react-query";
import { getProcessesTree } from "../api/processes";
import { layoutWithDagre } from "../utils/dagreLayout";

const glass = "rounded-2xl bg-white/5 ring-1 ring-white/10 backdrop-blur-xl";
const nodeTypes = {
  processNode: ProcessNode,
};

export function ProcessTreePage() {
    const { areaId } = useParams()

    const q = useQuery({
        queryKey: ["areaTree", areaId],
        queryFn: () => getProcessesTree(areaId!),
        enabled: !!areaId,
        staleTime: 30_000,
    });

    const graph = useMemo(() => {
        if (!q.data) return { nodes: [], edges: [] }
        const base = buildGraphFromTree(q.data);
        return layoutWithDagre(base.nodes, base.edges, "TB");
    }, [q.data])

    return (
         <div className="flex h-[calc(100vh-2rem)] min-h-160 flex-col gap-4">
            {/* Header */}
            <div className={`${glass} p-4`}>
                <div className="text-sm text-slate-300">Área</div>
                <div className="text-xl font-semibold">Árvore de Processos</div>
                <div className="mt-1 text-sm text-slate-300">
                Visualização hierárquica dos processos e subprocessos.
                </div>
            </div>

            {/* Flow container */}
            <div className={`${glass} flex-1 overflow-hidden`}>
                {q.isLoading ? (
                <div className="p-6 text-slate-300">Carregando árvore…</div>
                ) : q.isError ? (
                <div className="p-6 text-red-200">
                    Erro ao carregar: {(q.error as Error).message}
                </div>
                ) : (
                <ReactFlow
                    nodes={graph.nodes}
                    edges={graph.edges}
                    nodeTypes={nodeTypes}
                    fitView
                    fitViewOptions={{ padding: 0.3 }}
                    defaultEdgeOptions={{ type: "smoothstep" }}
                    className="h-full"
                >
                    <Background />
                    <Controls />
                </ReactFlow>
                )}
            </div>
        </div>
    )

}