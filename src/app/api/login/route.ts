import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { email, password } = await req.json();

  if (email !== 'admin@test.com' || password !== '123456') {
    return NextResponse.json({ message: 'Invalid' }, { status: 401 });
  }

  return NextResponse.json({ token: 'fake-token-123' });
}
