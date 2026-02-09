import { Handle, Position } from "@xyflow/react";
import { FaPlus } from "react-icons/fa";
import type { ProcessStatus } from "../../api/processes";
import { useEffect, useRef, useState } from "react";

const STATUSES: ProcessStatus[] = ["ACTIVE", "DRAFT", "DEPRECATED"];
const STATNAMES: any = {
  ACTIVE: "ATIVO",
  DRAFT: 'RASCUNHO',
  DEPRECATED: "INATIVO"
}

function badge(status: string) {
  if (status === "ACTIVE") return "bg-emerald-500/15 text-emerald-100 ring-emerald-500/30";
  if (status === "DRAFT") return "bg-amber-500/15 text-amber-100 ring-amber-500/30";
  return "bg-slate-500/15 text-slate-100 ring-slate-500/30";
}

export function ProcessNode({ data }: any) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const disable = !!data.disableActions;

  // Fecha ao clicar fora
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);
  
  return (
    <div 
     className={[
        "relative w-65 rounded-2xl bg-white/5 ring-1 ring-white/10 backdrop-blur-xl shadow-lg px-4 py-3",
        data.isDropTarget ? "ring-sky-500/60 bg-sky-500/10" : "",
      ].join(" ")}
    >
      <Handle type="target" position={Position.Top} className="bg-white/60!" />
      <Handle type="source" position={Position.Bottom} className="bg-white/60!" />

       {/* botão + subprocesso */}
      <button
        type="button"
        title="Criar subprocesso"
        disabled={disable}
        onClick={(e) => {
          e.stopPropagation();
          if (disable) return;
          data.onAddChild?.(data.raw?.id);
        }}
        className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-xl
                   bg-white/5 ring-1 ring-white/10 hover:bg-white/10
                   disabled:opacity-40 disabled:hover:bg-white/5 hover:cursor-pointer"
      >
        <FaPlus className="h-2 w-3 text-slate-300" />
      </button>

      <div className="flex items-start justify-between gap-4 pr-8">
        <div className="min-w-0">
          <div className="truncate font-semibold text-slate-50">{data.title}</div>
          <div className="mt-1 text-xs text-slate-300">
            {data.typeProcess === "MANUAL" ? "Manual" : "Sistêmico"}
          </div>
        </div>

        {/* Badge clicável */}
        <div ref={ref} className="relative">
          <button
            type="button"
            disabled={disable}
            onClick={(e) => {
              e.stopPropagation(); // não abrir drawer ao clicar no badge
              if (disable) return;
              setOpen((v) => !v);
            }}
            className={`shrink-0 rounded-full px-2 py-1 text-[11px] ring-1 ${badge(data.status)} hover:brightness-110 hover:cursor-pointer disabled:opacity-60`}
            title="Alterar status"
          >
            {STATNAMES[data.status]}
          </button>

          {open && (
            <div
              className="absolute right-0 mt-2 w-37.5 rounded-xl bg-slate-950/90 ring-1 ring-white/10 backdrop-blur-xl p-2 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-2 pb-2 text-[11px] text-slate-400">Status</div>

              {STATUSES.filter((s) => s !== data.status).map((s) => (
                <button
                  key={s}
                  className="w-full text-left rounded-lg px-2 py-2 text-sm text-slate-100 hover:bg-white/10"
                  onClick={() => {
                    data.onChangeStatus?.(data.raw?.id, s);
                    setOpen(false);
                  }}
                >
                  {STATNAMES[s]}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
