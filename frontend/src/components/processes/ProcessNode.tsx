import { Handle, Position } from "@xyflow/react";
import { FaPlus } from "react-icons/fa";

function badge(status: string) {
  if (status === "ACTIVE") return "bg-emerald-500/15 text-emerald-100 ring-emerald-500/30";
  if (status === "DRAFT") return "bg-amber-500/15 text-amber-100 ring-amber-500/30";
  return "bg-slate-500/15 text-slate-100 ring-slate-500/30";
}

export function ProcessNode({ data }: any) {
  const canAddChild = typeof data?.onAddChild === "function";
  
  return (
    <div className="relative w-65 rounded-2xl bg-white/5 ring-1 ring-white/10 backdrop-blur-xl shadow-lg px-4 py-3">
      <Handle type="target" position={Position.Top} className="bg-white/60!" />
      <Handle type="source" position={Position.Bottom} className="bg-white/60!" />

       {/* botão + subprocesso */}
      <button
        type="button"
        title="Criar subprocesso"
        disabled={!canAddChild}
        onClick={(e) => {
          e.stopPropagation();
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

        <span className={`shrink-0 rounded-full px-2 py-1 text-[11px] ring-1 ${badge(data.status)}`}>
          {data.status}
        </span>
      </div>

    </div>
  );
}
