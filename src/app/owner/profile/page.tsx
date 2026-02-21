"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, MapPin, Building2, Loader2, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function OwnerProfilePage() {
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [form, setForm] = useState({
        name: "Suresh Godown",
        type: "cold_storage",
        lat: "17.385",
        lng: "78.486",
        price: "50",
        capacity: "500",
        contact: "9848012345"
    });

    const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
        setForm(prev => ({ ...prev, [key]: e.target.value }));

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        // Simulate save (mock)
        await new Promise(r => setTimeout(r, 1000));
        setSaving(false);
        setSaved(true);
        toast.success("Profile saved successfully!");
        setTimeout(() => router.push("/owner/dashboard"), 1500);
    };

    return (
        <div className="p-6 md:p-10 max-w-2xl mx-auto">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
                    <Building2 className="w-8 h-8 text-blue-600" />
                    Warehouse Profile
                </h1>
                <p className="text-slate-500 mt-2">Set your storage location, pricing, and capacity</p>
            </header>

            <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleSave}
                className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 space-y-6"
            >
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Warehouse Name</label>
                    <input value={form.name} onChange={set("name")} required
                        className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="e.g. Suresh Cold Storage" />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Storage Type</label>
                    <select value={form.type} onChange={set("type")}
                        className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                        <option value="cold_storage">❄️ Cold Storage</option>
                        <option value="standard">🏭 Standard / Dry</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-blue-500" />
                        Location (GPS Coordinates)
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs text-slate-500 mb-1 block">Latitude</label>
                            <input type="number" step="0.0001" value={form.lat} onChange={set("lat")} required
                                className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="17.3850" />
                        </div>
                        <div>
                            <label className="text-xs text-slate-500 mb-1 block">Longitude</label>
                            <input type="number" step="0.0001" value={form.lng} onChange={set("lng")} required
                                className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="78.4867" />
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => {
                            if ("geolocation" in navigator) {
                                navigator.geolocation.getCurrentPosition(pos => {
                                    setForm(prev => ({ ...prev, lat: pos.coords.latitude.toFixed(6), lng: pos.coords.longitude.toFixed(6) }));
                                    toast.success("Location captured!");
                                }, () => toast.error("GPS unavailable, using Hyderabad default"));
                            }
                        }}
                        className="mt-2 text-sm text-blue-600 hover:text-blue-800 font-medium underline"
                    >
                        📍 Use my current GPS location
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Price per Ton/Day (₹)</label>
                        <input type="number" min="1" value={form.price} onChange={set("price")} required
                            className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="50" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Total Capacity (Tons)</label>
                        <input type="number" min="1" value={form.capacity} onChange={set("capacity")} required
                            className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="500" />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Contact Number</label>
                    <input type="tel" maxLength={10} value={form.contact} onChange={set("contact")} required
                        className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                        placeholder="9848012345" />
                </div>

                <div className="pt-4 border-t border-slate-100">
                    <button
                        type="submit"
                        disabled={saving || saved}
                        className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold rounded-2xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2"
                    >
                        {saved ? (
                            <><CheckCircle className="w-5 h-5" /> Saved! Redirecting...</>
                        ) : saving ? (
                            <><Loader2 className="w-5 h-5 animate-spin" /> Saving...</>
                        ) : (
                            <><Save className="w-5 h-5" /> Save Profile</>
                        )}
                    </button>
                </div>
            </motion.form>
        </div>
    );
}
