import { useParams } from "react-router-dom";
import { useCallback, useMemo, useState } from "react";
import { buildGraphFromTree } from "../utils/buildGraph";
import { Controls, ReactFlow, type ReactFlowInstance } from "@xyflow/react";
import { ProcessNode } from "../components/nodes/ProcessNode";
import "@xyflow/react/dist/style.css";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createProcess, getProcessesTree, moveProcess, removeProcess, updateProcessStatus, type CreateProcessDto, type MoveProcessDto, type ProcessStatus, type ProcessTreeItem } from "../api/processes";
import { layoutWithDagre } from "../utils/dagreLayout";
import { CreateProcessModal } from "../components/modals/CreateProcessModal";
import { ProcessDrawer } from "../components/drawers/ProcessDrawer";
import { findNode } from "../utils/findNode";
import { updateStatusInTree } from "../utils/updateStatusInTree";
import { useProcessMoveDnD } from "../hooks/useProcessMove";
import toast from "react-hot-toast";

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

    // states para drag-and-drop
    const [moveMode, setMoveMode] = useState(false);

    const [rf, setRf] = useState<ReactFlowInstance | null>(null);


    const q = useQuery({
        queryKey: ["areaTree", areaId],
        queryFn: () => getProcessesTree(areaId!),
        enabled: !!areaId,
        staleTime: 30_000,
    });

    // mutations
    const createProcessMut = useMutation({
        mutationFn: (payload: CreateProcessDto) => createProcess(payload),
        onSuccess: async () => {
            await qc.invalidateQueries({ queryKey: ["areaTree", areaId] })
        }
    })

    const updateProcessStatusMut = useMutation({
        mutationFn: ({ id, status }: { id: string; status: ProcessStatus }) => updateProcessStatus(id, status),
        onMutate: async ({ id, status }) => {
            await qc.cancelQueries({ queryKey: ["areaTree", areaId] })
            
            const prev = qc.getQueryData<ProcessTreeItem[]>(['areaTree', areaId])

            // atualiza o status em cascata se for raiz
            if (prev) {
              const target = findNode(prev, id)
              const isRoot = target?.parent_id === null

              const next = updateStatusInTree(prev, id, status, !!isRoot)
              qc.setQueryData(['areaTree', areaId], next)
            }

            return { prev }
        },
        onError: (_err, _vars, ctx) => {
          if (ctx?.prev) qc.setQueryData(["areaTree", areaId], ctx.prev);
        },
        onSettled: async () => {
          await qc.invalidateQueries({ queryKey: ["areaTree", areaId] });
        },
    })

    const moveProcessMut = useMutation({
        mutationFn: ({process_id, payload}: { process_id: string; payload: MoveProcessDto }) => moveProcess(process_id, payload),
        onSuccess: async () => {
          await qc.invalidateQueries({ queryKey: ["areaTree", areaId] })
        }
    })

    const removeProcessMut = useMutation({
      mutationFn: ({id}: {id: string}) => removeProcess(id),
      onSuccess: async () => {
        await qc.invalidateQueries({ queryKey: ["areaTree", areaId] })
        toast.success('Processo removido com sucesso!')
      },
      onError: (err: any) => toast.error(`Erro ao remover processo: ${err.response?.data?.message}`)
    })

    // callbacks
    const onAddChild = useCallback((parentId: string) => {
      if (moveMode) return;
      setCreateParentId(parentId);
      setCreateModalOpen(true);
    }, [moveMode]);

    const mutateStatus = updateProcessStatusMut.mutate

    const onChangeStatus = useCallback((id: string, status: ProcessStatus) => {
      if (moveMode) return;
      mutateStatus({ id, status });
    }, [moveMode, mutateStatus]);

    const onDeleteProcess = useCallback(async (id: string) => {
      if (!areaId || !q.data) return

      if (!confirm("Tem certeza que deseja remover esse processo?")) return

      await removeProcessMut.mutateAsync({id})

      setDrawerOpen(false)
      setSelectedProcessId(null)
    }, [areaId, q.data, removeProcessMut])

    const moveDnD = useProcessMoveDnD({
      moveMode,
      areaId,
      rf,
      tree: q.data,
      queryClient: qc,
      moveMutation: moveProcessMut,
    });

    const layouted = useMemo(() => {
      if (!q.data) return { nodes: [], edges: [] };

      const base = buildGraphFromTree(q.data);
      return layoutWithDagre(base.nodes, base.edges, "TB");
    }, [q.data]);

    
    const graph = useMemo(() => {
      const nodes = layouted.nodes.map((n) => ({
        ...n,
        data: {
          ...n.data,
          disableActions: moveMode,
          isDropTarget: moveDnD.hoverParentId === n.id,
          onAddChild,
          onChangeStatus,
        },
      }));

      return { nodes, edges: layouted.edges };
    }, [layouted, moveMode, moveDnD.hoverParentId, onAddChild, onChangeStatus]);


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

            <button
              onClick={() => {
                setMoveMode((v) => !v);
                // limpando preview quando troca modo
                moveDnD.clearPreview();
              }}
              className={[
                "rounded-xl px-4 py-2 text-sm ring-1 transition",
                moveMode
                  ? "bg-sky-500/20 ring-sky-500/30 hover:bg-sky-500/25"
                  : "bg-white/5 ring-white/10 hover:bg-white/10",
              ].join(" ")}
            >
              {moveMode ? "Modo edição: ON" : "Modo edição: OFF"}
            </button>

          </div>
        </div>
        {moveMode && (
          <div className="mt-3 text-xs text-slate-400">
            Arraste um processo e solte em cima de outro para virar subprocesso, ou solte no vazio para virar raiz.
          </div>
        )}
      </div>

      {/* Flow */}
        <ReactFlow
          onInit={setRf}
          nodes={graph.nodes}
          edges={graph.edges}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.3 }}
          defaultEdgeOptions={{ type: "smoothstep" }}
          className="h-full"
          nodesDraggable={moveMode && !moveProcessMut.isPending}
          elementsSelectable={!moveMode}
          onNodeDragStart={moveDnD.handlers.onNodeDragStart}
          onNodeDrag={moveDnD.handlers.onNodeDrag}
          onNodeDragStop={moveDnD.handlers.onNodeDragStop}
          onNodeClick={(_, node) => {
              if (moveMode) return
              setSelectedProcessId(node.id);
              setDrawerOpen(true);
          }}
          onPaneClick={() => {
              if (moveMode) return;
              setSelectedProcessId(null);
              setDrawerOpen(false);
          }}
        >
          <Controls className="text-black"/>
        </ReactFlow>
        {moveMode && moveDnD.cursor && moveDnD.draggingId && (
          <div
            className="pointer-events-none fixed z-9999
                      rounded-xl bg-slate-950/90 ring-1 ring-white/10
                      backdrop-blur-xl px-3 py-2 text-xs text-slate-100 shadow-xl"
            style={{
              left: moveDnD.cursor.x + 12,
              top: moveDnD.cursor.y + 12,
            }}
          >
            <div className="text-slate-300">
              Destino:{" "}
              <span className="font-medium text-slate-50">
                {moveDnD.hoverParentId
                  ? (graph.nodes.find((n) => n.id === moveDnD.hoverParentId)?.data as any)?.title
                  : "Raiz"}
              </span>
            </div>
            <div className="text-slate-400">
              Posição: {moveDnD.hoverPosition ?? 0}
            </div>
          </div>
        )}

        {/* Drawer de detalhes do processo */}
        <ProcessDrawer
            open={drawerOpen}
            processId={selectedProcessId}
            areaId={areaId}
            onClose={() => setDrawerOpen(false)}
            onDelete={onDeleteProcess}
            deleting={removeProcessMut.isPending}
            canDelete={
              !!selectedProcessId && !!q.data
            }
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