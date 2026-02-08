import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usePeople } from "../hooks/usePeople";
import { removePerson } from "../api/people";
import toast from "react-hot-toast";

const glass = "rounded-2xl bg-white/2 ring-1 ring-white/10 backdrop-blur-xl";

export function PeoplePage() {
    const qc = useQueryClient()

    const { data } = usePeople()

    // mutations
    const deleteMut = useMutation({
        mutationFn: (id: string) => removePerson(id),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["people"] }),
            toast.success("Pessoa removida com sucesso!")
        },
        onError: (err: any) => toast.error(`Erro ao remover pessoa: ${err?.response?.data?.message || err.message || "Erro desconhecido"}`)
    })

    return (
        <div className="flex min-h-[calc(100vh-2rem)] flex-col gap-4">
            {/* Header */}
            <div className={`${glass} p-4`}>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-semibold">Pessoas</h1>
                        <p className="mt-2 text-sm text-slate-300">
                            Gerencie as pessoas envolvidas nos processos.
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => alert("Em breve!")}
                            className="cursor-pointer rounded-xl bg-sky-500/20 px-4 py-2 text-sm ring-1 ring-sky-500/30 hover:bg-sky-500/25"
                        >
                            + Nova pessoa
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
                                {o.email ?? "—"} {o?.team?.name ? `• ${o.team.name}` : ""}
                            </div>
                            </div>

                            <button
                            onClick={() => {
                                if (confirm(`Remover ${o.name ?? "pessoa"}?`)) {
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
                    <p className="text-slate-300">Nenhuma pessoa cadastrada.</p>
                )}
            </div>

        </div>
    )
}