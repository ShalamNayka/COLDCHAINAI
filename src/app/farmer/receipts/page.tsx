"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Loader2, QrCode, Clock, MapPin, CheckCircle } from "lucide-react";

export default function FarmerReceipts() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const userId = localStorage.getItem("userId") || "1";
      const res = await axios.get(`/api/bookings?userId=${userId}&role=farmer`);
      // sort latest first
      const sorted = res.data.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      setBookings(sorted);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex h-full items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-emerald-600" /></div>;
  }

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-slate-800">My Receipts & Bookings</h1>
        <p className="text-slate-500 mt-2">Manage your active and past storage bookings</p>
      </header>

      <div className="grid md:grid-cols-2 gap-6">
        {bookings.map((b) => (
          <div key={b.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
            <div className={`p-4 text-white flex justify-between items-center ${b.status === 'goods_received' ? 'bg-emerald-600' : 'bg-slate-800'}`}>
              <span className="font-semibold">{b.status === 'goods_received' ? 'Verified Storage Receipt' : 'Pending Drop-off'}</span>
              {b.status === 'goods_received' ? <CheckCircle className="w-5 h-5" /> : <Clock className="w-5 h-5 text-slate-300" />}
            </div>

            <div className="p-6 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-xl text-slate-800 capitalize">{b.crop_type}</h3>
                  <p className="text-slate-500 text-sm">{b.tons} Tons • {b.duration_days} Days</p>
                </div>
              </div>

              <p className="text-xs text-slate-400 mb-4">Txn ID: {b.transaction_id || "N/A"}</p>

              {b.qr_code_data_url ? (
                <div className="mt-auto pt-6 border-t border-slate-100 flex flex-col items-center justify-center space-y-3">
                  <p className="text-xs font-semibold text-slate-400 tracking-wider uppercase">Official QR Receipt</p>
                  <img src={b.qr_code_data_url} alt="QR Code" className="w-32 h-32 rounded-xl border-4 border-slate-100 shadow-sm" />
                  <p className="text-xs text-center text-slate-500 px-4">Can be used as proof of storage for agricultural bank loans.</p>
                </div>
              ) : (
                <div className="mt-auto pt-6 border-t border-slate-100 flex items-center justify-center space-x-2 text-amber-600 bg-amber-50 p-4 rounded-xl">
                  <QrCode className="w-5 h-5 opacity-50" />
                  <span className="text-sm font-medium">QR pending payment processing.</span>
                </div>
              )}
            </div>
          </div>
        ))}
        {bookings.length === 0 && <p className="text-slate-500 col-span-2 text-center py-10">No bookings yet.</p>}
      </div>
    </div>
  );
}
