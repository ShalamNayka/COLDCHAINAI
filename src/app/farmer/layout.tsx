"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, FileText, Settings, LogOut } from "lucide-react";

export default function FarmerLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = () => {
        localStorage.clear();
        router.push("/");
    };

    const navs = [
        { name: "Dashboard", href: "/farmer/dashboard", icon: LayoutDashboard },
        { name: "My Receipts", href: "/farmer/receipts", icon: FileText },
    ];

    return (
        <div className="flex h-screen bg-slate-50">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col">
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-emerald-700">AgriStorage</h2>
                    <p className="text-sm text-slate-500">Farmer Portal</p>
                </div>

                <nav className="flex-1 px-4 space-y-2 mt-4">
                    {navs.map((n) => {
                        const Icon = n.icon;
                        const active = pathname === n.href;
                        return (
                            <a
                                key={n.name}
                                href={n.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${active
                                        ? "bg-emerald-50 text-emerald-700 font-medium"
                                        : "text-slate-600 hover:bg-slate-50"
                                    }`}
                            >
                                <Icon className="w-5 h-5" />
                                {n.name}
                            </a>
                        )
                    })}
                </nav>

                <div className="p-4 border-t border-slate-200">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 w-full text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all"
                    >
                        <LogOut className="w-5 h-5" />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                {/* Mobile Header */}
                <header className="md:hidden bg-white p-4 border-b border-slate-200 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-emerald-700">AgriStorage</h2>
                    <button onClick={handleLogout} className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg">
                        <LogOut className="w-5 h-5" />
                    </button>
                </header>

                {children}
            </main>
        </div >
    );
}
