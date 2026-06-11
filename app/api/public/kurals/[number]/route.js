import { NextResponse } from 'next/server';
import { getKuralByNumber } from '@/lib/kuralData';
import { enforcePublicRateLimits } from '@/lib/auth';

export async function GET(req, { params }) {
  const auth = await enforcePublicRateLimits(req);
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const { number: paramNumber } = await params;
    const number = parseInt(paramNumber);
    const kural = getKuralByNumber(number);
    if (!kural) return NextResponse.json({ error: 'Kural not found' }, { status: 404 });
    return NextResponse.json(kural);
  } catch (err) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
