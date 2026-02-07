import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addDoc,
  addOwner,
  addTool,
  getProcessDetail,
  updateProcess,
  type ToolType,
} from "../../api/processes";
import toast from "react-hot-toast";
import { OwnersTab } from "./tabs/OwnersTab";
import { DocsTab } from "./tabs/DocsTab";
import { ToolsTab } from "./tabs/ToolsTab";
import { DetailsTab } from "./tabs/DetailsTab";

const glass = "bg-slate-950/70 ring-1 ring-white/10 backdrop-blur-xl";
export const input =
  "w-full rounded-xl bg-white/5 px-4 py-2 text-sm text-slate-100 ring-1 ring-white/10 outline-none placeholder:text-slate-500 focus:ring-sky-500/40";

type Props = {
  open: boolean;
  processId: string | null;
  areaId?: string;
  onClose: () => void;
};

type Tab = "details" | "owners" | "tools" | "docs";

export function ProcessDrawer({ open, processId, areaId, onClose }: Props) {
  const qc = useQueryClient();
  const [tab, setTab] = useState<Tab>("details");

  const q = useQuery({
    queryKey: ["process", processId],
    queryFn: () => getProcessDetail(processId!),
    enabled: open && !!processId,
    staleTime: 15_000,
  });

  const refreshTree = async () => {
    if (areaId) await qc.invalidateQueries({ queryKey: ["areaTree", areaId] });
  };

  const updateMut = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) => updateProcess(id, payload),
    onSuccess: async (_, vars) => {
      await qc.invalidateQueries({ queryKey: ["process", vars.id] });
      toast.success("Processo atualizado com sucesso!");
      await refreshTree();
    },
    onError: (err: any) => toast.error(`Erro ao salvar processo: ${err.response.data.message}`)
  });

  const addToolMut = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: { name: string; type?: ToolType; url?: string } }) =>
      addTool(id, payload),
    onSuccess: async (_, vars) => {
      await qc.invalidateQueries({ queryKey: ["process", vars.id] });
      toast.success("Ferramenta adicionada com sucesso!");
    },
    onError: (err: any) => toast.error(`Erro ao adicionar ferramenta: ${err.response.data.message}`)
  });

  const addOwnerMut = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: { people_id: string } }) => addOwner(id, payload),
    onSuccess: async (_, vars) => {
      await qc.invalidateQueries({ queryKey: ["process", vars.id] });
      toast.success("Responsável adicionado com sucesso!");
    },
    onError: (err: any) => toast.error(`Erro ao adicionar responsável: ${err.response.data.message}`)
  });

  const addDocMut = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: { title: string; url: string } }) => addDoc(id, payload),
    onSuccess: async (_, vars) => {
      await qc.invalidateQueries({ queryKey: ["process", vars.id] });
      toast.success("Documento adicionado com sucesso!");
    },
    onError: (err: any) => toast.error(`Erro ao adicionar documento: ${err.response.data.message}`)
  });

  const data = q.data;

  // UX: se fechar, volta pra details
  const handleClose = () => {
    setTab("details");
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* overlay */}
      <div className="absolute inset-0 bg-black/60" onClick={handleClose} />

      <aside
        className={[
          "absolute right-0 top-0 h-full w-full sm:max-w-130",
          "p-3 sm:p-4",
        ].join(" ")}
      >
        <div className={`h-full rounded-2xl ${glass} overflow-hidden`}>
          {/* header */}
          <div className="flex items-center justify-between border-b border-white/10 p-4">
            <div className="min-w-0">
              <div className="text-xs text-slate-400">Processo</div>
              <div className="truncate text-base font-semibold text-slate-50">
                {data?.title ?? (q.isLoading ? "Carregando..." : "—")}
              </div>
            </div>

            <button
              onClick={handleClose}
              className="rounded-xl bg-white/5 px-3 py-2 text-sm ring-1 ring-white/10 hover:bg-white/10"
            >
              Fechar
            </button>
          </div>

          {/* tabs */}
          <div className="flex gap-2 border-b border-white/10 p-3">
            <TabButton active={tab === "details"} onClick={() => setTab("details")}>
              Detalhes
            </TabButton>
            <TabButton active={tab === "owners"} onClick={() => setTab("owners")}>
              Responsáveis
            </TabButton>
            <TabButton active={tab === "tools"} onClick={() => setTab("tools")}>
              Ferramentas
            </TabButton>
            <TabButton active={tab === "docs"} onClick={() => setTab("docs")}>
              Docs
            </TabButton>
          </div>

          {/* content */}
          <div className="h-[calc(100%-112px)] overflow-auto p-4">
            {q.isLoading ? (
              <div className="text-sm text-slate-300">Carregando detalhes…</div>
            ) : q.isError ? (
              <div className="rounded-xl bg-red-500/10 p-3 text-sm text-red-100 ring-1 ring-red-500/30">
                Erro: {(q.error as Error).message}
              </div>
            ) : !data ? (
              <div className="text-sm text-slate-300">Selecione um processo.</div>
            ) 
            : tab === "details" ? (
              <DetailsTab data={data} saving={updateMut.isPending} onSave={(payload) => updateMut.mutate({ id: data.id, payload })} />
            ) 
            : tab === "owners" ? (
              <OwnersTab
                data={data}
                saving={addOwnerMut.isPending}
                onAdd={(people_id) => addOwnerMut.mutate({ id: data.id, payload: { people_id } })}
              />
            ) : tab === "tools" ? (
              <ToolsTab
                data={data}
                saving={addToolMut.isPending}
                onAdd={(payload) => addToolMut.mutate({ id: data.id, payload })}
              />
            ) : (
              <DocsTab
                data={data}
                saving={addDocMut.isPending}
                onAdd={(payload) => addDocMut.mutate({ id: data.id, payload })}
              />
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}

function TabButton({ active, onClick, children }: any) {
  return (
    <button
      onClick={onClick}
      className={[
        "rounded-xl px-3 py-2 text-sm ring-1 transition",
        active
          ? "bg-white/10 text-white ring-white/10"
          : "bg-white/5 text-slate-300 ring-white/10 hover:bg-white/10",
      ].join(" ")}
    >
      {children}
    </button>
  );
}
