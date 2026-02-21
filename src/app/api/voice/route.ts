import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// All supported Indian language codes
const LANGUAGE_NAMES: Record<string, string> = {
    "hi-IN": "Hindi", "te-IN": "Telugu", "ta-IN": "Tamil", "kn-IN": "Kannada",
    "mr-IN": "Marathi", "bn-IN": "Bengali", "gu-IN": "Gujarati",
    "pa-IN": "Punjabi", "ml-IN": "Malayalam", "or-IN": "Odia", "en-IN": "English"
};

// Haversine distance helper
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const p = 0.017453292519943295;
    const c = Math.cos;
    const a = 0.5 - c((lat2 - lat1) * p) / 2 + c(lat1 * p) * c(lat2 * p) * (1 - c((lon2 - lon1) * p)) / 2;
    return 12742 * Math.asin(Math.sqrt(a));
};

// Keyword-based NLP fallback for all Indian languages
function offlineNLP(prompt: string, lang: string, topWarehouses: any[], topVehicles: any[]) {
    const p = prompt.toLowerCase();

    const vehicleKw = ["vehicle", "truck", "tractor", "transport", "lorry",
        "वाहन", "ट्रैक्टर", "गाड़ी", "వాహనం", "ట్రాక్టర్",
        "வண்டி", "ವಾಹನ", "গাড়ি", "ટ્રક", "ਟਰੱਕ", "വാഹനം", "ଗାଡ଼ି"];

    const bookKw = ["book", "need", "want", "चाहिए", "बुक", "కావాలి", "బుక్",
        "வேண்டும்", "ಬೇಕು", "হবে", "জোই", "ਚਾਹੀਦਾ", "വേണം", "ଦରକାର"];

    // Language switch detection
    const langMap: Record<string, string[]> = {
        "hi-IN": ["hindi", "हिंदी"], "te-IN": ["telugu", "తెలుగు"],
        "ta-IN": ["tamil", "தமிழ்"], "kn-IN": ["kannada", "ಕನ್ನಡ"],
        "mr-IN": ["marathi", "मराठी"], "bn-IN": ["bengali", "বাংলা"],
        "gu-IN": ["gujarati", "ગુજરાતી"], "pa-IN": ["punjabi", "ਪੰਜਾਬੀ"],
        "ml-IN": ["malayalam", "മലയാളം"], "or-IN": ["odia", "ଓଡ଼ିଆ"],
        "en-IN": ["english"]
    };
    const switchKw = ["switch", "change", "speak", "बोलो", "మాట్లాడు", "बदलो"];
    if (switchKw.some(k => p.includes(k))) {
        for (const [code, keywords] of Object.entries(langMap)) {
            if (keywords.some(kw => p.includes(kw))) {
                return { intent: "change_language", reply: "", action: "none", language: code, itemId: null };
            }
        }
    }

    const isVehicle = vehicleKw.some(k => p.includes(k));
    const isBook = bookKw.some(k => p.includes(k));

    const replies: Record<string, Record<string, string>> = {
        book_vehicle: { "hi-IN": "नज़दीकी वाहन बुक कर रहा हूँ।", "te-IN": "సమీపంలోని వాహనాన్ని బుక్ చేస్తున్నాను.", "ta-IN": "அருகிலுள்ள வாகனம் பதிவு செய்கிறேன்.", "kn-IN": "ಹತ್ತಿರದ ವಾಹನ ಬುಕ್ ಮಾಡುತ್ತಿದ್ದೇನೆ.", "mr-IN": "जवळचे वाहन बुक करत आहे.", "bn-IN": "কাছের যানবাহন বুক করছি।", "gu-IN": "નજીકનું વાહન બુક કરી રહ્યો છું.", "pa-IN": "ਨਜ਼ਦੀਕੀ ਵਾਹਨ ਬੁੱਕ ਕਰ ਰਿਹਾ ਹਾਂ।", "ml-IN": "അടുത്ത വാഹനം ബുക്ക് ചെയ്യുന്നു.", "or-IN": "ଆଶପାଶ ଗାଡ଼ି ବୁକ୍ ହେଉଛି।", "default": "Booking nearest transport for you." },
        navigate_vehicle: { "hi-IN": "पास के वाहन खोज रहा हूँ।", "te-IN": "సమీపంలోని వాహనాలు చూపిస్తున్నాను.", "ta-IN": "அருகிலுள்ள வாகனங்கள் காட்டுகிறேன்.", "kn-IN": "ಹತ್ತಿರದ ವಾಹನಗಳನ್ನು ತೋರಿಸುತ್ತಿದ್ದೇನೆ.", "mr-IN": "जवळची वाहने दाखवत आहे.", "bn-IN": "কাছের যানবাহন দেখাচ্ছি।", "gu-IN": "નજીકના વાહનો બતાવી રહ્યો છું.", "pa-IN": "ਨਜ਼ਦੀਕੀ ਵਾਹਨ ਦਿਖਾ ਰਿਹਾ ਹਾਂ।", "ml-IN": "അടുത്ത വാഹനങ്ങൾ കാണിക്കുന്നു.", "or-IN": "ପାଖ ଗାଡ଼ି ଦେଖୁଛି।", "default": "Finding nearby transport vehicles." },
        book_storage: { "hi-IN": "गोदाम बुक करने के लिए ले जा रहा हूँ।", "te-IN": "గోదాము బుక్ చేయడానికి తీసుకెళ్తున్నాను.", "ta-IN": "கிடங்கு பதிவு செய்ய அழைத்துச் செல்கிறேன்.", "kn-IN": "ಗೋದಾಮು ಬುಕ್ ಮಾಡಲು ಕರೆದೊಯ್ಯುತ್ತಿದ್ದೇನೆ.", "mr-IN": "गोदाम बुक करण्यासाठी नेत आहे.", "bn-IN": "গুদাম বুক করতে নিয়ে যাচ্ছি।", "gu-IN": "ગોડાઉન બુક કરવા લઈ જઈ રહ્યો છું.", "pa-IN": "ਗੋਦਾਮ ਬੁੱਕ ਕਰਨ ਲਈ ਲੈ ਜਾ ਰਿਹਾ ਹਾਂ।", "ml-IN": "ഗോഡൗൺ ബുക്ക് ചെയ്യാൻ കൊണ്ടുപോകുന്നു.", "or-IN": "ଗୋଦାମ ବୁକ୍ ପାଇଁ ଯାଉଛୁ।", "default": "Taking you to book the nearest warehouse." },
        general: { "hi-IN": "गोदाम या वाहन बुक करना है?", "te-IN": "గోదాము లేదా వాహనం బుక్ చేయాలా?", "ta-IN": "கிடங்கு அல்லது வாகனம் பதிவு செய்யணுமா?", "kn-IN": "ಗೋದಾಮು ಅಥವಾ ವಾಹನ ಬುಕ್ ಮಾಡಬೇಕೇ?", "mr-IN": "गोदाम किंवा वाहन बुक करायचे आहे का?", "bn-IN": "গুদাম বা গাড়ি বুক করবেন?", "gu-IN": "ગોડાઉન કે વાહન બુક કરવું છે?", "pa-IN": "ਗੋਦਾਮ ਜਾਂ ਵਾਹਨ ਬੁੱਕ ਕਰਨਾ ਹੈ?", "ml-IN": "ഗോഡൗൺ അല്ലെങ്കിൽ വാഹനം ബുക്ക് ചെയ്യണോ?", "or-IN": "ଗୋଦାମ ବା ଗାଡ଼ି ବୁକ୍ କରିବ?", "default": "Would you like a warehouse or vehicle?" }
    };

    const getReply = (key: string) => replies[key][lang] || replies[key]["default"];

    if (isVehicle && isBook) {
        const itemId = topVehicles.length > 0 ? topVehicles[0].id : null;
        return { intent: "get_vehicle", reply: getReply("book_vehicle"), action: itemId ? "book_vehicle" : "navigate_vehicle", language: lang, itemId };
    } else if (isVehicle) {
        return { intent: "get_vehicle", reply: getReply("navigate_vehicle"), action: "navigate_vehicle", language: lang, itemId: null };
    } else if (isBook) {
        const itemId = topWarehouses.length > 0 ? topWarehouses[0].id : null;
        return { intent: "find_storage", reply: getReply("book_storage"), action: itemId ? "redirect_payment" : "navigate_storage", language: lang, itemId };
    }
    return { intent: "unknown", reply: getReply("general"), action: "none", language: lang, itemId: null };
}

export async function POST(req: Request) {
    let requestData: any = {};
    try {
        requestData = await req.json();
    } catch {
        return NextResponse.json({ intent: "error_fallback", reply: "Invalid request.", action: "none" });
    }

    const { prompt, location, language, state } = requestData;
    const userLang = language || "hi-IN";

    const { db } = require('@/lib/db');
    let nearbyInfo = "No location provided.";
    let topWarehouses: any[] = [];
    let topVehicles: any[] = [];
    if (location?.lat && location?.lng) {
        topWarehouses = db.warehouses
            .map((w: any) => ({ ...w, distance: calculateDistance(location.lat, location.lng, w.latitude, w.longitude) }))
            .sort((a: any, b: any) => a.distance - b.distance).slice(0, 3);
        topVehicles = db.vehicles
            .map((v: any) => ({ ...v, distance: calculateDistance(location.lat, location.lng, v.latitude, v.longitude) }))
            .sort((a: any, b: any) => a.distance - b.distance).slice(0, 3);
        nearbyInfo = `Warehouses: ${JSON.stringify(topWarehouses.map((w: any) => ({ id: w.id, name: w.name, capacity: w.available_capacity_tons, dist_km: w.distance.toFixed(1) })))}
Vehicles: ${JSON.stringify(topVehicles.map((v: any) => ({ id: v.id, type: v.vehicle_type, number: v.vehicle_number, dist_km: v.distance.toFixed(1) })))}`;
    }

    if (process.env.DEMO_MODE === "true" || !process.env.GEMINI_API_KEY) {
        const result = offlineNLP(prompt || "", userLang, topWarehouses, topVehicles);
        return NextResponse.json({ ...result, confidence: 70, updated_state: state || {} });
    }

    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            generationConfig: { responseMimeType: "application/json" }
        });

        const systemContext = `
You are Krishi Assistant, a multilingual agricultural voice assistant for Indian farmers.

Supported languages: Hindi, Telugu, Tamil, Kannada, Marathi, Bengali, Gujarati, Punjabi, Malayalam, Odia, English.

MUST follow:
1. Detect language automatically from user input.
2. If uncertain, use preferred language: ${LANGUAGE_NAMES[userLang] || "Hindi"} (${userLang}).
3. Respond ONLY in detected language. NEVER mix languages.
4. Reply max 20 words. Simple vocabulary for rural farmers.
5. Guide farmer to book warehouse or vehicle, ask for missing info step by step.
6. Return ONLY structured JSON below.

Intents: find_storage, select_storage, collect_crop, collect_duration, confirm_booking, get_vehicle, extend_booking, change_language, unknown
Actions: none, navigate_storage, navigate_vehicle, redirect_payment, book_vehicle

User location: ${location ? `${location.lat}, ${location.lng}` : "Unknown"}
Nearby: ${nearbyInfo}
Session state: ${JSON.stringify(state || {})}

Language codes: {"hi-IN":"Hindi","te-IN":"Telugu","ta-IN":"Tamil","kn-IN":"Kannada","mr-IN":"Marathi","bn-IN":"Bengali","gu-IN":"Gujarati","pa-IN":"Punjabi","ml-IN":"Malayalam","or-IN":"Odia","en-IN":"English"}

Return ONLY this JSON (no other text):
{
  "intent": "string",
  "reply": "string (detected language, max 20 words)",
  "language": "detected language code",
  "required_fields": [],
  "action": "string",
  "next_step": "string",
  "confidence": 0-100,
  "updated_state": { "step": "string", "selectedWarehouse": null, "cropType": null, "tons": null, "duration": null },
  "itemId": "id or null"
}

Rules:
- redirect_payment → itemId = warehouse id
- book_vehicle → itemId = vehicle id
- "Switch to [language]" → intent=change_language, language=new code
- Do not output anything outside JSON.
`;

        const result = await model.generateContent(systemContext + "\nUser: " + prompt);
        let text = result.response.text();
        let parsed: any;
        try {
            parsed = JSON.parse(text);
        } catch {
            parsed = { intent: "unknown", reply: "कृपया स्पष्ट बताएं।", language: userLang, required_fields: [], action: "none", next_step: "retry", confidence: 0, updated_state: state || {} };
        }
        return NextResponse.json(parsed);
    } catch (error: any) {
        console.error("Gemini AI Error:", error.message || error);
        const result = offlineNLP(prompt || "", userLang, topWarehouses, topVehicles);
        return NextResponse.json({ ...result, confidence: 60, updated_state: state || {} });
    }
}
