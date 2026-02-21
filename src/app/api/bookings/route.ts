import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const role = searchParams.get('role'); // farmer or warehouse_owner

    if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });

    let userBookings = db.bookings;
    if (role === 'farmer') {
        userBookings = userBookings.filter(b => b.farmer_id === userId);
    } else if (role === 'warehouse_owner') {
        userBookings = userBookings.filter(b => {
            const warehouse = db.warehouses.find(w => w.id === b.warehouse_id);
            return warehouse?.owner_id === userId;
        });
    } else if (role === 'vehicle_provider') {
        userBookings = userBookings.filter(b => {
            const vehicle = db.vehicles.find(v => v.id === b.vehicle_id);
            return vehicle?.provider_id === userId;
        });
    }

    return NextResponse.json(userBookings);
}

export async function POST(req: Request) {
    try {
        const data = await req.json();
        const newBooking = {
            id: Date.now().toString(),
            ...data,
            status: "pending_payment",
            created_at: new Date().toISOString()
        };
        db.bookings.push(newBooking);

        // Subtract capacity if it's a warehouse booking
        if (data.warehouse_id) {
            const warehouse = db.warehouses.find(w => w.id === data.warehouse_id);
            if (warehouse) {
                warehouse.available_capacity_tons -= data.tons;
            }
        }

        return NextResponse.json(newBooking);
    } catch (error) {
        return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }
}
