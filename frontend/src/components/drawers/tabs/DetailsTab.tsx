import { useMemo, useState } from "react";
import type { ProcessDetail, ProcessStatus, ProcessType } from "../../../api/processes";
import { input } from "../ProcessDrawer";

export const select =
  "w-full rounded-xl bg-white/5 px-4 py-2 text-sm text-slate-100 dark:text-slate-600 ring-1 ring-white/10 outline-none placeholder:text-slate-500 focus:ring-sky-500/40";

export function DetailsTab({
  data,
  onSave,
  saving,
}: {
  data: ProcessDetail;
  saving: boolean;
  onSave: (payload: { title: string; description?: string; status?: ProcessStatus; type?: ProcessType }) => void;
}) {
  const [title, setTitle] = useState(data.title);
  const [description, setDescription] = useState(data.description ?? "");
  const [type, setType] = useState<ProcessType>(data.type);
  const [status, setStatus] = useState<ProcessStatus>(data.status);

  // se trocar de processo, reseta o form
  useMemo(() => {
    setTitle(data.title);
    setDescription(data.description ?? "");
    setType(data.type);
    setStatus(data.status);
  }, [data.id]);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-4">
        <div className="grid gap-3">
          <div>
            <label className="text-sm text-slate-300">Título</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className={input} maxLength={200} />
          </div>

          <div>
            <label className="text-sm text-slate-300">Descrição</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`${input} min-h-[96px] resize-none`}
              maxLength={255}
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="text-sm text-slate-300">Tipo</label>
              <select value={type} onChange={(e) => setType(e.target.value as ProcessType)} className={select}>
                <option value="MANUAL">MANUAL</option>
                <option value="SYSTEM">SISTEMICO</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-slate-300">Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value as ProcessStatus)} className={select}>
                <option value="DRAFT">RASCUNHO</option>
                <option value="ACTIVE">ATIVO</option>
                <option value="DEPRECATED">INATIVO</option>
              </select>
            </div>
          </div>

          <button
            disabled={saving || !title.trim()}
            onClick={() =>
              onSave({
                title: title.trim(),
                description: description.trim() || undefined,
                type,
                status,
              })
            }
            className="rounded-xl bg-sky-500/20 px-4 py-2 text-sm ring-1 ring-sky-500/30 hover:bg-sky-500/25 disabled:opacity-50"
          >
            {saving ? "Salvando..." : "Salvar alterações"}
          </button>

          <div className="text-xs text-slate-400">
            Criado: {new Date(data.created_at).toLocaleString()} <br />
            Atualizado: {new Date(data.updated_at).toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
}