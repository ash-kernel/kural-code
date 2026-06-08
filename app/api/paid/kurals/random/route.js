import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Kural from '@/models/Kural';
import { enforcePaidAuth } from '@/lib/auth';

export async function GET(req) {
  await dbConnect();

  const auth = await enforcePaidAuth(req);
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const count = await Kural.countDocuments();
    const random = Math.floor(Math.random() * count);
    const kural = await Kural.findOne().skip(random);
    return NextResponse.json(kural);
  } catch (err) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
