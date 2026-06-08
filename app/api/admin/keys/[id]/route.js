import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import ApiKey from '@/models/ApiKey';
import { verifyAdminAuth } from '@/lib/auth';

export async function DELETE(req, { params }) {
  const isAdmin = await verifyAdminAuth(req);
  if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await dbConnect();
  try {
    const { id } = await params;
    await ApiKey.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
