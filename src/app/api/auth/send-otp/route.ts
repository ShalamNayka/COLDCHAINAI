import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { phone } = await req.json();
        if (!phone) return NextResponse.json({ error: "Phone required" }, { status: 400 });

        // In demo, we just simulate sending OTP
        return NextResponse.json({ success: true, message: "OTP sent to " + phone });
    } catch (error) {
        return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 });
    }
}
