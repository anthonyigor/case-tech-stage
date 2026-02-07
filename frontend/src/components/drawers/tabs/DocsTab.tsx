import { useState } from "react";
import type { ProcessDetail } from "../../../api/processes";
import { input } from "../ProcessDrawer";

export function DocsTab({
  data,
  saving,
  onAdd,
}: {
  data: ProcessDetail;
  saving: boolean;
  onAdd: (payload: { title: string; url: string }) => void;
}) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-4">
        <div className="text-sm font-semibold text-slate-50">Adicionar documento</div>

        <div className="mt-3 grid gap-2">
          <label className="text-sm text-slate-300">Título</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className={input} maxLength={200} />

          <label className="text-sm text-slate-300">URL</label>
          <input value={url} onChange={(e) => setUrl(e.target.value)} className={input} placeholder="https://..." />

          <button
            disabled={saving || !title.trim() || !url.trim()}
            onClick={() => {
              onAdd({ title: title.trim(), url: url.trim() });
              setTitle("");
              setUrl("");
            }}
            className="w-full rounded-xl bg-white/5 px-4 py-2 text-sm ring-1 ring-white/10 hover:bg-white/10 disabled:opacity-50"
          >
            {saving ? "Adicionando..." : "Adicionar"}
          </button>
        </div>
      </div>

      <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-4">
        <div className="text-sm font-semibold text-slate-50">Documentos</div>
        <div className="mt-3 space-y-2">
          {data.docs.length === 0 ? (
            <div className="text-sm text-slate-300">Nenhum documento.</div>
          ) : (
            data.docs.map((d: any) => (
              <a
                key={d.id}
                href={d.url}
                target="_blank"
                rel="noreferrer"
                className="block rounded-xl bg-white/5 ring-1 ring-white/10 p-3 hover:bg-white/10"
              >
                <div className="font-medium text-slate-50">{d.title}</div>
                <div className="text-xs text-slate-300 break-all">{d.url}</div>
              </a>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
