import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const auth = req.headers.get('authorization');
  if (!auth) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json({
    name: 'Admin User',
    email: 'admin@test.com',
    avatar: '',
    theme: 'light',
  });
}
