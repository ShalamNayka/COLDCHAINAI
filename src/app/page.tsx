"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Leaf, Warehouse, Truck, ArrowRight } from "lucide-react";

export default function Home() {
  const router = useRouter();

  const selectRole = (role: string) => {
    localStorage.setItem("userRole", role);
    router.push("/login");
  };

  const roles = [
    { id: "farmer", title: "Farmer", icon: Leaf, desc: "Book storage & vehicles" },
    { id: "warehouse_owner", title: "Storage Owner", icon: Warehouse, desc: "Manage facility & bookings" },
    { id: "vehicle_provider", title: "Vehicle Provider", icon: Truck, desc: "List tractors & lorries" }
  ];

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-linear-to-br from-emerald-50 to-teal-100">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="w-20 h-20 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-200">
          <Leaf className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4 tracking-tight">AgriStorage System</h1>
        <p className="text-slate-600 text-lg md:text-xl max-w-xl mx-auto">
          A comprehensive supply chain & storage management network. Select your role to continue.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6 w-full max-w-5xl">
        {roles.map((role, idx) => {
          const Icon = role.icon;
          return (
            <motion.button
              key={role.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => selectRole(role.id)}
              className="bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 group border border-transparent hover:border-emerald-200 flex flex-col items-center text-center relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-linear-to-br from-emerald-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Icon className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-semibold text-slate-800 mb-2">{role.title}</h2>
              <p className="text-slate-500 mb-6">{role.desc}</p>
              <div className="mt-auto flex items-center text-emerald-600 font-medium group-hover:gap-2 transition-all">
                Proceed <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </motion.button>
          )
        })}
      </div>
    </main>
  );
}
