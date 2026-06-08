import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import ApiKey from '@/models/ApiKey';
import { verifyAdminAuth } from '@/lib/auth';
import crypto from 'crypto';

export async function GET(req) {
  const isAdmin = await verifyAdminAuth(req);
  if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await dbConnect();
  try {
    const keys = await ApiKey.find().sort({ createdAt: -1 });
    return NextResponse.json(keys);
  } catch (err) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req) {
  const isAdmin = await verifyAdminAuth(req);
  if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await dbConnect();
  try {
    const { name, duration } = await req.json();
    if (!name) return NextResponse.json({ error: 'Key name required' }, { status: 400 });
    
    let expiresAt = null;
    if (duration && duration !== 'forever') {
      const days = parseInt(duration);
      if (!isNaN(days)) {
        expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + days);
      }
    }

    const key = 'ak_' + crypto.randomBytes(24).toString('hex');
    const newKey = await ApiKey.create({ name, key, active: true, expiresAt });
    
    return NextResponse.json(newKey, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
