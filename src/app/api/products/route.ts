import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/requireAuth";


let products = [
  { id: 1, name: "MacBook Pro", price: 1999, status: "In Stock" },
  { id: 2, name: "iPhone 15", price: 999, status: "Out of Stock" },
];

export async function GET(req: Request) {
  const auth = await requireAuth(req);
  if (!auth.ok) return auth.res;


  const { searchParams } = new URL(req.url);

  const page = Number(searchParams.get("page") ?? "1");
  const pageSize = Number(searchParams.get("pageSize") ?? "10");
  const search = (searchParams.get("search") ?? "").trim().toLowerCase();

  let filtered = products;
  if (search) {
    filtered = products.filter((p) => p.name.toLowerCase().includes(search));
  }

  const total = filtered.length;
  const start = (page - 1) * pageSize;
  const data = filtered.slice(start, start + pageSize);

  return NextResponse.json({ data, total });
}

export async function POST(request: Request) {
  const auth = await requireAuth(request);
  if (!auth.ok) return auth.res;

  const body = await request.json();

  const newProduct = {
    id: Date.now(),
    name: body.name,
    price: Number(body.price) || 0,
    status: body.status || "In Stock",
  };

  products.unshift(newProduct);
  return NextResponse.json(newProduct, { status: 201 });
}

export async function PUT(request: Request) {
  const auth = await requireAuth(request);
  if (!auth.ok) return auth.res;

  const body = await request.json();
  const id = Number(body.id);
  const idx = products.findIndex((p) => p.id === id);
  if (idx === -1) return NextResponse.json({ message: "Not found" }, { status: 404 });

  products[idx] = { ...products[idx], ...body, price: Number(body.price) || 0 };
  return NextResponse.json(products[idx]);
}

export async function DELETE(request: Request) {
  const auth = await requireAuth(request);
  if (!auth.ok) return auth.res;

  const { searchParams } = new URL(request.url);
  const id = Number(searchParams.get("id"));
  products = products.filter((p) => p.id !== id);
  return NextResponse.json({ success: true });
}