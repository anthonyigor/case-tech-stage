import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { TiThMenu } from "react-icons/ti";
import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";

export function Layout() {
    const [mobileOpen, setMobileOpen] = useState<boolean>(false)
    const [collapsed, setCollapsed] = useState<boolean>(false)

    return (
        <>
        <Toaster position="top-right"/>
        <div className="min-h-dvh bg-slate-950 text-slate-100">
            {/* Background */}
            <div className="pointer-events-none fixed inset-0">
                <div className="absolute -top-44 left-1/2 h-140 w-140 -translate-x-1/2 rounded-full bg-indigo-600 blur-3xl"/>
                <div className="absolute -bottom-56 right-40 h-170 w-170 rounded-full bg-cyan-500/15 blur-3xl" />
                <div className="absolute inset-0 bg-linear-to-b from-slate-950 via-slate-950 to-slate-900" />
            </div>

            <div className="relative mx-auto flex min-h-dvh w-full max-w-470 gap-4 p-4">
                <Sidebar
                    collapsed={collapsed}
                    onToggleCollapsed={() => setCollapsed((v) => !v)}
                    mobileOpen={mobileOpen}
                    onOpenMobile={() => setMobileOpen(true)}
                    onCloseMobile={() => setMobileOpen(false)}
                />

                 {/* Main */}
                    <div className="flex min-w-0 flex-1 flex-col">
                        {/* Topbar mobile */}
                        <div className="mb-4 flex items-center justify-between lg:hidden">
                            <button
                            onClick={() => setMobileOpen(true)}
                            className="rounded-xl bg-white/5 px-2 py-2 text-sm ring-1 ring-white/10 hover:bg-white/10"
                            >
                            <TiThMenu className="w-12 h-4"/>
                            </button>

                        </div>

                        {/* Content placeholder */}
                        <div className="flex-1 rounded-2xl bg-white/5 ring-1 ring-white/10 backdrop-blur-xl p-6">
                            <Outlet />
                        </div>
                    </div>
            </div>

        </div>
        </>
    )
}