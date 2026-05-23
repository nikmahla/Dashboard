import { NextResponse } from 'next/server';
import { requireAuth } from "@/lib/requireAuth";



let tasks = [
  {
    id: 1,
    title: 'Restock inventory for "Best Seller" items',
    completed: false,
    priority: 'high',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    title: 'Review 5 pending customer refund requests',
    completed: true,
    priority: 'medium',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 3,
    title: 'Update monthly sales report for the board',
    completed: false,
    priority: 'medium',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 4,
    title: 'Finalize summer collection descriptions',
    completed: false,
    priority: 'low',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 5,
    title: 'Fix broken image link on "About Us" page',
    completed: true,
    priority: 'low',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Simulate DB delay
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));


export async function GET(req: Request) {
  const auth = await requireAuth(req);
  if (!auth.ok) return auth.res;

  await delay(300);
  return NextResponse.json(tasks);
}


export async function POST(req: Request) {
  const auth = await requireAuth(req);
  if (!auth.ok) return auth.res;

  await delay(300);
  const body = await req.json();

  const newTask = {
    id: Date.now(),
    title: body.title ?? 'Untitled Task',
    completed: false,
    priority: body.priority ?? 'medium',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  tasks.unshift(newTask);

  return NextResponse.json(newTask, { status: 201 });
}

// ------------------------------
// PUT → update a task
// ------------------------------
export async function PUT(req: Request) {
  const auth = await requireAuth(req);
  if (!auth.ok) return auth.res;

  await delay(300);
  const body = await req.json();

  const index = tasks.findIndex((t) => t.id === body.id);
  if (index === -1) {
    return NextResponse.json({ error: 'Task not found' }, { status: 404 });
  }

  tasks[index] = {
    ...tasks[index],
    ...body,
    updatedAt: new Date().toISOString(),
  };

  return NextResponse.json(tasks[index]);
}

export async function DELETE(req: Request) {
  const auth = await requireAuth(req);
  if (!auth.ok) return auth.res;

  await delay(300);

  const { searchParams } = new URL(req.url);
  const id = Number(searchParams.get("id"));
  if (!id) {
    return NextResponse.json({ message: "Missing id" }, { status: 400 });
  }

  tasks = tasks.filter((t) => t.id !== id);

  return NextResponse.json({ success: true });
}