import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTeams } from "../hooks/useTeams";
import { useState } from "react";
import { CreateTeamModal } from "../components/modals/CreateTeamModal";
import { createTeam, deleteTeam, type CreateTeamDto } from "../api/teams";
import toast from "react-hot-toast";

const glass = "rounded-2xl bg-white/2 ring-1 ring-white/10 backdrop-blur-xl";

export function TeamPage() {
    const qc = useQueryClient()
    const [openModal, setOpenModal] = useState<boolean>(false)

    const { data } = useTeams()

    const createMut = useMutation({
        mutationFn: (payload: CreateTeamDto) => createTeam(payload),
        onSuccess: async () => {
            await qc.invalidateQueries({ queryKey: ["teams"] })
            toast.success("Time criado com sucesso!")
        },
        onError: (err: any) => toast.error(`Erro ao criar time: ${err?.response?.data?.message || err.message || "Erro desconhecido"}`)
    })

    const deleteMut = useMutation({
        mutationFn: (id: string) => deleteTeam(id),
        onSuccess: async () => {
            await qc.invalidateQueries({ queryKey: ["teams"] })
            toast.success("Time removido com sucesso!")
        },
        onError: (err: any) => toast.error(`Erro ao remover time: ${err?.response?.data?.message || err.message || "Erro desconhecido"}`)
    })

    const submit = async (form: CreateTeamDto) => {
        await createMut.mutateAsync(form)
        setOpenModal(false)
    }

    return (
            <div className="flex min-h-[calc(100vh-2rem)] flex-col gap-4">
                {/* Header */}
                <div className={`${glass} p-4`}>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-3xl font-semibold">Times</h1>
                            <p className="mt-2 text-sm text-slate-300">
                                Gerencie os times envolvidos nos processos.
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setOpenModal(true)}
                                className="cursor-pointer rounded-xl bg-sky-500/20 px-4 py-2 text-sm ring-1 ring-sky-500/30 hover:bg-sky-500/25"
                            >
                                + Novo time
                            </button>
                        </div>
                    </div>
                </div>
    
                {/* Content */}
                <div className={`${glass} p-4`}>
                    {data ? (
                        data.map((o) => (
                            <div key={o.id} className="flex items-start justify-between gap-5 rounded-xl bg-white/5 ring-1 ring-white/10 p-3">
                                <div className="min-w-0">
                                <div className="font-medium text-slate-50">{o.name ?? o.id}</div>
                                <div className="text-xs text-slate-300">
                                    {o.description ?? "Sem descrição"}
                                </div>
                                </div>
    
                                <button
                                onClick={() => {
                                    if (confirm(`Remover ${o.name ?? "time"}?`)) {
                                        deleteMut.mutate(o.id)
                                    }
                                }}
                                className="shrink-0 rounded-xl bg-red-500/15 px-3 py-2 text-xs ring-1 ring-red-500/30 hover:bg-red-500/20 disabled:opacity-50"
                                >
                                Remover
                                </button>
                            </div>
                            ))
                    ) : (
                        <p className="text-slate-300">Nenhum time cadastrado.</p>
                    )}
                </div>
                {openModal && (
                    <CreateTeamModal
                        onClose={() => setOpenModal(false)}
                        onSubmit={submit}
                        loading={createMut.isPending}
                    />
                )}
            </div>
        )
}