import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
    return NextResponse.json(db.vehicles);
}

export async function POST(req: Request) {
    try {
        const data = await req.json();
        const newVehicle = {
            id: Date.now().toString(),
            ...data,
        };
        db.vehicles.push(newVehicle);
        return NextResponse.json(newVehicle);
    } catch (error) {
        return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }
}
