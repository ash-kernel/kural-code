import { NextResponse } from 'next/server';
import { getKurals } from '@/lib/kuralData';
import { enforcePublicRateLimits } from '@/lib/auth';

export async function GET(req) {
  const auth = await enforcePublicRateLimits(req);
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const page = parseInt(req.nextUrl.searchParams.get('page')) || 1;
  const limit = parseInt(req.nextUrl.searchParams.get('limit')) || 10;

  try {
    const result = getKurals(page, limit);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
