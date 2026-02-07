import { useState } from "react"
import type { CreateProcessDto, ProcessStatus, ProcessType } from "../../api/processes"

type Props = {
    open: boolean
    onClose: () => void
    areaId: string
    parentId?: string | null
    onSubmit: (payload: CreateProcessDto) => Promise<void>
    loading?: boolean
}

export function CreateProcessModal({ open, onClose, areaId, parentId, onSubmit, loading }: Props) {
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [type, setType] = useState<ProcessType>("MANUAL")
    const [status, setStatus] = useState<ProcessStatus>("DRAFT")

    if (!open) return null

    async function handleSubmit() {
        const payload: CreateProcessDto = {
            area_id: areaId,
            parent_id: parentId,
            title,
            description,
            type,
            status,
            position: !parentId ? 0: undefined, // só define posição para processos raiz, para subprocessos a posição é definida automaticamente como último filho
        }

        await onSubmit(payload)
        onClose()

        //limpar form
        setTitle("")
        setDescription("")
        setType("MANUAL")
        setStatus("DRAFT")
    }

    return (
        <div className="fixed inset-0 z-50 grid place-items-center p-4">
            <div className="absolute inset-0 bg-black/60" onClick={onClose} />
            <div className="relative w-full max-w-lg rounded-2xl bg-slate-950/80 ring-1 ring-white/10 backdrop-blur-xl p-4">
                <div className="flex items-center justify-between">
                    <div className="text-base font-semibold">
                        {parentId ? "Novo subprocesso" : "Novo processo raiz"}
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-xl bg-white/5 px-3 py-2 text-sm ring-1 ring-white/10 hover:bg-white/10"
                    >
                        Fechar
                    </button>
                </div>

                <div className="mt-4 space-y-3">
                <div>
                    <label className="text-sm text-slate-300">Título</label>
                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="mt-1 w-full rounded-xl bg-white/5 px-4 py-2 text-sm text-slate-100 ring-1 ring-white/10 outline-none focus:ring-sky-500/40"
                        placeholder="Ex.: Contas a pagar"
                        maxLength={200}
                    />
                </div>

                <div>
                    <label className="text-sm text-slate-300">Descrição (opcional)</label>
                    <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="mt-1 w-full resize-none rounded-xl bg-white/5 px-4 py-2 text-sm text-slate-100 ring-1 ring-white/10 outline-none focus:ring-sky-500/40"
                    maxLength={255}
                    />
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                    <label className="text-sm text-slate-300">Tipo</label>
                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value as ProcessType)}
                        className="mt-1 w-full rounded-xl bg-white/5 px-4 py-2 text-sm text-slate-100 ring-1 ring-white/10 outline-none focus:ring-sky-500/40"
                    >
                        <option value="MANUAL">MANUAL</option>
                        <option value="SYSTEM">SISTEMA</option>
                    </select>
                    </div>

                    <div>
                        <label className="text-sm text-slate-300">Status</label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value as ProcessStatus)}
                            className="mt-1 w-full rounded-xl bg-white/5 px-4 py-2 text-sm text-slate-100 ring-1 ring-white/10 outline-none focus:ring-sky-500/40"
                        >
                            <option value="DRAFT">RASCUNHO</option>
                            <option value="ACTIVE">ATIVO</option>
                            <option value="DEPRECATED">INATIVO</option>
                        </select>
                    </div>
                </div>

                <button
                    disabled={loading || !title.trim()}
                    onClick={handleSubmit}
                    className="w-full rounded-xl bg-sky-500/20 px-4 py-2 text-sm ring-1 ring-sky-500/30 hover:bg-sky-500/25 disabled:opacity-50"
                >
                    {loading ? "Salvando..." : "Salvar"}
                </button>
                </div>
            </div>
        </div>
    );

}