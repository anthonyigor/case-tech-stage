import { useState } from "react";
import type { ProcessDetail } from "../../../api/processes";
import { useQuery } from "@tanstack/react-query";
import { getPeople, type Person } from "../../../api/people";

export function OwnersTab({
  data,
  saving,
  onAdd,
  onRemove,
}: {
  data: ProcessDetail;
  saving: boolean;
  onAdd: (people_id: string) => void;
  onRemove: (people_id: string) => void;
}) {
  const [selected, setSelected] = useState<string>("");

  const peopleQuery = useQuery({
    queryKey: ['people'],
    queryFn: getPeople,
    staleTime: 60_000,
  })

  // ids ja atribuidos
  const assignedIds = new Set(data.owners.map((o) => o.people_id));

  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-4">
        <div className="text-sm font-semibold text-slate-50">Adicionar responsável</div>
        <div className="mt-3 space-y-2">
            {peopleQuery.isLoading ? (
                <div className="text-sm text-slate-300">Carregando pessoas...</div>
            ) : peopleQuery.isError ? (
                <div className="text-sm text-red-300">Erro ao carregar pessoas.</div>
            ) : (
                <>
                <label className="text-sm text-slate-300">Pessoa</label>
                <select
                value={selected}
                onChange={(e) => setSelected(e.target.value)}
                className="w-full rounded-xl bg-white/5 px-4 py-2 text-sm
                           text-slate-100 dark:text-slate-600 ring-1 ring-white/10
                           outline-none focus:ring-sky-500/40"
                >
                <option value="">Selecione uma pessoa</option>
                {peopleQuery.data!.map((p: Person) => (
                  <option
                    key={p.id}
                    value={p.id}
                    disabled={assignedIds.has(p.id)}
                  >
                    {p.name}
                    {p.email ? ` — ${p.email}` : ""}
                  </option>
                ))}
              </select>

              <button
                disabled={saving || !selected}
                onClick={() => {
                  onAdd(selected);
                  setSelected("");
                }}
                className="mt-2 w-full rounded-xl bg-white/5 px-4 py-2
                           text-sm ring-1 ring-white/10
                           hover:bg-white/10 disabled:opacity-50"
              >
                {saving ? "Adicionando..." : "Adicionar responsável"}
              </button>
                </>
            )}
        </div>
      </div>

       {/* Lista de responsáveis */}
      <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-4">
        <div className="text-sm font-semibold text-slate-50">Responsáveis</div>
        <div className="mt-3 space-y-2">
          {data.owners.length === 0 ? (
            <div className="text-sm text-slate-300">Nenhum responsável.</div>
          ) : (
            data.owners.map((o) => (
              <div key={o.id} className="flex items-start justify-between gap-3 rounded-xl bg-white/5 ring-1 ring-white/10 p-3">
                <div className="min-w-0">
                  <div className="font-medium text-slate-50">{o.people?.name ?? o.people_id}</div>
                  <div className="text-xs text-slate-300">
                    {o.people?.email ?? "—"} {o.people?.team?.name ? `• ${o.people.team.name}` : ""}
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (confirm(`Remover ${o.people?.name ?? "responsável"} deste processo?`)) {
                      onRemove(o.people_id);
                    }
                  }}
                  className="shrink-0 rounded-xl bg-red-500/15 px-3 py-2 text-xs ring-1 ring-red-500/30 hover:bg-red-500/20 disabled:opacity-50"
                >
                  Remover
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}