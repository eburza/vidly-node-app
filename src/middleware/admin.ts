import type { Request, Response, NextFunction } from 'express';

//middleware function to check if the user is an admin
function admin(req: Request, res: Response, next: NextFunction) {
  if (!req.user.isAdmin) return res.status(403).send('Access denied.');
  next();
}

module.exports = admin;
