import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usePeople } from "../hooks/usePeople";
import { createPerson, removePerson, updatePerson, type CreatePersonDto, type Person, type UpdatePersonDto } from "../api/people";
import toast from "react-hot-toast";
import { useState } from "react";
import { CreatePeopleModal } from "../components/modals/CreatePeopleModal";
import { EditPeopleModal } from "../components/modals/EditPeopleModal";

const glass = "rounded-2xl bg-white/2 ring-1 ring-white/10 backdrop-blur-xl";

export function PeoplePage() {
    const qc = useQueryClient()
    const [openModal, setOpenModal] = useState<boolean>(false)
    const [editing, setEditing] = useState<Person | null>(null)
    const [editOpen, setEditOpen] = useState<boolean>(false)

    const { data } = usePeople()

    // mutations
    const createMut = useMutation({
        mutationFn: (payload: CreatePersonDto) => createPerson(payload),
        onSuccess: async () => {
            await qc.invalidateQueries({ queryKey: ["people"] })
            toast.success('Pessoa cadastrada com sucesso!')
        },
        onError: (err: any) => toast.error(`Erro ao criar pessoa: ${err?.response?.data?.message || err.message || "Erro desconhecido"}`)
    })

    const updateMut = useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: UpdatePersonDto }) => updatePerson(id, payload),
        onSuccess: async () => {
            await qc.invalidateQueries({ queryKey: ["people"] })
            toast.success('Atualizado com sucesso!')
        },
        onError: (err: any) => toast.error(`Erro ao editar pessoa: ${err?.response?.data?.message || err.message || "Erro desconhecido"}`)
    })

    const deleteMut = useMutation({
        mutationFn: (id: string) => removePerson(id),
        onSuccess: async () => {
            await qc.invalidateQueries({ queryKey: ["people"] })
            toast.success("Pessoa removida com sucesso!")
        },
        onError: (err: any) => toast.error(`Erro ao remover pessoa: ${err?.response?.data?.message || err.message || "Erro desconhecido"}`)
    })

    async function onSubmit(form: CreatePersonDto) {
        await createMut.mutateAsync(form)
        setOpenModal(false)
    }

    async function onSubmitUpdate(id: string, form: UpdatePersonDto) {
        await updateMut.mutateAsync({ id, payload: form })
        setEditOpen(false)
    }

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
                            onClick={() => setOpenModal(true)}
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
                            <div className="shrink-0 flex gap-2">
                                 <button
                                        onClick={() => {
                                            setEditing(o);
                                            setEditOpen(true);
                                        }}
                                        className="rounded-xl bg-white/5 px-3 py-2 text-xs ring-1 ring-white/10 hover:bg-white/10"
                                    >
                                        Editar
                                </button>
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
                        </div>
                        ))
                ) : (
                    <p className="text-slate-300">Nenhuma pessoa cadastrada.</p>
                )}
            </div>
            {openModal && (
                <CreatePeopleModal
                    onClose={() => setOpenModal(false)}
                    onSubmit={onSubmit}
                    loading={createMut.isPending}
                />
            )}
            {editOpen && editing && (
                <EditPeopleModal
                    onClose={() => setEditOpen(false)}
                    onSubmit={onSubmitUpdate}
                    loading={updateMut.isPending}
                    person={{
                        id: editing.id,
                        email: editing.email,
                        name: editing.name,
                        role: editing.role ?? ""
                    }}
                />
            )}
        </div>
    )
}