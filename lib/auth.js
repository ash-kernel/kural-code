import ApiKey from '@/models/ApiKey';
import jwt from 'jsonwebtoken';

const rateLimitMap = new Map();

function rateLimit(request, limit = 30, windowMs = 3600000, gapMs = 120000) {
  const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
  const now = Date.now();
  
  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, { count: 1, lastRequest: now, windowStart: now });
    return { success: true };
  }

  const record = rateLimitMap.get(ip);

  if (now - record.lastRequest < gapMs) {
    return { success: false, error: 'Strict Rate Limit: 2 minute gap required per request for public access.' };
  }

  if (now - record.windowStart > windowMs) {
    record.count = 1;
    record.windowStart = now;
    record.lastRequest = now;
    return { success: true };
  }

  if (record.count >= limit) {
    return { success: false, error: 'Strict Rate Limit: Maximum 30 requests per hour allowed for public access.' };
  }

  record.count += 1;
  record.lastRequest = now;
  return { success: true };
}

export async function enforcePublicRateLimits(req) {
  const rateStatus = rateLimit(req);
  if (!rateStatus.success) {
    return { authorized: false, error: rateStatus.error, status: 429 };
  }
  return { authorized: true };
}

export async function enforcePaidAuth(req) {
  const apiKey = req.headers.get('x-api-key') || req.nextUrl.searchParams.get('api_key');
  
  if (!apiKey) {
    return { authorized: false, error: 'API Key is required for paid access.', status: 401 };
  }

  const keyDoc = await ApiKey.findOne({ key: apiKey, active: true });
  if (!keyDoc) {
    return { authorized: false, error: 'Invalid or revoked API Key.', status: 401 };
  }

  if (keyDoc.expiresAt && new Date() > keyDoc.expiresAt) {
    return { authorized: false, error: 'API Key has expired.', status: 401 };
  }
  
  return { authorized: true };
}

export async function verifyAdminAuth(req) {
  const token = req.cookies.get('admin_token')?.value;
  if (!token) return false;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    return decoded.role === 'admin';
  } catch {
    return false;
  }
}
