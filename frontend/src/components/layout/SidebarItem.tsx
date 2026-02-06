type Props = {
  label: string;
  icon: any;
  collapsed: boolean;
  active?: boolean;
};

export function SidebarItem({ label, icon, collapsed, active }: Props) {
  return (
    <button
      title={collapsed ? label : undefined}
      className={[
        "w-full flex items-center gap-3 rounded-xl px-3 py-2 text-sm",
        "ring-1 ring-transparent hover:bg-white/10 hover:ring-white/10",
        active ? "bg-white/10 ring-white/10" : "text-slate-200",
      ].join(" ")}
    >
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/5 ring-1 ring-white/10">
        {icon}
      </span>
      {!collapsed && <span className="truncate">{label}</span>}
    </button>
  );
}
