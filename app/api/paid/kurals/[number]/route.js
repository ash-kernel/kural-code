import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Kural from '@/models/Kural';
import { enforcePaidAuth } from '@/lib/auth';

export async function GET(req, { params }) {
  await dbConnect();

  const auth = await enforcePaidAuth(req);
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const number = parseInt(params.number);
    const kural = await Kural.findOne({ Number: number });
    if (!kural) return NextResponse.json({ error: 'Kural not found' }, { status: 404 });
    return NextResponse.json(kural);
  } catch (err) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
