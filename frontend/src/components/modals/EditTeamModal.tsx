import { useEffect, useMemo, useState } from "react";
import type { CreateTeamDto } from "../../api/teams";
import { usePeople } from "../../hooks/usePeople";
import type { Person } from "../../api/people";

export function EditTeamModal(props: {
  team: { id: string; name: string; description?: string | null; people?: Person[] };
  loading?: boolean;
  onClose: () => void;
  onSubmit: (teamId: string, data: CreateTeamDto) => void | Promise<void>;
}) {
  const { data } = usePeople();

  const [name, setName] = useState(props.team.name ?? "");
  const [description, setDescription] = useState(props.team.description ?? "");
  const [selectedIds, setSelectedIds] = useState<string[]>(props.team?.people?.map(p => p.id) ?? []);


  // se trocar de time sem desmontar modal (edge case), reseta
  useEffect(() => {
    setName(props.team.name ?? "");
    setDescription(props.team.description ?? "");
    setSelectedIds(props.team?.people?.map(p => p.id) ?? []);
  }, [props.team.id]);

  // map pra achar nome por id
  const byId = useMemo(() => {
    const m = new Map<string, Person>();
    (data ?? []).forEach((p) => m.set(p.id, p));
    return m;
  }, [data]);

  const submit = () => {
    props.onSubmit(props.team.id, {
      name: name.trim(),
      description: description.trim(),
      peopleIds: selectedIds,
    });
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={props.onClose} />
      <div className="relative w-full max-w-lg rounded-2xl bg-slate-950/80 ring-1 ring-white/10 backdrop-blur-xl p-4">
        <div className="flex items-center justify-between">
          <div className="text-base font-semibold">Editar Time</div>
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
              placeholder="Nome do time"
            />
          </div>

          <div>
            <label className="text-sm text-slate-300">Descrição</label>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 w-full rounded-xl bg-white/5 px-4 py-2 text-sm text-slate-100 ring-1 ring-white/10 outline-none focus:ring-sky-500/40"
              placeholder="Descrição do time"
            />
          </div>

          {/* membros (multi-select por clique) */}
          {data && (
            <div>
              <label className="text-sm text-slate-300">Membros</label>

              <div className="mt-1 rounded-2xl bg-white/5 ring-1 ring-white/10 p-2">
                {selectedIds.length > 0 ? (
                  <div className="flex flex-wrap gap-2 p-1">
                    {selectedIds.map((id) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setSelectedIds((prev) => prev.filter((x) => x !== id))}
                        className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-100 ring-1 ring-white/10 hover:bg-white/10"
                        title="Clique para remover"
                      >
                        {byId.get(id)?.name ?? id} <span className="opacity-60">✕</span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-2 text-xs text-slate-400">Selecione uma ou mais pessoas abaixo.</div>
                )}
              </div>

              <div className="mt-2 max-h-56 overflow-auto rounded-2xl bg-white/5 ring-1 ring-white/10">
                {data.map((p: Person) => {
                  const selected = selectedIds.includes(p.id);
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        setSelectedIds((prev) =>
                          prev.includes(p.id) ? prev.filter((x) => x !== p.id) : [...prev, p.id]
                        );
                      }}
                      className={[
                        "w-full text-left px-4 py-3 text-sm transition",
                        "hover:bg-white/10",
                        selected ? "bg-sky-500/10 ring-inset ring-1 ring-sky-500/20" : "",
                      ].join(" ")}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <div className="truncate text-slate-100">{p.name}</div>
                          <div className="truncate text-xs text-slate-400">{p.email ?? "—"}</div>
                        </div>
                        <div
                          className={[
                            "shrink-0 rounded-full px-2 py-1 text-[11px] ring-1",
                            selected
                              ? "bg-sky-500/15 text-sky-100 ring-sky-500/30"
                              : "bg-white/5 text-slate-300 ring-white/10",
                          ].join(" ")}
                        >
                          {selected ? "Selecionado" : "Selecionar"}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {selectedIds.length > 0 && (
                <button
                  type="button"
                  onClick={() => setSelectedIds([])}
                  className="mt-2 rounded-xl bg-white/5 px-3 py-2 text-xs ring-1 ring-white/10 hover:bg-white/10"
                >
                  Limpar seleção
                </button>
              )}
            </div>
          )}

          <button
            disabled={props.loading || !name.trim()}
            onClick={submit}
            className="w-full rounded-xl bg-sky-500/20 px-4 py-2 text-sm ring-1 ring-sky-500/30 hover:bg-sky-500/25 disabled:opacity-50"
          >
            Salvar alterações
          </button>
        </div>
      </div>
    </div>
  );
}
