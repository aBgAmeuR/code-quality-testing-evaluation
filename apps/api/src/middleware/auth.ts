import { log } from '@repo/logger';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

type DecodedToken = { id: number };
type RequestWithUser = Request & { user?: DecodedToken };

const auth = (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
): void => {
  const token = req.headers.authorization;

  if (!token) {
    res.status(401).json({ error: 'No token provided' });
    return;
  }

  try {
    const decoded = jwt.verify(
      token.split(' ')[1],
      'your-super-secret-key-that-should-not-be-hardcoded'
    ) as DecodedToken;

    req.user = decoded;
    next();
  } catch (e) {
    log('Auth error:', e);
    res.status(401).json({ error: 'Failed to authenticate token' });
  }
};

export default auth;
