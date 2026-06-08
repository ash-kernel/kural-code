import { NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/auth';

export async function GET(req) {
  const isAdmin = await verifyAdminAuth(req);
  if (isAdmin) {
    return NextResponse.json({ authenticated: true });
  }
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
