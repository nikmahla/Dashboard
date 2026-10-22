import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/requireAuth";

let orders = [
  { id: 1, customer: "John Doe", total: 120, status: "Completed", date: "2025-01-10" },
  { id: 2, customer: "Sarah Smith", total: 85, status: "Pending", date: "2025-01-12" },
  { id: 3, customer: "Alex Brown", total: 230, status: "Completed", date: "2025-01-15" },
  { id: 4, customer: "Emily Johnson", total: 45, status: "Cancelled", date: "2025-01-18" },
  { id: 5, customer: "David Lee", total: 150, status: "Completed", date: "2025-01-20" },
  { id: 6, customer: "Olivia Wilson", total: 95, status: "Pending", date: "2025-01-22" },
  { id: 7, customer: "Michael Davis", total: 180, status: "Completed", date: "2025-01-25" },
  { id: 8, customer: "Sophia Martinez", total: 70, date: "2025-01-28", status: "Cancelled" },
  { id: 9, customer: "James Anderson", total: 110, status: "Completed", date: "2025-01-30" },
];

export async function GET(req: Request) {
const auth = await requireAuth(req);
  if (!auth.ok) return auth.res;


  const { searchParams } = new URL(req.url);

  const page = Number(searchParams.get("page") ?? "1");
  const pageSize = Number(searchParams.get("pageSize") ?? "10");
  const search = (searchParams.get("search") ?? "").trim().toLowerCase();

  // filter
  let filtered = orders;
  if (search) {
    filtered = orders.filter((o) =>
      o.customer.toLowerCase().includes(search)
    );
  }

  const total = filtered.length;

  // paginate
  const start = (page - 1) * pageSize;
  const data = filtered.slice(start, start + pageSize);

  return NextResponse.json({ data, total });
}

export async function POST(req: Request) {
  const auth = await requireAuth(req);
  if (!auth.ok) return auth.res;

  const body = await req.json();
  const newItem = {
    id: Date.now(),
    customer: body.customer,
    total: Number(body.total) || 0,
    status: body.status || "Pending",
    date: body.date || new Date().toISOString().slice(0, 10),
  };
  orders.unshift(newItem);
  return NextResponse.json(newItem, { status: 201 });
}


export async function PUT(req: Request) {
  const auth = await requireAuth(req);
  if (!auth.ok) return auth.res;

  const body = await req.json();
  const id = Number(body.id);

  const idx = orders.findIndex((o) => o.id === id);
  if (idx === -1) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  orders[idx] = { ...orders[idx], ...body, total: Number(body.total) || 0 };
  return NextResponse.json(orders[idx]);
}


export async function DELETE(req: Request) {
  const auth = await requireAuth(req );
  if (!auth.ok) return auth.res;

  const { searchParams } = new URL(req.url);
  const id = Number(searchParams.get("id"));
  if (!id) return NextResponse.json({ message: "Missing id" }, { status: 400 });
  orders = orders.filter((o) => o.id !== id);
  return NextResponse.json({ success: true });
}
