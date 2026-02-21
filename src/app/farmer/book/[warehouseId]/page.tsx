"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { Loader2, CheckCircle2, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { toast } from "sonner";

export default function BookWarehouse() {
    const { warehouseId } = useParams();
    const router = useRouter();
    const [warehouse, setWarehouse] = useState<any>(null);
    const [cropType, setCropType] = useState("");
    const [tons, setTons] = useState(1);
    const [duration, setDuration] = useState(30);
    const [step, setStep] = useState(1); // 1: Form, 2: Payment Loading, 3: Success

    useEffect(() => {
        fetchWarehouse();
    }, [warehouseId]);

    const fetchWarehouse = async () => {
        try {
            const res = await axios.get("/api/warehouses");
            const w = res.data.find((x: any) => x.id === warehouseId);
            setWarehouse(w);
        } catch (e) {
            console.error(e);
        }
    };

    const handleBookingAndPayment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!cropType || tons <= 0 || duration <= 0) return;

        setStep(2); // Show payment loader

        try {
            const userId = localStorage.getItem("userId") || "1";
            // 1. Create Booking
            const bookRes = await axios.post("/api/bookings", {
                farmer_id: userId,
                warehouse_id: warehouseId,
                crop_type: cropType,
                tons: Number(tons),
                duration_days: Number(duration) // Ensure this is sent
            });
            const newBooking = bookRes.data;

            // 2. Process Mock Payment
            await axios.post("/api/mock-payment", { bookingId: newBooking.id });

            setStep(3); // Success
            toast.success("Payment Successful & Slot Booked!");

            // Navigate to receipts after 2 seconds
            setTimeout(() => {
                router.push("/farmer/receipts");
            }, 2000);

        } catch (e) {
            toast.error("Booking or Payment failed");
            setStep(1);
        }
    };

    if (!warehouse) return <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-emerald-600" /></div>;

    const totalCost = (warehouse.price_per_ton_day * tons * duration).toFixed(2);

    return (
        <div className="p-6 md:p-10 max-w-2xl mx-auto">
            <Link href="/farmer/dashboard" className="inline-flex items-center text-slate-500 hover:text-emerald-600 mb-6 font-medium">
                <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
            </Link>

            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 relative">
                <div className="bg-emerald-600 p-6 text-white">
                    <h2 className="text-2xl font-bold">Book Storage Slot</h2>
                    <p className="opacity-90">{warehouse.name}</p>
                </div>

                {step === 1 && (
                    <form onSubmit={handleBookingAndPayment} className="p-6 space-y-6">
                        <div className="grid grid-cols-2 gap-4 text-sm text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <div>
                                <p>Available Space</p>
                                <p className="font-bold text-slate-800 text-lg">{warehouse.available_capacity_tons} Tons</p>
                            </div>
                            <div>
                                <p>Rate</p>
                                <p className="font-bold text-slate-800 text-lg">₹{warehouse.price_per_ton_day} / Ton / Day</p>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Crop Type</label>
                            <input required type="text" value={cropType} onChange={e => setCropType(e.target.value)} className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="e.g. Potatoes, Wheat" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Quantity (Tons)</label>
                                <input required type="number" min="1" max={warehouse.available_capacity_tons} value={tons} onChange={e => setTons(Number(e.target.value))} className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Duration (Days)</label>
                                <input required type="number" min="1" value={duration} onChange={e => setDuration(Number(e.target.value))} className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none" />
                            </div>
                        </div>

                        <div className="border-t border-slate-100 pt-6 flex items-center justify-between">
                            <div>
                                <p className="text-slate-500 text-sm">Total Amount</p>
                                <p className="text-3xl font-bold text-emerald-600">₹{totalCost}</p>
                            </div>
                            <button type="submit" className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-lg shadow-emerald-200 transition-all active:scale-95">
                                Pay Securely
                            </button>
                        </div>
                    </form>
                )}

                {step === 2 && (
                    <div className="p-16 flex flex-col items-center justify-center text-center">
                        <Loader2 className="w-16 h-16 animate-spin text-emerald-600 mb-4" />
                        <h3 className="text-xl font-bold text-slate-800">Processing Payment...</h3>
                        <p className="text-slate-500 mt-2">Please do not close or refresh this window.</p>
                    </div>
                )}

                {step === 3 && (
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="p-16 flex flex-col items-center justify-center text-center">
                        <CheckCircle2 className="w-20 h-20 text-emerald-500 mb-4" />
                        <h3 className="text-2xl font-bold text-slate-800">Payment Successful!</h3>
                        <p className="text-slate-500 mt-2 max-w-xs">Your slot has been reserved. Redirecting to your receipts...</p>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
