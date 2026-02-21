"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Warehouse, MapPin, Truck, PhoneCall, Loader2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function FarmerDashboard() {
    const [warehouses, setWarehouses] = useState<any[]>([]);
    const [vehicles, setVehicles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("warehouses"); // warehouses or vehicles

    useEffect(() => {
        if (typeof window !== "undefined") {
            const params = new URLSearchParams(window.location.search);
            if (params.get("tab") === "vehicles") {
                setActiveTab("vehicles");
            }
        }
        fetchData();
    }, []);

    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        const p = 0.017453292519943295;
        const c = Math.cos;
        const a = 0.5 - c((lat2 - lat1) * p) / 2 + c(lat1 * p) * c(lat2 * p) * (1 - c((lon2 - lon1) * p)) / 2;
        return 12742 * Math.asin(Math.sqrt(a));
    };

    const fetchData = async () => {
        try {
            const [wRes, vRes] = await Promise.all([
                axios.get("/api/warehouses"),
                axios.get("/api/vehicles")
            ]);

            let wData = wRes.data;
            let vData = vRes.data;

            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(
                    (pos) => {
                        const { latitude, longitude } = pos.coords;
                        wData = wData.map((w: any) => ({ ...w, distance: calculateDistance(latitude, longitude, w.latitude, w.longitude) })).sort((a: any, b: any) => a.distance - b.distance);
                        vData = vData.map((v: any) => ({ ...v, distance: calculateDistance(latitude, longitude, v.latitude, v.longitude) })).sort((a: any, b: any) => a.distance - b.distance);
                        setWarehouses(wData);
                        setVehicles(vData);
                        setLoading(false);
                    },
                    (err) => {
                        setWarehouses(wData);
                        setVehicles(vData);
                        setLoading(false);
                    },
                    { timeout: 5000 }
                );
            } else {
                setWarehouses(wData);
                setVehicles(vData);
                setLoading(false);
            }
        } catch (e) {
            console.error(e);
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
            </div>
        );
    }

    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Discover Nearby Services</h1>
                    <p className="text-slate-500 mt-2">Find cold storage or book a transport vehicle</p>
                </div>
                <div className="flex bg-slate-100 p-1 rounded-xl">
                    <button
                        onClick={() => setActiveTab("warehouses")}
                        className={`px-6 py-2 rounded-lg font-medium transition-all ${activeTab === "warehouses" ? "bg-white text-emerald-700 shadow-sm" : "text-slate-600 hover:text-slate-900"}`}
                    >
                        Storages
                    </button>
                    <button
                        onClick={() => setActiveTab("vehicles")}
                        className={`px-6 py-2 rounded-lg font-medium transition-all ${activeTab === "vehicles" ? "bg-white text-emerald-700 shadow-sm" : "text-slate-600 hover:text-slate-900"}`}
                    >
                        Vehicles
                    </button>
                </div>
            </header >

            {activeTab === "warehouses" && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {warehouses.map((w, i) => (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            key={w.id}
                            className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-xl transition-all group relative overflow-hidden flex flex-col"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-5 bg-emerald-600 rounded-bl-full w-24 h-24 pointer-events-none" />

                            <div className="flex items-start justify-between mb-4">
                                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                                    <Warehouse className="w-6 h-6" />
                                </div>
                                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${w.type === 'cold_storage' ? "bg-blue-50 text-blue-600" : "bg-orange-50 text-orange-600"}`}>
                                    {w.type.replace('_', ' ').toUpperCase()}
                                </span>
                            </div>

                            <h3 className="text-xl font-bold text-slate-800 mb-1">{w.name}</h3>
                            <p className="flex items-center text-slate-500 text-sm mb-4">
                                <MapPin className="w-4 h-4 mr-1 text-emerald-500" />
                                {w.distance ? <span className="text-emerald-600 font-semibold mr-1">{w.distance.toFixed(1)} km away</span> : ""}
                                <span className="opacity-60 text-xs">(Lat: {w.latitude.toFixed(2)}, Lng: {w.longitude.toFixed(2)})</span>
                            </p>

                            <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100 mb-4">
                                <div>
                                    <p className="text-xs text-slate-500 font-medium">Available Space</p>
                                    <p className="text-lg font-bold text-slate-800">{w.available_capacity_tons} Tons</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-slate-500 font-medium">Price/Ton/Day</p>
                                    <p className="text-lg font-bold text-emerald-600">₹{w.price_per_ton_day}</p>
                                </div>
                            </div>

                            <Link
                                href={`/farmer/book/${w.id}`}
                                className="w-full py-3 bg-slate-50 text-emerald-700 font-medium rounded-xl text-center group-hover:bg-emerald-600 group-hover:text-white transition-all flex items-center justify-center gap-2"
                            >
                                Book Slot <ArrowRight className="w-4 h-4" />
                            </Link>
                        </motion.div >
                    ))
                    }
                    {warehouses.length === 0 && <p className="text-slate-500 col-span-3 text-center py-10">No storages available.</p>}
                </div >
            )}

            {
                activeTab === "vehicles" && (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {vehicles.map((v, i) => (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                key={v.id}
                                className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-xl transition-all relative overflow-hidden flex flex-col"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                                        <Truck className="w-6 h-6" />
                                    </div>
                                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-600 uppercase">
                                        {v.vehicle_type}
                                    </span>
                                </div>

                                <h3 className="text-xl font-bold text-slate-800 mb-1">{v.vehicle_number}</h3>
                                <p className="flex items-center text-slate-500 text-sm mb-6">
                                    <MapPin className="w-4 h-4 mr-1 text-blue-500" />
                                    {v.distance ? <span className="text-blue-600 font-semibold mr-1">{v.distance.toFixed(1)} km away</span> : ""}
                                    <span className="opacity-60 text-xs">(Lat: {v.latitude.toFixed(2)}, Lng: {v.longitude.toFixed(2)})</span>
                                </p>

                                <div className="mt-auto flex gap-2">
                                    <a
                                        href="tel:7777777777" // Mock phone
                                        className="flex-1 py-3 bg-slate-100 text-slate-700 font-medium rounded-xl text-center hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
                                    >
                                        <PhoneCall className="w-4 h-4" /> Call
                                    </a>
                                    <Link
                                        href={`/farmer/book-vehicle/${v.id}`}
                                        className="flex-1 py-3 bg-slate-900 text-white font-medium rounded-xl text-center hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-200"
                                    >
                                        Book <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                        {vehicles.length === 0 && <p className="text-slate-500 col-span-3 text-center py-10">No vehicles nearby.</p>}
                    </div>
                )
            }
        </div >
    );
}
