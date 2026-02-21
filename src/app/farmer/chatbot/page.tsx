"use client";

import { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Send, ArrowLeft, Bot, User, Loader2, Globe } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { toast } from "sonner";

interface Message {
    id: string;
    sender: "ai" | "user";
    text: string;
}

const ALL_LANGUAGES = [
    { code: "en-IN", label: "English", native: "English" },
    { code: "hi-IN", label: "Hindi", native: "हिंदी" },
    { code: "te-IN", label: "Telugu", native: "తెలుగు" },
    { code: "ta-IN", label: "Tamil", native: "தமிழ்" },
    { code: "kn-IN", label: "Kannada", native: "ಕನ್ನಡ" },
    { code: "mr-IN", label: "Marathi", native: "मराठी" },
    { code: "bn-IN", label: "Bengali", native: "বাংলা" },
    { code: "gu-IN", label: "Gujarati", native: "ગુજરાતી" },
    { code: "pa-IN", label: "Punjabi", native: "ਪੰਜਾਬੀ" },
    { code: "ml-IN", label: "Malayalam", native: "മലയാളം" },
    { code: "or-IN", label: "Odia", native: "ଓଡ଼ିଆ" },
];

const GREETINGS: Record<string, string> = {
    "en-IN": "Hello! How can I help you today?",
    "hi-IN": "नमस्ते! मैं आपकी कैसे मदद कर सकता हूँ?",
    "te-IN": "నమస్కారం! నేను మీకు ఎలా సహాయం చేయగలను?",
    "ta-IN": "வணக்கம்! நான் உங்களுக்கு எப்படி உதவலாம்?",
    "kn-IN": "ನಮಸ್ಕಾರ! ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?",
    "mr-IN": "नमस्ते! मी आपली कशी मदत करू शकतो?",
    "bn-IN": "নমস্কার! আমি কীভাবে আপনাকে সাহায্য করতে পারি?",
    "gu-IN": "નમસ્તે! હું તમારી કેવી રીતે મદદ કરી શકું?",
    "pa-IN": "ਸਤ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਤੁਹਾਡੀ ਕਿਵੇਂ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ?",
    "ml-IN": "നമസ്കാരം! ഞാൻ നിങ്ങളെ എങ്ങനെ സഹായിക്കാം?",
    "or-IN": "ନମସ୍କାର! ମୁଁ ଆପଣଙ୍କୁ କିପରି ସାହାଯ୍ୟ କରିପାରିବି?",
};

const LANG_CHANGED_MSG: Record<string, string> = {
    "en-IN": "Language switched to English.",
    "hi-IN": "भाषा हिंदी में बदल दी गई है।",
    "te-IN": "భాష తెలుగుకు మార్చబడింది.",
    "ta-IN": "மொழி தமிழுக்கு மாற்றப்பட்டது.",
    "kn-IN": "ಭಾಷೆ ಕನ್ನಡಕ್ಕೆ ಬದಲಾಯಿಸಲಾಗಿದೆ.",
    "mr-IN": "भाषा मराठीत बदलली आहे.",
    "bn-IN": "ভাষা বাংলায় পরিবর্তিত হয়েছে।",
    "gu-IN": "ભાષા ગુજરાતીમાં બદલાઈ ગઈ છે.",
    "pa-IN": "ਭਾਸ਼ਾ ਪੰਜਾਬੀ ਵਿੱਚ ਬਦਲ ਦਿੱਤੀ ਗਈ ਹੈ।",
    "ml-IN": "ഭാഷ മലയാളത്തിലേക്ക് മാറ്റി.",
    "or-IN": "ଭାଷା ଓଡ଼ିଆକୁ ବଦଳாଇ ଦିଆ ଗଲା।",
};

export default function ChatbotPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [language, setLanguage] = useState<string | null>(null);
    const [isListening, setIsListening] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [textInput, setTextInput] = useState("");
    const [sessionState, setSessionState] = useState<any>({
        step: "init", selectedWarehouse: null, cropType: null, tons: null, duration: null
    });
    const router = useRouter();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isProcessing]);

    const switchLanguage = (lang: string) => {
        setLanguage(lang);
        const msg = LANG_CHANGED_MSG[lang] || "Language changed.";
        const greet = GREETINGS[lang] || GREETINGS["en-IN"];
        const aiMsg: Message = { id: Date.now().toString(), sender: "ai", text: `${msg} ${greet}` };
        setMessages(prev => [...prev, aiMsg]);
        speakText(`${msg} ${greet}`, lang);
    };

    const handleLanguageSelect = (lang: string) => {
        setLanguage(lang);
        const greeting = GREETINGS[lang] || GREETINGS["en-IN"];
        setMessages([{ id: Date.now().toString(), sender: "ai", text: greeting }]);
        speakText(greeting, lang);
    };

    const speakText = (text: string, lang: string, onEnd?: () => void) => {
        if (!('speechSynthesis' in window)) { onEnd?.(); return; }
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;
        const voices = window.speechSynthesis.getVoices();
        const localVoice = voices.find(v => v.lang.startsWith(lang.split('-')[0]));
        if (localVoice) utterance.voice = localVoice;
        utterance.onend = () => onEnd?.();
        utterance.onerror = () => setTimeout(() => onEnd?.(), 1500);
        window.speechSynthesis.speak(utterance);
    };

    const getLocation = () => new Promise<{ lat: number; lng: number } | null>((resolve) => {
        if (!navigator.geolocation) return resolve(null);
        navigator.geolocation.getCurrentPosition(
            pos => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
            () => resolve(null),
            { timeout: 5000 }
        );
    });

    const handleProcessVoice = async (text: string) => {
        if (!text.trim() || !language) return;
        setMessages(prev => [...prev, { id: Date.now().toString(), sender: "user", text }]);
        setIsProcessing(true);

        try {
            const role = localStorage.getItem("userRole") || "farmer";
            const location = await getLocation();

            const res = await fetch("/api/voice", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: text, role, location, language, state: sessionState }),
            });
            const data = await res.json();

            // Persist session state
            if (data.updated_state) setSessionState(data.updated_state);

            // Handle language switch
            if (data.intent === "change_language" && data.language) {
                switchLanguage(data.language);
                return;
            }

            // Auto-upgrade language if AI detected a different one
            if (data.language && data.language !== language) {
                setLanguage(data.language);
            }

            const routePath = role === "warehouse_owner" ? "/owner/dashboard" : role === "vehicle_provider" ? "/vehicle/dashboard" : "/farmer/dashboard";

            const handleRouting = () => {
                if (data.action && data.action !== "none") {
                    if (data.action === "navigate_storage") router.push(`${routePath}?tab=warehouses`);
                    else if (data.action === "navigate_vehicle") router.push(`${routePath}?tab=vehicles`);
                    else if ((data.action === "book_storage" || data.action === "redirect_payment") && data.itemId) router.push(`/farmer/book/${data.itemId}`);
                    else if (data.action === "book_vehicle" && data.itemId) router.push(`/farmer/book-vehicle/${data.itemId}`);
                }
            };

            if (data.reply) {
                setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), sender: "ai", text: data.reply }]);
                speakText(data.reply, data.language || language, handleRouting);
            } else {
                handleRouting();
            }
        } catch {
            toast.error("Failed to process query.");
            setMessages(prev => [...prev, { id: Date.now().toString(), sender: "ai", text: "Sorry, I am having trouble connecting." }]);
        } finally {
            setIsProcessing(false);
        }
    };

    const toggleListening = () => {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            toast.error("Voice recognition not supported in this browser.");
            return;
        }
        if (isListening) { setIsListening(false); return; }

        // @ts-ignore
        const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SR();
        recognition.lang = language || "en-IN";
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;
        recognition.onstart = () => { setIsListening(true); toast.success("Listening..."); };
        recognition.onresult = (event: any) => { setIsListening(false); handleProcessVoice(event.results[0][0].transcript); };
        recognition.onerror = () => { setIsListening(false); toast.error("Voice recognition error."); };
        recognition.onend = () => setIsListening(false);
        recognition.start();
    };

    const handleTextSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const prompt = textInput.trim();
        setTextInput("");
        handleProcessVoice(prompt);
    };

    const currentLangLabel = ALL_LANGUAGES.find(l => l.code === language);

    return (
        <div className="flex flex-col h-[calc(100vh-80px)] max-w-3xl mx-auto bg-slate-50/50">
            <header className="p-4 bg-white border-b border-slate-200 flex items-center justify-between sticky top-0 z-10 shadow-sm">
                <div className="flex items-center gap-3">
                    <Link href="/farmer/dashboard" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <ArrowLeft className="w-5 h-5 text-slate-600" />
                    </Link>
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                            <Bot className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="font-bold text-slate-800">Krishi Assistant</h1>
                            <p className="text-xs text-emerald-600 font-medium">Online · AI Powered</p>
                        </div>
                    </div>
                </div>
                {language && (
                    <button
                        onClick={() => setLanguage(null)}
                        className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-emerald-700 border border-slate-200 rounded-full px-3 py-1.5 hover:border-emerald-400 transition-all"
                    >
                        <Globe className="w-3.5 h-3.5" />
                        {currentLangLabel?.native || "Language"}
                    </button>
                )}
            </header>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {!language ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 text-center max-w-md mx-auto mt-6"
                    >
                        <Bot className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-slate-800 mb-1">Krishi Assistant</h2>
                        <p className="text-slate-500 mb-6 text-sm">Select your language to start</p>
                        <div className="grid grid-cols-2 gap-2">
                            {ALL_LANGUAGES.map(lang => (
                                <button
                                    key={lang.code}
                                    onClick={() => handleLanguageSelect(lang.code)}
                                    className="py-2.5 px-4 rounded-xl border-2 border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 font-medium text-slate-700 transition-all text-sm flex flex-col items-center gap-0.5"
                                >
                                    <span className="text-base">{lang.native}</span>
                                    <span className="text-xs text-slate-400">{lang.label}</span>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                ) : (
                    <>
                        <AnimatePresence>
                            {messages.map(msg => (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    <div className={`flex gap-3 max-w-[85%] ${msg.sender === "user" ? "flex-row-reverse" : ""}`}>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.sender === "user" ? "bg-slate-200 text-slate-600" : "bg-emerald-100 text-emerald-600"}`}>
                                            {msg.sender === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                                        </div>
                                        <div className={`p-4 rounded-2xl ${msg.sender === "user" ? "bg-emerald-600 text-white rounded-tr-none" : "bg-white border border-slate-200 text-slate-800 shadow-sm rounded-tl-none"}`}>
                                            <p className="text-[15px] leading-relaxed">{msg.text}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        {isProcessing && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 text-emerald-600">
                                        <Bot className="w-4 h-4" />
                                    </div>
                                    <div className="p-4 rounded-2xl bg-white border border-slate-200 text-slate-800 shadow-sm rounded-tl-none flex items-center gap-2">
                                        <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                                        <span className="text-slate-500 text-sm">Thinking...</span>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                        <div ref={messagesEndRef} />
                    </>
                )}
            </div>

            {language && (
                <div className="p-4 bg-white border-t border-slate-200">
                    <form onSubmit={handleTextSubmit} className="flex items-center gap-2 max-w-3xl mx-auto relative">
                        <button
                            type="button"
                            onClick={toggleListening}
                            disabled={isProcessing}
                            className={`p-3 rounded-full shrink-0 transition-all ${isListening ? "bg-red-50 text-red-600 animate-pulse ring-2 ring-red-300" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                        >
                            {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                        </button>
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                value={textInput}
                                onChange={e => setTextInput(e.target.value)}
                                placeholder={isListening ? "Listening..." : "Type or speak a message..."}
                                disabled={isProcessing}
                                className="w-full pl-4 pr-12 py-3 bg-slate-100 rounded-full outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all text-slate-700 text-sm"
                            />
                            <button
                                type="submit"
                                disabled={isProcessing || !textInput.trim()}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-emerald-600 text-white rounded-full disabled:opacity-40 hover:bg-emerald-700 transition-colors"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </form>
                    <p className="text-center text-xs text-slate-400 mt-2 flex items-center justify-center gap-1">
                        <Bot className="w-3 h-3" /> Powered by Gemini AI · Krishi Assistant
                    </p>
                </div>
            )}
        </div>
    );
}
