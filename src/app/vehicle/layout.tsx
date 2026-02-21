"use client";

import { usePathname, useRouter } from "next/navigation";
import { LogOut, Navigation } from "lucide-react";

export default function VehicleLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();

    const handleLogout = () => {
        localStorage.clear();
        router.push("/");
    };

    return (
        <div className="flex h-screen bg-slate-50">
            <aside className="w-64 bg-slate-900 border-r border-slate-800 hidden md:flex flex-col text-slate-300">
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-orange-400">AgriTransport</h2>
                    <p className="text-sm text-slate-500 mt-1">Provider Portal</p>
                </div>

                <nav className="flex-1 px-4 mt-6">
                    <a href="/vehicle/dashboard" className="flex items-center gap-3 px-4 py-3 bg-orange-500/10 text-orange-400 rounded-xl font-medium">
                        <Navigation className="w-5 h-5" /> Tracking Panel
                    </a>
                </nav>

                <div className="p-4">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 w-full hover:bg-slate-800 text-slate-400 rounded-xl transition-all"
                    >
                        <LogOut className="w-5 h-5" /> Logout
                    </button>
                </div>
            </aside>

            <main className="flex-1 overflow-auto">
                <header className="md:hidden bg-slate-900 p-4 flex items-center justify-between text-white">
                    <h2 className="text-xl font-bold text-orange-400">AgriTransport</h2>
                    <button onClick={handleLogout} className="p-2 text-slate-400">
                        <LogOut className="w-5 h-5" />
                    </button>
                </header>

                {children}
            </main>
        </div>
    );
}
