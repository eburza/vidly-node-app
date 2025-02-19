const jwt =  require('jsonwebtoken');
const config =  require('config');
import type { Request, Response, NextFunction } from 'express';

//middleware function to check if the user is authenticated
function auth(req: Request, res: Response, next: NextFunction) {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).send('Access denied. No token provided.');

  try {
    //verify the token, decode the token and add the user to the request object
    const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
    req.user = decoded;
    next();
  }
  catch (ex) {
    //if the token is invalid, return a 400 error
    res.status(400).send('Invalid token.');
  }
}

module.exports = auth;
