import { useState } from "react";
import type { CreatePersonDto } from "../../api/people";

export function CreatePeopleModal(props: {
  loading?: boolean;
  onClose: () => void;
  onSubmit: (data: CreatePersonDto) => void | Promise<void>;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [team_id, setTeamId] = useState("");

  const submit = () => {
    props.onSubmit({
        name: name.trim(),
        email: email.trim(),
        role: role.trim(),
        team_id: team_id.trim() || undefined,
    })
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={props.onClose} />
      <div className="relative w-full max-w-lg rounded-2xl bg-slate-950/80 ring-1 ring-white/10 backdrop-blur-xl p-4">
        <div className="flex items-center justify-between">
          <div className="text-base font-semibold">Criar Pessoa</div>
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
              placeholder="Nome da pessoa"
            />
          </div>

          <div>
            <label className="text-sm text-slate-300">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-xl bg-white/5 px-4 py-2 text-sm text-slate-100 ring-1 ring-white/10 outline-none focus:ring-sky-500/40"
              placeholder="Email da pessoa"
            />
          </div>

          <div>
            <label className="text-sm text-slate-300">Cargo</label>
            <input
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="mt-1 w-full rounded-xl bg-white/5 px-4 py-2 text-sm text-slate-100 ring-1 ring-white/10 outline-none focus:ring-sky-500/40"
              placeholder="Cargo da pessoa"
            />
          </div>

          <div>
            <label className="text-sm text-slate-300">Time</label>
            <textarea
              value={team_id}
              onChange={(e) => setTeamId(e.target.value)}
              rows={4}
              className="mt-1 w-full resize-none rounded-xl bg-white/5 px-4 py-2 text-sm text-slate-100 ring-1 ring-white/10 outline-none focus:ring-sky-500/40"
              placeholder="Opcional"
            />
          </div>

          <button
            disabled={props.loading || !name.trim()}
            onClick={() => submit()}
            className="w-full rounded-xl bg-sky-500/20 px-4 py-2 text-sm ring-1 ring-sky-500/30 hover:bg-sky-500/25 disabled:opacity-50"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}