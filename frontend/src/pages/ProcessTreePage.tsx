import { useParams } from "react-router-dom";
import { useMemo, useState } from "react";
import { buildGraphFromTree } from "../utils/buildGraph";
import { Background, Controls, ReactFlow } from "@xyflow/react";
import { ProcessNode } from "../components/nodes/ProcessNode";
import "@xyflow/react/dist/style.css";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createProcess, getProcessesTree, type CreateProcessDto } from "../api/processes";
import { layoutWithDagre } from "../utils/dagreLayout";
import { CreateProcessModal } from "../components/modals/CreateProcessModal";
import { ProcessDrawer } from "../components/drawers/ProcessDrawer";

const glass = "rounded-2xl bg-white/5 ring-1 ring-white/10 backdrop-blur-xl";
const nodeTypes = {
  processNode: ProcessNode,
};

export function ProcessTreePage() {
    const { areaId } = useParams()
    const qc = useQueryClient()
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedProcessId, setSelectedProcessId] = useState<string | null>(null);
    const [createModalOpen, setCreateModalOpen] = useState<boolean>(false)
    const [createParentId, setCreateParentId] = useState<string | null>(null)

    const q = useQuery({
        queryKey: ["areaTree", areaId],
        queryFn: () => getProcessesTree(areaId!),
        enabled: !!areaId,
        staleTime: 30_000,
    });

    const createProcessMut = useMutation({
        mutationFn: (payload: CreateProcessDto) => createProcess(payload),
        onSuccess: async () => {
            await qc.invalidateQueries({ queryKey: ["areaTree", areaId] })
        }
    })
    
    const graph = useMemo(() => {
        if (!q.data) return { nodes: [], edges: [] }
        const base = buildGraphFromTree(q.data);
        const laid = layoutWithDagre(base.nodes, base.edges, "TB");

        const nodesWithActions = laid.nodes.map((n) => ({
            ...n,
            data: {
                ...n.data,
                onAddChild: (parentId: string) => {
                    setCreateParentId(parentId);
                    setCreateModalOpen(true);
                },
            },
        }));

        return { nodes: nodesWithActions, edges: laid.edges };
    }, [q.data])

    function openCreateRoot() {
        setCreateParentId(null)
        setCreateModalOpen(true)
    }


    return (
    <div className="flex h-[calc(100vh-2rem)] min-h-160 flex-col gap-4">
      {/* Header + ações */}
      <div className={`${glass} p-4`}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-sm text-slate-300">Área</div>
            <div className="text-xl font-semibold">Árvore de Processos</div>
            <div className="mt-1 text-sm text-slate-300">
              Visualização hierárquica dos processos e subprocessos.
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={openCreateRoot}
              className="rounded-xl bg-sky-500/20 px-4 py-2 text-sm ring-1 ring-sky-500/30 hover:bg-sky-500/25"
            >
              + Processo raiz
            </button>
          </div>
        </div>
      </div>

      {/* Flow */}
      <div className={`${glass} flex-1 overflow-hidden`}>
        {q.isLoading ? (
          <div className="p-6 text-slate-300">Carregando árvore…</div>
        ) : q.isError ? (
          <div className="p-6 text-red-200">Erro ao carregar: {(q.error as Error).message}</div>
        ) : (
          <ReactFlow
            nodes={graph.nodes}
            edges={graph.edges}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.3 }}
            defaultEdgeOptions={{ type: "smoothstep" }}
            className="h-full"
            onNodeClick={(_, node) => {
                setSelectedProcessId(node.id);
                setDrawerOpen(true);
            }}
            onPaneClick={() => {
                setSelectedProcessId(null);
                setDrawerOpen(false);
            }}
          >
            <Background />
            <Controls />
          </ReactFlow>
        )}
      </div>

        <ProcessDrawer
            open={drawerOpen}
            processId={selectedProcessId}
            areaId={areaId}
            onClose={() => setDrawerOpen(false)}
         />


      {/* Modal */}
      {areaId && (
        <CreateProcessModal
          open={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          areaId={areaId}
          parentId={createParentId}
          loading={createProcessMut.isPending}
          onSubmit={(payload) => createProcessMut.mutateAsync(payload)}
        />
      )}
    </div>
  );

}