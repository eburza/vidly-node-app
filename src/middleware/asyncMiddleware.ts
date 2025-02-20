import type { Request, Response, NextFunction } from 'express';
import type { RouteHandler } from '../interfaces';

function asyncMiddleware(routeHandler: RouteHandler) {
  return async (req: Request, res: Response, next: NextFunction) =>{
    try {
      await routeHandler(req, res);
    }
    catch (ex) {
      next(ex);
    }
  }
};

module.exports = asyncMiddleware;