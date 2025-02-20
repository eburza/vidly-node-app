import type { Request, Response, NextFunction } from 'express';

function error(err: Error, req: Request, res: Response, next: NextFunction) {
  res.status(500).send('Something failed');
}

module.exports = error;