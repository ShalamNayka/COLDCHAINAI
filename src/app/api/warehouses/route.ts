import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
    return NextResponse.json(db.warehouses);
}

export async function POST(req: Request) {
    try {
        const data = await req.json();
        const newWarehouse = {
            id: Date.now().toString(),
            ...data,
            available_capacity_tons: data.total_capacity_tons
        };
        db.warehouses.push(newWarehouse);
        return NextResponse.json(newWarehouse);
    } catch (error) {
        return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }
}
