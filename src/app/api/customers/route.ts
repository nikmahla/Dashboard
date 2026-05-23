import { NextResponse } from 'next/server';
import { requireAuth } from "@/lib/requireAuth";

let customers = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    orders: 5,
  },
  {
    id: 2,
    name: 'Sarah Smith',
    email: 'sarah@example.com',
    orders: 2,
  },
  {
    id: 3,
    name: 'Alex Brown',
    email: 'alex@example.com',
    orders: 8,
  },
  {
    id: 4,
    name: 'Emily Johnson',
    email: 'emily@example.com',
    orders: 1,
  },
  {
    id: 5,
    name: 'David Lee',
    email: 'david@example.com',
    orders: 4,
  },  
  {
    id: 6,
    name: 'Olivia Wilson',
    email: 'olivia@example.com',
    orders: 3,
  },
  {
    id: 7,
    name: 'Michael Davis',
    email: 'michael@example.com',
    orders: 6,
  },
  {
    id: 8,
    name: 'Sophia Martinez',
    email: 'sophia@example.com',
    orders: 7,
  },

];


export async function POST(req: Request) {
  const auth = await requireAuth(req);
  if (!auth.ok) return auth.res;

  const body = await req.json();
  const newItem = {
    id: Date.now(),
    name: body.name,
    email: body.email,
    orders: Number(body.orders) || 0,
  };
  customers.push(newItem);
  return NextResponse.json(newItem, { status: 201 });
}

export async function PUT(req: Request) {
  const auth = await requireAuth(req);
  if (!auth.ok) return auth.res;

  const body = await req.json();
  const id = Number(body.id);
  const idx = customers.findIndex((c) => c.id === id);
  if (idx === -1) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }
  customers[idx] = { ...customers[idx], ...body, orders: Number(body.orders) };
  return NextResponse.json(customers[idx]);
}

export async function DELETE(req: Request) {
  const auth = await requireAuth(req);
  if (!auth.ok) return auth.res;

  const { searchParams } = new URL(req.url);
  const id = Number(searchParams.get('id'));
  if (!id) return NextResponse.json({ message: 'Missing id' }, { status: 400 });
  customers = customers.filter((c) => c.id !== id);
  return NextResponse.json({ success: true });
}
export async function GET(req: Request) {
  const auth = await requireAuth(req);
  if (!auth.ok) return auth.res;

  const   { searchParams } = new URL(req.url);

  const search = (searchParams.get("search") || "").toLowerCase();
  const page = Number(searchParams.get("page") || 1);
  const pageSize = Number(searchParams.get("pageSize") || 10);

  let filtered = customers;

  if (search) {
    filtered = customers.filter((c) => {
      return (
        c.name.toLowerCase().includes(search) ||
        c.email.toLowerCase().includes(search)
      );
    });
  }

  const total = filtered.length;
  const start = (page - 1) * pageSize;
  const data = filtered.slice(start, start + pageSize);

  return NextResponse.json({ data, total });
}
