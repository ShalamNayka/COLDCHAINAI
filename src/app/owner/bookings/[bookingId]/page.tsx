"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { Loader2, ArrowLeft, QrCode } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function OwnerBookingDetail() {
    const { bookingId } = useParams();
    const router = useRouter();
    const [booking, setBooking] = useState<any>(null);
    const [farmer, setFarmer] = useState<any>(null);
    const [aadhar, setAadhar] = useState("");
    const [extendDays, setExtendDays] = useState(0);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        fetchMeta();
    }, [bookingId]);

    const fetchMeta = async () => {
        try {
            const res = await axios.get(`/api/bookings?userId=${localStorage.getItem("userId") || "2"}&role=warehouse_owner`);
      const b = res.data.find((x: any) => x.id === bookingId);
      setBooking(b);
      // Hack: in a real app, we'd fetch farmer details from a generic users endpoint
      // We'll mock the aadhar fetch flow here directly
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateQR = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aadhar || aadhar.length < 12) {
      toast.error("Enter a valid 12-digit Aadhar number");
      return;
    }
    setProcessing(true);
    try {
      const res = await axios.post(`/api/bookings/${bookingId}/generate-qr`, { aadhar_number: aadhar });
      setBooking(res.data);
      toast.success("Goods verified and QR receipt generated.");
    } catch (e) {
      toast.error("Failed to generate QR");
    } finally {
      setProcessing(false);
    }
  };

  const handleExtend = async () => {
    if (extendDays <= 0) return;
    setProcessing(true);
    try {
      const res = await axios.put(`/api/bookings/${bookingId}/extend`, { extend_days: extendDays });
      setBooking(res.data);
      setExtendDays(0);
      toast.success("Storage duration extended.");
    } catch (e) {
      toast.error("Failed to extend duration");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-blue-600" /></div>;
  if (!booking) return <div className="p-10 text-center text-slate-500">Booking not found.</div>;

  return (
    <div className="p-6 md:p-10 max-w-3xl mx-auto space-y-8">
      <Link href="/owner/dashboard" className="inline-flex items-center text-slate-500 hover:text-blue-600 mb-2 font-medium">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
      </Link>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className={`p-6 text-white flex justify-between items-center ${booking.status === 'goods_received' ? 'bg-blue-600' : 'bg-amber-500'}`}>
          <div>
            <h2 className="text-2xl font-bold">Booking #{booking.id.slice(-6)}</h2>
            <p className="opacity-90">{booking.status === 'goods_received' ? "Active Storage" : "Pending Drop-off"}</p>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-90">Capacity Reserved</p>
            <p className="text-2xl font-bold">{booking.tons} Tons</p>
          </div>
        </div>

        <div className="p-8 space-y-8">
          {booking.status === "payment_successful" && (
            <motion.form 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              onSubmit={handleGenerateQR} 
              className="bg-amber-50 rounded-2xl p-6 border border-amber-100"
            >
              <h3 className="text-lg font-bold text-amber-900 mb-2 flex items-center gap-2">
                <QrCode className="w-5 h-5" /> Receive Goods & Generate Legal Receipt
              </h3>
              <p className="text-amber-700 text-sm mb-6">Verify the goods drop-off and farmer's identity. This will generate the official QR encoded receipt used for bank loans.</p>
              
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-amber-900 mb-2">Farmer Aadhar Card Number</label>
                  <input 
                    required type="text" maxLength={12} 
                    className="w-full p-3 rounded-xl border border-amber-200 focus:ring-2 focus:ring-amber-500 outline-none bg-white font-mono tracking-widest" 
                    placeholder="XXXX XXXX XXXX" 
                    value={aadhar} onChange={e => setAadhar(e.target.value.replace(/\\D/g, ''))} 
                  />
                </div>
                <button disabled={processing} type="submit" className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl whitespace-nowrap transition-colors">
                  {processing ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify & Generate QR"}
                </button>
              </div>
            </motion.form>
          )}

          {booking.status === "goods_received" && (
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-1 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <h3 className="font-bold text-slate-800 mb-4">Storage Details</h3>
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between border-b border-slate-100 pb-2">
                    <span className="text-slate-500">Crop Type</span>
                    <span className="font-medium text-slate-800 capitalize">{booking.crop_type}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-2">
                    <span className="text-slate-500">Quantity</span>
                    <span className="font-medium text-slate-800">{booking.tons} Tons</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-2">
                    <span className="text-slate-500">Total Duration</span>
                    <span className="font-medium text-slate-800">{booking.duration_days} Days</span>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-200">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Extend Storage Duration</h4>
                  <div className="flex gap-3">
                    <input 
                      type="number" min="1" 
                      className="w-24 p-2 rounded-lg border border-slate-200" 
                      placeholder="Days" 
                      value={extendDays || ''} onChange={e => setExtendDays(Number(e.target.value))} 
                    />
                    <button onClick={handleExtend} disabled={processing || extendDays <= 0} className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-sm font-medium rounded-lg">
                       {processing ? "..." : "Extend"}
                    </button>
                  </div>
                </div>
              </div>

              {booking.qr_code_data_url && (
                <div className="w-full md:w-64 bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col items-center text-center">
                  <p className="text-xs font-bold text-slate-500 mb-4 uppercase">Generated Receipt</p>
                  <img src={booking.qr_code_data_url} alt="QR" className="w-40 h-40 rounded-xl bg-white p-2 border border-slate-200 shadow-sm" />
                  <p className="text-xs text-slate-400 mt-4 leading-relaxed">This QR encodes the Farmer Aadhar, Crop, and Duration legally.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
