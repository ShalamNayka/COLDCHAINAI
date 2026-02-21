import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const resolvedParams = await params;
        const bookingId = resolvedParams.id;
        const { extend_days } = await req.json();

        const booking = db.bookings.find(b => b.id === bookingId);
        if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });

        booking.duration_days += extend_days;

        return NextResponse.json(booking);
    } catch (error) {
        return NextResponse.json({ error: "Failed to extend booking" }, { status: 500 });
    }
}
