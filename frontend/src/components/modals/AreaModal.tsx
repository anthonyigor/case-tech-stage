import { useState } from "react";

export function AreaModal(props: {
  title: string;
  initial: { name: string; description?: string };
  loading?: boolean;
  onClose: () => void;
  onSubmit: (v: { name: string; description?: string }) => void | Promise<void>;
}) {
  const [name, setName] = useState(props.initial.name);
  const [description, setDescription] = useState(props.initial.description ?? "");

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={props.onClose} />
      <div className="relative w-full max-w-lg rounded-2xl bg-slate-950/80 ring-1 ring-white/10 backdrop-blur-xl p-4">
        <div className="flex items-center justify-between">
          <div className="text-base font-semibold">{props.title}</div>
          <button
            onClick={props.onClose}
            className="rounded-xl bg-white/5 px-3 py-2 text-sm ring-1 ring-white/10 hover:bg-white/10"
          >
            Fechar
          </button>
        </div>

        <div className="mt-4 space-y-3">
          <div>
            <label className="text-sm text-slate-300">Nome</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-xl bg-white/5 px-4 py-2 text-sm text-slate-100 ring-1 ring-white/10 outline-none focus:ring-sky-500/40"
              placeholder="Ex.: Área de Pessoas"
            />
          </div>

          <div>
            <label className="text-sm text-slate-300">Descrição</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="mt-1 w-full resize-none rounded-xl bg-white/5 px-4 py-2 text-sm text-slate-100 ring-1 ring-white/10 outline-none focus:ring-sky-500/40"
              placeholder="Opcional"
            />
          </div>

          <button
            disabled={props.loading || !name.trim()}
            onClick={() => props.onSubmit({ name: name.trim(), description: description.trim() || undefined })}
            className="w-full rounded-xl bg-sky-500/20 px-4 py-2 text-sm ring-1 ring-sky-500/30 hover:bg-sky-500/25 disabled:opacity-50"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}