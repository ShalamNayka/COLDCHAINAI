import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
    try {
        const { phone, otp, role } = await req.json();

        if (otp !== "1234") {
            return NextResponse.json({ error: "Invalid OTP. Use 1234 for demo." }, { status: 401 });
        }

        let user = db.users.find(u => u.phone_number === phone);
        if (!user) {
            if (!role) {
                return NextResponse.json({ error: "Role required for new user registration." }, { status: 400 });
            }
            user = { id: Date.now().toString(), phone_number: phone, role: role, name: "New User" };
            db.users.push(user);
        }

        // Return mock token and user
        return NextResponse.json({ success: true, token: "mock-token-123", user });
    } catch (error) {
        return NextResponse.json({ error: "Failed to verify OTP" }, { status: 500 });
    }
}
