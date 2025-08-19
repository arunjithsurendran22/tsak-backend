import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';

export default function verifyAppProxy(req: Request, res: Response, next: NextFunction) {
  const { signature, ...params } = req.query as Record<string, string>;
  if (!signature) return res.status(401).json({ error: 'Missing signature' });

  const data = Object.keys(params).sort().map(k => `${k}=${params[k]}`).join('');
  const digest = crypto.createHmac('sha256', process.env.SHOPIFY_API_SECRET as string)
    .update(data).digest('hex');

  try {
    if (crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest))) return next();
  } catch (_) {}
  return res.status(401).json({ error: 'Invalid signature' });
}
