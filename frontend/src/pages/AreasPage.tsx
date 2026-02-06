import { useState } from "react";
import { useAreas } from "../hooks/useAreas";
import { createArea, type Area } from "../api/areas";
import { AreaModal } from "../components/modals/AreaModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const glass = "rounded-2xl bg-white/2 ring-1 ring-white/10 backdrop-blur-xl";

export function AreasPage() {
    const qc = useQueryClient()
    const [openModal, setOpenModal] = useState<boolean>(false)
    const [editing, setEditing] = useState<Area | null>(null)
    const nav = useNavigate()

    function openCreate() {
        setEditing(null);
        setOpenModal(true);
    }
    
    const { data, isLoading, isError, error } = useAreas()
    
    const createAreaMut = useMutation({
        mutationFn: createArea,
        onSuccess: () => qc.invalidateQueries({ queryKey: ['areas'] }),
        onError: (err: any) => toast.error(err.response.data.message)
    })

    async function onSubmit(form: { name: string, description?: string }) {
        await createAreaMut.mutateAsync(form)
        setOpenModal(false)
    }

    return (
    <div className="flex min-h-[calc(100vh-2rem)] flex-col gap-4">
      {/* Header */}
      <div className={`${glass} p-4`}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Áreas</h1>
            <p className="mt-2 text-sm text-slate-300">
              Cadastre áreas/departamentos para organizar os processos.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={openCreate}
              className="cursor-pointer rounded-xl bg-sky-500/20 px-4 py-2 text-sm ring-1 ring-sky-500/30 hover:bg-sky-500/25"
            >
              + Nova área
            </button>
          </div>
        </div>

      </div>

      {/* Content */}
      <div className={`${glass} p-4`}>
        {isLoading ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-30 animate-pulse rounded-2xl bg-white/5 ring-1 ring-white/10" />
            ))}
          </div>
        ) : isError ? (
          <div className="rounded-2xl bg-red-500/10 p-4 ring-1 ring-red-500/30 text-red-100">
            Erro ao carregar áreas: {(error as Error).message}
          </div>
        ) : data?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="text-lg font-semibold">Nenhuma área encontrada</div>
            <div className="mt-2 text-sm text-slate-300">
              Crie uma área para começar a mapear processos e subprocessos.
            </div>
            <button
              onClick={openCreate}
              className="mt-5 rounded-xl bg-sky-500/20 px-4 py-2 text-sm ring-1 ring-sky-500/30 hover:bg-sky-500/25"
            >
              Criar primeira área
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 mt-3">
            {data?.map((a) => (
              <div
                key={a.id}
                className="group rounded-2xl bg-white/5 ring-1 ring-white/10 p-4 hover:bg-white/10 transition"
              >
                <button
                  className="w-full text-left"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="truncate text-base font-semibold">{a.name}</div>
                      <div className="mt-1 line-clamp-2 text-sm text-slate-300">
                        {a.description || "Sem descrição"}
                      </div>
                    </div>
                    <div 
                      onClick={() => nav(`/areas/${a.id}/processos`)}
                      className="shrink-0 rounded-xl bg-white/5 ring-1 ring-white/10 px-3 py-1 text-xs text-slate-300"
                    >
                      Abrir processos
                    </div>
                  </div>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal simples */}
      {openModal && (
        <AreaModal
          title={editing ? "Editar área" : "Nova área"}
          initial={{ name: editing?.name ?? "", description: editing?.description ?? "" }}
          onClose={() => setOpenModal(false)}
          onSubmit={onSubmit}
        />
      )}
    </div>
  );

}