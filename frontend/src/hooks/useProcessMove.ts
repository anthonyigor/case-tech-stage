import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import type { ReactFlowInstance } from "@xyflow/react";
import type { UseMutationResult, QueryClient } from "@tanstack/react-query";

import type { MoveProcessDto, ProcessTreeItem } from "../api/processes";
import { findNode } from "../utils/findNode";
import { collectDescendants, getSiblings, calcInsertPositionByX } from "../utils/moveProcess";

type MoveMut = UseMutationResult<
  unknown,
  unknown,
  { process_id: string; payload: MoveProcessDto },
  unknown
>;

type Params = {
  moveMode: boolean;
  areaId?: string;
  rf: ReactFlowInstance | null;
  tree: ProcessTreeItem[] | undefined;
  queryClient: QueryClient;
  moveMutation: MoveMut;
};

export function useProcessMoveDnD({
  moveMode,
  areaId,
  rf,
  tree,
  queryClient,
  moveMutation,
}: Params) {
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [hoverParentId, setHoverParentId] = useState<string | null>(null);
  const [hoverPosition, setHoverPosition] = useState<number | null>(null);
  const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (!moveMode || !draggingId) return;

    const onMove = (ev: PointerEvent) => {
      setCursor({ x: ev.clientX, y: ev.clientY });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [moveMode, draggingId]);

  const clearPreview = useCallback(() => {
    setDraggingId(null);
    setHoverParentId(null);
    setHoverPosition(null);
    setCursor(null);
  }, []);

  const nodeBoxContainsPoint = useCallback((node: any, x: number, y: number) => {
    const w = (node.width ?? node.data?.width ?? 260) as number;
    const h = (node.height ?? node.data?.height ?? 92) as number;
    const nx = node.positionAbsolute?.x ?? node.position.x;
    const ny = node.positionAbsolute?.y ?? node.position.y;

    return x >= nx && x <= nx + w && y >= ny && y <= ny + h;
  }, []);

  const buildRfMap = useCallback((nodes: any[]) => {
    const m = new Map<string, { x: number; width: number; title?: string }>();
    for (const n of nodes) {
      const x = n.positionAbsolute?.x ?? n.position.x;
      const width = (n.width ?? n.data?.width ?? 260) as number;
      m.set(n.id, { x, width, title: n.data?.title });
    }
    return m;
  }, []);

  const onNodeDragStart = useCallback(
    (_: any, node: any) => {
      if (!moveMode) return;
      setDraggingId(node.id);
    },
    [moveMode]
  );

  const onNodeDrag = useCallback(
    (e: any, node: any) => {
      if (!moveMode || !rf || !tree) return;

      const internalNodes = rf.getNodes();
      const w = (node.width ?? node.data?.width ?? 260) as number;
      const h = (node.height ?? node.data?.height ?? 92) as number;

      const cx = (node.positionAbsolute?.x ?? node.position.x) + w / 2;
      const cy = (node.positionAbsolute?.y ?? node.position.y) + h / 2;

      const target =
        internalNodes.find(
          (n: any) => n.id !== node.id && nodeBoxContainsPoint(n, cx, cy)
        ) ?? null;

      const newParentId: string | null = target ? target.id : null;
      setHoverParentId(newParentId);

      const rfMap = buildRfMap(internalNodes);

      const siblings = getSiblings(tree, newParentId).filter((p) => p.id !== node.id);

      const siblingIdsByX = siblings
        .map((s) => s.id)
        .sort((a, b) => (rfMap.get(a)?.x ?? 0) - (rfMap.get(b)?.x ?? 0));

      const pos = calcInsertPositionByX(siblingIdsByX, rfMap, cx);
      setHoverPosition(pos);
    },
    [moveMode, rf, tree, nodeBoxContainsPoint, buildRfMap]
  );

  const onNodeDragStop = useCallback(
    async (_: any, node: any) => {
      if (!moveMode || !areaId || !tree) {
        clearPreview();
        return;
      }

      const movedId = node.id as string;

      const newParentId = hoverParentId; // string | null
      const position = hoverPosition ?? 0;

      const movedNode = findNode(tree, movedId);
      if (!movedNode) {
        clearPreview();
        return;
      }

      if (newParentId === movedId) {
        clearPreview();
        return;
      }

      if (newParentId) {
        const descendants = collectDescendants(movedNode);
        if (descendants.has(newParentId)) {
          toast.error("Não é permitido mover um processo para baixo de um descendente dele.");
          await queryClient.invalidateQueries({ queryKey: ["areaTree", areaId] });
          clearPreview();
          return;
        }
      }

      const oldParentId = movedNode.parent_id; // string | null
      const isSameParent = oldParentId === newParentId;

      const payload: MoveProcessDto = {
        position,
        ...(isSameParent ? {} : { parent_id: newParentId }),
      };

      clearPreview();

      await moveMutation.mutateAsync({ process_id: movedId, payload });
    },
    [
      moveMode,
      areaId,
      tree,
      hoverParentId,
      hoverPosition,
      moveMutation,
      queryClient,
      clearPreview,
    ]
  );

  return {
    draggingId,
    hoverParentId,
    hoverPosition,
    cursor,
    clearPreview,

    handlers: {
      onNodeDragStart,
      onNodeDrag,
      onNodeDragStop,
    },
  };
}
