import { useState } from "react";
import type { ProcessDetail, ToolType } from "../../../api/processes";
import { input } from "../ProcessDrawer";

export function ToolsTab({
  data,
  saving,
  onAdd,
}: {
  data: ProcessDetail;
  saving: boolean;
  onAdd: (payload: { name: string; type?: ToolType; url?: string }) => void;
}) {
  const [name, setName] = useState("");
  const [type, setType] = useState<ToolType | "">("");
  const [url, setUrl] = useState("");

  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-4">
        <div className="text-sm font-semibold text-slate-50">Adicionar ferramenta</div>

        <div className="mt-3 grid gap-2">
          <label className="text-sm text-slate-300">Nome</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className={input} maxLength={255} />
          <label className="text-sm text-slate-300">URL (opcional)</label>
          <input value={url} onChange={(e) => setUrl(e.target.value)} className={input} placeholder="https://..." />

          <button
            disabled={saving || !name.trim()}
            onClick={() => {
              onAdd({ name: name.trim(), type: type || undefined, url: url.trim() || undefined });
              setName("");
              setType("");
              setUrl("");
            }}
            className="w-full rounded-xl bg-white/5 px-4 py-2 text-sm ring-1 ring-white/10 hover:bg-white/10 disabled:opacity-50"
          >
            {saving ? "Adicionando..." : "Adicionar"}
          </button>
        </div>
      </div>

      <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-4">
        <div className="text-sm font-semibold text-slate-50">Ferramentas</div>
        <div className="mt-3 space-y-2">
          {data.tools.length === 0 ? (
            <div className="text-sm text-slate-300">Nenhuma ferramenta.</div>
          ) : (
            data.tools.map((t: any) => (
              <div key={t.id} className="rounded-xl bg-white/5 ring-1 ring-white/10 p-3">
                <div className="font-medium text-slate-50">{t.name}</div>
                <div className="text-xs text-slate-300">
                  {t.type ?? "—"} {t.url ? `• ${t.url}` : ""}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}