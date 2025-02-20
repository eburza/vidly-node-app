import winston from 'winston';
import type { Request, Response, NextFunction } from 'express';

function error(err: Error, req: Request, res: Response, next: NextFunction) {
  winston.error(err.message, err);
  res.status(500).send('Something failed');
}

module.exports = error;