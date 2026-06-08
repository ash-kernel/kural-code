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

  const page = parseInt(req.nextUrl.searchParams.get('page')) || 1;
  const limit = parseInt(req.nextUrl.searchParams.get('limit')) || 10;
  const skip = (page - 1) * limit;

  try {
    const kurals = await Kural.find().sort({ Number: 1 }).skip(skip).limit(limit);
    const total = await Kural.countDocuments();

    return NextResponse.json({
      data: kurals,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    });
  } catch (err) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
