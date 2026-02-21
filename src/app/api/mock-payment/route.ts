import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import QRCode from "qrcode";

export async function POST(req: Request) {
    try {
        const { bookingId } = await req.json();

        // Simulate delay
        await new Promise((resolve) => setTimeout(resolve, 2000));

        const booking = db.bookings.find(b => b.id === bookingId);
        if (booking) {
            booking.status = "payment_successful";
            booking.transaction_id = "TXN" + Date.now();

            const warehouse = db.warehouses.find(w => w.id === booking.warehouse_id);
            const farmer = db.users.find(u => u.id === booking.farmer_id);

            const qrData = JSON.stringify({
                farmer: farmer?.name || "Unknown",
                warehouse: warehouse?.name || "Unknown",
                tons: booking.tons,
                duration: booking.duration_days,
                txn: booking.transaction_id
            });
            const qrImage = await QRCode.toDataURL(qrData);
            booking.qr_code_data_url = qrImage;
        }

        return NextResponse.json({
            status: "success",
            transaction_id: booking?.transaction_id || "TXN123456789"
        });
    } catch (error) {
        return NextResponse.json({ error: "Payment failed" }, { status: 500 });
    }
}
