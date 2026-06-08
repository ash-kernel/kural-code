import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function POST(req) {
  try {
    const { username, password } = await req.json();
    
    if (username === process.env.ADMIN_USER && password === process.env.ADMIN_PASS) {
      const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '1d' });
      
      const response = NextResponse.json({ success: true });
      response.cookies.set('admin_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/'
      });
      
      return response;
    }
    
    return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
  } catch (err) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
