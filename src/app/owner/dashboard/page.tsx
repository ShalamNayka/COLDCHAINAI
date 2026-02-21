"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Loader2, ArrowRight, AlertTriangle, Bell } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

function getDaysRemaining(booking: any): number {
  if (!booking.created_at || !booking.duration_days) return 999;
  const end = new Date(booking.created_at);
  end.setDate(end.getDate() + booking.duration_days);
  const now = new Date();
  return Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export default function OwnerDashboard() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const userId = localStorage.getItem("userId") || "2"; // Mock owner ID is 2
      const bRes = await axios.get(`/api/bookings?userId=${userId}&role=warehouse_owner`);
      setBookings(bRes.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex h-full items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-blue-600" /></div>;

  const pending = bookings.filter(b => b.status === "payment_successful");
  const received = bookings.filter(b => b.status === "goods_received");

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-10">
      <header>
        <h1 className="text-3xl font-bold text-slate-800">Warehouse Dashboard</h1>
        <p className="text-slate-500 mt-2">Manage incoming goods and track capacity</p>
      </header>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <p className="text-sm font-medium text-slate-500 mb-1">Incoming Loads</p>
          <p className="text-3xl font-bold text-amber-600">{pending.length}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <p className="text-sm font-medium text-slate-500 mb-1">Stored Lots</p>
          <p className="text-3xl font-bold text-blue-600">{received.length}</p>
        </div>
        <div className="bg-linear-to-br from-blue-600 to-indigo-700 p-6 rounded-2xl shadow-lg text-white">
          <p className="text-sm font-medium text-blue-100 mb-1">Total Revenue Pending</p>
          <p className="text-3xl font-bold">
            ₹{pending.reduce((acc, curr) => acc + (curr.tons * curr.duration_days * 50), 0).toFixed(0)} {/* assuming 50/ton rate mock */}
          </p>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Action Required: Receivals</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {pending.map((b) => (
            <div key={b.id} className="bg-white rounded-2xl border border-amber-200 shadow-sm p-6 relative overflow-hidden flex flex-col">
              <div className="absolute top-0 right-0 w-2 h-full bg-amber-400" />
              <div className="mb-4">
                <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full uppercase tracking-wider">
                  Awaiting Drop-off
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-800 capitalize mb-1">{b.crop_type}</h3>
              <p className="text-slate-500 mb-6">{b.tons} Tons • {b.duration_days} Days Booked</p>

              <div className="mt-auto">
                <Link
                  href={`/owner/bookings/${b.id}`}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-amber-50 hover:bg-amber-100 text-amber-700 font-semibold rounded-xl transition-colors"
                >
                  Process Arrival & Generate QR <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
          {pending.length === 0 && <p className="text-slate-500">No pending receivals at the moment.</p>}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Active Storage Logs (Verified)</h2>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 text-sm border-b border-slate-200">
                <th className="p-4 font-semibold">Booking ID</th>
                <th className="p-4 font-semibold">Crop</th>
                <th className="p-4 font-semibold">Tons</th>
                <th className="p-4 font-semibold">Duration</th>
                <th className="p-4 font-semibold">Expiry</th>
                <th className="p-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {received.map(b => {
                const daysLeft = getDaysRemaining(b);
                const isExpiring = daysLeft <= 3 && daysLeft >= 0;
                return (
                  <tr key={b.id} className={`border-b border-slate-100 last:border-0 ${isExpiring ? 'bg-orange-50' : 'hover:bg-slate-50'}`}>
                    <td className="p-4 text-sm font-medium text-slate-800">#{b.id.slice(-6)}</td>
                    <td className="p-4 text-sm text-slate-600 capitalize">{b.crop_type}</td>
                    <td className="p-4 text-sm text-slate-600">{b.tons}</td>
                    <td className="p-4 text-sm text-slate-600">{b.duration_days} days</td>
                    <td className="p-4 text-sm">
                      {isExpiring ? (
                        <span className="flex items-center gap-1 text-orange-600 font-semibold">
                          <AlertTriangle className="w-4 h-4" />
                          {daysLeft <= 0 ? 'EXPIRED' : `${daysLeft}d left`}
                        </span>
                      ) : (
                        <span className="text-slate-400">{daysLeft}d left</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <Link href={`/owner/bookings/${b.id}`} className="text-blue-600 font-medium hover:underline text-sm">
                        Manage
                      </Link>
                    </td>
                  </tr>
                );
              })}
              {received.length === 0 && (
                <tr><td colSpan={6} className="p-8 text-center text-slate-500 text-sm">No active storage logs.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
