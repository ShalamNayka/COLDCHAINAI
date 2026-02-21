"use client";

import { useState, useEffect } from "react";
import { MapPin, Navigation, Truck, Loader2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

export default function VehicleDashboard() {
    const [isTracking, setIsTracking] = useState(false);
    const [location, setLocation] = useState({ lat: 17.39, lng: 78.48 });
    const [isUpdating, setIsUpdating] = useState(false);
    const [vehicle, setVehicle] = useState({ type: "tractor", number: "TS09AB1234" });
    const [bookings, setBookings] = useState<any[]>([]);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const userId = localStorage.getItem("userId") || "3";
            const res = await axios.get(`/api/bookings?userId=${userId}&role=vehicle_provider`);
            setBookings(res.data);
        } catch (e) {
            console.error(e);
        }
    };

    const toggleTracking = () => {
        if (!isTracking) {
            if ("geolocation" in navigator) {
                setIsUpdating(true);
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        setLocation({
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        });
                        setIsTracking(true);
                        setIsUpdating(false);
                        toast.success("Location tracking active. Farmers can now see you.");
                    },
                    (error) => {
                        setIsTracking(true); // default to static mock for demo
                        setIsUpdating(false);
                        toast.warning("Using mock location for demo since GPS access is restricted.");
                    }
                );
            } else {
                setIsTracking(true); // default to mock
            }
        } else {
            setIsTracking(false);
            toast.info("Tracking disabled. You are now offline.");
        }
    };

    return (
        <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-8">
            <header>
                <h1 className="text-3xl font-bold text-slate-800">Vehicle Tracking</h1>
                <p className="text-slate-500 mt-2">Update your live location so farmers can hire you</p>
            </header>

            <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <div className="p-4 bg-orange-100 text-orange-600 rounded-2xl">
                                <Truck className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-800 uppercase">{vehicle.number}</h3>
                                <p className="text-slate-500 capitalize">{vehicle.type}</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <span className="text-slate-500 font-medium tracking-wide text-sm uppercase">Status</span>
                            {isTracking ? (
                                <span className="flex items-center text-emerald-600 font-bold">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse" /> Online
                                </span>
                            ) : (
                                <span className="flex items-center text-slate-400 font-bold">
                                    <span className="w-2 h-2 rounded-full bg-slate-300 mr-2" /> Offline
                                </span>
                            )}
                        </div>

                        <button
                            onClick={toggleTracking}
                            disabled={isUpdating}
                            className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all flex items-center justify-center gap-2 ${isTracking
                                ? "bg-red-50 text-red-600 hover:bg-red-100 shadow-red-100"
                                : "bg-orange-500 text-white hover:bg-orange-600 shadow-orange-200"
                                }`}
                        >
                            {isUpdating ? <Loader2 className="w-5 h-5 animate-spin" /> : isTracking ? "Stop Broadcasting" : "Go Online & Broadcast"}
                            {!isUpdating && <Navigation className={`w-5 h-5 ${isTracking ? '' : 'animate-bounce'}`} />}
                        </button>
                    </div>
                </div>

                <div className="bg-slate-100 rounded-3xl p-6 border border-slate-200 relative overflow-hidden min-h-[300px] flex items-center justify-center">
                    {/* Faux Map Background */}
                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />

                    <div className="relative z-10 text-center">
                        {isTracking ? (
                            <div className="flex flex-col items-center">
                                <div className="w-16 h-16 bg-white rounded-full shadow-xl mb-4 flex items-center justify-center border-4 border-orange-500 animate-pulse text-orange-500">
                                    <MapPin className="w-6 h-6" />
                                </div>
                                <p className="text-slate-800 font-bold font-mono bg-white/80 px-4 py-2 rounded-lg">
                                    {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                                </p>
                                <p className="text-slate-500 text-sm mt-2">Real-time Location Updating...</p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center opacity-50">
                                <MapPin className="w-12 h-12 text-slate-400 mb-2" />
                                <p className="text-slate-500 font-medium">Map Offline</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="mt-12">
                <h2 className="text-2xl font-bold text-slate-800 mb-6">Active Trip Requests</h2>
                <div className="grid md:grid-cols-2 gap-6">
                    {bookings.map((b) => (
                        <div key={b.id} className="bg-white rounded-2xl border border-blue-200 shadow-sm p-6 relative overflow-hidden flex flex-col">
                            <div className="absolute top-0 right-0 w-2 h-full bg-blue-500" />
                            <div className="mb-4">
                                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full uppercase tracking-wider">
                                    New Booking
                                </span>
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 capitalize mb-1">{b.crop_type} Transport</h3>
                            <p className="text-slate-500 mb-6">{b.tons} Tons • {b.distance_km} KM Distance</p>
                            <div className="mt-auto flex flex-col gap-2">
                                <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-blue-200">
                                    Accept & Start Trip
                                </button>
                                <a href="tel:9999999999" className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-center transition-colors">
                                    Call Farmer
                                </a>
                            </div>
                        </div>
                    ))}
                    {bookings.length === 0 && (
                        <div className="col-span-2 text-center py-12 bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
                            <p className="text-slate-500 font-medium text-lg mb-1">No active ride requests right now.</p>
                            <p className="text-sm text-slate-400">Make sure you are online to receive bookings.</p>
                        </div>
                    )}
                </div>
            </div>
        </div >
    );
}
