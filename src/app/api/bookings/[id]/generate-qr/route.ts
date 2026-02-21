import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import QRCode from "qrcode";

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> } // In Next.js App Router, params acts as a Promise containing the fields
) {
    try {
        const resolvedParams = await params;
        const bookingId = resolvedParams.id;
        const { aadhar_number } = await req.json();

        const booking = db.bookings.find(b => b.id === bookingId);
        if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });

        const warehouse = db.warehouses.find(w => w.id === booking.warehouse_id);
        const farmer = db.users.find(u => u.id === booking.farmer_id);

        // Generate QR
        const qrData = JSON.stringify({
            farmer: farmer?.name || "Unknown",
            warehouse: warehouse?.name || "Unknown",
            tons: booking.tons,
            duration: booking.duration_days,
            aadhar: aadhar_number
        });

        const qrImage = await QRCode.toDataURL(qrData);

        booking.status = "goods_received";
        booking.qr_code_data_url = qrImage;
        if (farmer) (farmer as any).aadhar_number = aadhar_number;

        return NextResponse.json(booking);
    } catch (error) {
        return NextResponse.json({ error: "Failed to generate QR" }, { status: 500 });
    }
}
