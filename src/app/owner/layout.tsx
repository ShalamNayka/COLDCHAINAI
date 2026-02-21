"use client";

import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, LogOut, Building2 } from "lucide-react";

export default function OwnerLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = () => {
        localStorage.clear();
        router.push("/");
    };

    return (
        <div className="flex h-screen bg-slate-50">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 border-r border-slate-800 hidden md:flex flex-col text-white">
                <div className="p-6">
                    <h2 className="text-2xl font-bold bg-linear-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">AgriStorage</h2>
                    <p className="text-sm text-slate-400 mt-1">Owner Portal</p>
                </div>

                <nav className="flex-1 px-4 mt-6 space-y-1">
                    <a href="/owner/dashboard" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${pathname === "/owner/dashboard" ? "bg-blue-600/20 text-blue-400" : "text-slate-400 hover:bg-slate-800"}`}>
                        <LayoutDashboard className="w-5 h-5" /> Dashboard
                    </a>
                    <a href="/owner/profile" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${pathname === "/owner/profile" ? "bg-blue-600/20 text-blue-400" : "text-slate-400 hover:bg-slate-800"}`}>
                        <Building2 className="w-5 h-5" /> My Profile
                    </a>
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 w-full text-slate-400 hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-all"
                    >
                        <LogOut className="w-5 h-5" /> Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                {/* Mobile Header */}
                <header className="md:hidden bg-slate-900 p-4 border-b border-slate-800 flex items-center justify-between text-white">
                    <h2 className="text-xl font-bold text-blue-400">AgriStorage</h2>
                    <button onClick={handleLogout} className="p-2 text-slate-400 hover:bg-slate-800 rounded-lg">
                        <LogOut className="w-5 h-5" />
                    </button>
                </header>

                {children}
            </main>
        </div>
    );
}
