"use client";

import { Bot } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export function VoiceAssistantBot() {
    const [isVisible, setIsVisible] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        // Hide if we are already on the chatbot page
        if (pathname?.includes("/chatbot")) {
            setIsVisible(false);
        } else {
            setIsVisible(true);
        }
    }, [pathname]);

    return (
        <AnimatePresence>
            {isVisible && (
                <div className="fixed bottom-6 right-6 z-50">
                    <Link href="/farmer/chatbot">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white p-4 rounded-full shadow-2xl flex items-center justify-center gap-2 group cursor-pointer"
                        >
                            <Bot className="w-6 h-6 animate-pulse" />
                            <span className="font-bold hidden group-hover:block whitespace-nowrap overflow-hidden transition-all text-sm">
                                Ask AI
                            </span>
                        </motion.div>
                    </Link>
                </div>
            )}
        </AnimatePresence>
    );
}
