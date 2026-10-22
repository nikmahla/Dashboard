import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/requireAuth";

let users = [
  { id: 1, name: "Alice Johnson", email: "alice@example.com", role: "Admin" },
  { id: 2, name: "Bob Smith", email: "bob@example.com", role: "Editor" },
  { id: 3, name: "Charlie Brown", email: "charlie@example.com", role: "Viewer" },
  { id: 4, name: "David Lee", email: "david@example.com", role: "Viewer" },
  { id: 5, name: "Emily Davis", email: "emily@example.com", role: "Editor" },
];

export async function GET(req: Request) {
  const auth = await requireAuth(req);
  if (!auth.ok) return auth.res;

  return NextResponse.json(users);
}

export async function POST(req: Request) {
  const auth = await requireAuth(req);
  if (!auth.ok) return auth.res;

  const body = await req.json();

  const newUser = {
    id: Date.now(),
    name: body.name,
    email: body.email,
    role: body.role ?? "Viewer",
  };

  users.unshift(newUser);
  return NextResponse.json(newUser, { status: 201 });
}

export async function PUT(req: Request) {
  const auth = await requireAuth(req);
  if (!auth.ok) return auth.res;

  const body = await req.json();
  const id = Number(body.id);

  const idx = users.findIndex((u) => u.id === id);
  if (idx === -1) return NextResponse.json({ message: "Not found" }, { status: 404 });

  users[idx] = { ...users[idx], ...body };
  return NextResponse.json(users[idx]);
}

export async function DELETE(req: Request) {
  const auth = await requireAuth(req);
  if (!auth.ok) return auth.res;

  const { searchParams } = new URL(req.url);
  const id = Number(searchParams.get("id"));
  if (!id) return NextResponse.json({ message: "Missing id" }, { status: 400 });

  users = users.filter((u) => u.id !== id);
  return NextResponse.json({ success: true });
}