import { NavLink } from "react-router-dom";

type Props = {
  label: string;
  icon: any;
  collapsed: boolean;
  to: string;
};

export function SidebarItem({ label, icon, to, collapsed }: Props) {
  return (
    <NavLink
      to={to}
      title={collapsed ? label : undefined}
      className={({ isActive }) =>
        [
          "w-full flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition",
          "ring-1 ring-transparent hover:bg-white/10 hover:ring-white/10",
          isActive
            ? "bg-white/10 ring-white/10 text-white"
            : "text-slate-300",
        ].join(" ")
      }
    >
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/5 ring-1 ring-white/10">
        {icon}
      </span>

      {!collapsed && <span className="truncate">{label}</span>}
    </NavLink>
  );
}

