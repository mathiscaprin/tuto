import jwt from 'jsonwebtoken';
import { secret } from '../consts';
import type { NextApiRequest, NextApiResponse } from 'next'

export function jwtMiddleware(handler : (req : NextApiRequest, res : NextApiResponse) => void) {
  return async (req : NextApiRequest, res : NextApiResponse) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      const decoded = jwt.verify(token, secret);
    } catch (error) {
      return res.status(401).json([]);
    }

    return handler(req, res);
  };
}