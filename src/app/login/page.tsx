"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Loader2, Phone } from "lucide-react";
import axios from "axios";

export default function Login() {
  const router = useRouter();
  const [role, setRole] = useState("farmer");
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedRole = localStorage.getItem("userRole");
    if (savedRole) setRole(savedRole);
  }, []);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 10) {
      toast.error("Enter a valid 10-digit phone number");
      return;
    }
    setLoading(true);
    try {
      await axios.post("/api/auth/send-otp", { phone });
      toast.success("OTP sent successfully (Use 1234)");
      setStep(2);
    } catch (err) {
      toast.error("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 4) return;
    setLoading(true);
    try {
      const res = await axios.post("/api/auth/verify-otp", { phone, otp, role });
      const user = res.data.user;
      localStorage.setItem("userId", user.id);
      localStorage.setItem("userRole", user.role);
      toast.success("Login Successful");

      let routePath = `/${user.role}/dashboard`;
      if (user.role === "warehouse_owner") routePath = "/owner/dashboard";
      if (user.role === "vehicle_provider") routePath = "/vehicle/dashboard";

      router.push(routePath);
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-slate-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-96 bg-emerald-600 rounded-b-[4rem] md:rounded-b-[8rem] shadow-xl" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 relative z-10"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Welcome Back</h1>
          <p className="text-slate-500 mt-2 capitalize">{role.replace('_', ' ')} Portal</p>
        </div>

        {step === 1 ? (
          <form onSubmit={handleSendOTP} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Phone className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  maxLength={10}
                  className="block w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-lg"
                  placeholder="Enter your phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\\D/g, ''))}
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-semibold text-lg transition-all active:scale-[0.98] flex items-center justify-center shadow-lg shadow-emerald-200"
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Send OTP"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Enter OTP</label>
              <input
                type="text"
                maxLength={4}
                className="block w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-center text-3xl font-bold tracking-widest text-slate-800"
                placeholder="• • • •"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\\D/g, ''))}
              />
              <p className="text-center text-sm text-slate-500 mt-4">Hint: Use 1234 for demo</p>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-semibold text-lg transition-all active:scale-[0.98] flex items-center justify-center shadow-lg shadow-emerald-200"
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Verify & Login"}
            </button>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full block text-center text-emerald-600 hover:text-emerald-700 font-medium"
            >
              Change Phone Number
            </button>
          </form>
        )}
      </motion.div>
    </main>
  );
}
