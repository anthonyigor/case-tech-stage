import { FaFolderPlus, FaUser, FaUserAlt, FaUsers } from "react-icons/fa"
import { SidebarItem } from "./SidebarItem"
import { TiThMenu } from "react-icons/ti"
import { clearAccessToken } from "../../auth/token"
import { useNavigate } from "react-router-dom"

type SidebarProps = {
    collapsed: boolean
    onToggleCollapsed: () => void
    mobileOpen: boolean
    onOpenMobile: () => void
    onCloseMobile: () => void
}

const nav = [
    { label: "Areas", icon: <FaFolderPlus className="w-6" />, to: '/areas' },
    { label: "Pessoas", icon: <FaUserAlt className="w-6"/>, to: '/people'},
    { label: "Times", icon: <FaUsers className="w-6"/>, to: '/teams' }
]

export function Sidebar({
    collapsed,
    onToggleCollapsed,
    mobileOpen,
    onCloseMobile
}: SidebarProps) {
    const panel = "h-full rounded-2xl bg-white/5 ring-1 ring-white/10 backdrop-blur-xl";
    const navigate = useNavigate()

    const DesktopSidebar = (
        <aside className={["hidden lg:block", collapsed ? "w-[86px]" : "w-[320px]"].join(" ")}>
            <div className={`${panel} p-3`}>
                {/* Header (perfil + collapse) */}
                <div className="flex items-center gap-3 p-2">
                    <div className="h-10 w-10 rounded-xl bg-white/10 ring-1 ring-white/10 flex items-center justify-center"><FaUser /></div>
                    {!collapsed && (
                        <div className="min-w-0">
                            <div className="truncate font-semibold">StageProcess</div>
                            <div className="truncate text-xs text-slate-400">Master</div>
                        </div>
                    )}

                    <button
                        onClick={onToggleCollapsed}
                        className="ml-auto rounded-xl bg-white/5 px-2 py-2 text-sm ring-1 ring-white/10 hover:bg-white/10"
                        title={collapsed ? "Expandir" : "Recolher"}
                    >
                        {collapsed ? "»" : "«"}
                    </button>
                </div>

                <div className="my-3 h-px bg-white/10" />

                {/* Nav */}
                <nav className="space-y-1">
                    {nav.map((item) => (
                        <SidebarItem
                            key={item.to}
                            label={item.label}
                            icon={item.icon}
                            to={item.to}
                            collapsed={collapsed}
                        />
                    ))}

                    <button onClick={() => { clearAccessToken(); navigate("/"); }}>
                        Sair
                    </button>
                </nav>
            </div>
        </aside>
    );

    const MobileDrawer = (
        <div className={`lg:hidden ${mobileOpen ? "block" : "hidden"}`}>
            <div className="fixed inset-0 z-40 bg-slate/60" onClick={onCloseMobile} />
            <aside className="fixed left-4 top-4 bottom-4 z-50 w-[320px]">
                <div className={`${panel} p-3`}>
                    <div className="flex items-center justify-between p-2">
                        <div className="font-semibold"><TiThMenu className="w-4" /></div>
                        <button
                        onClick={onCloseMobile}
                        className="rounded-xl bg-white/5 px-3 py-2 text-sm ring-1 ring-white/10 hover:bg-white/10"
                        >
                        Fechar
                        </button>
                    </div>

                    <div className="my-3 h-px bg-white/10" />

                    <nav className="space-y-1">
                        {nav.map((item) => (
                        <SidebarItem
                            key={item.to}
                            label={item.label}
                            icon={item.icon}
                            collapsed={false}
                            to={item.to}
                        />
                        ))}
                    </nav>
                </div>
            </aside>
        </div>
    );

    return (
        <>
            {DesktopSidebar}
            {MobileDrawer}
        </>
    )
}