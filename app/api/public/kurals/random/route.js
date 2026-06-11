import { NextResponse } from 'next/server';
import { getRandomKural } from '@/lib/kuralData';
import { enforcePublicRateLimits } from '@/lib/auth';

export async function GET(req) {
  const auth = await enforcePublicRateLimits(req);
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const kural = getRandomKural();
    return NextResponse.json(kural);
  } catch (err) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
