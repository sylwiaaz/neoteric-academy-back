import 'dotenv/config';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import AuthTokenMissingException from '../exceptions/authTokenMissingException';
import WrongAuthTokenException from '../exceptions/wrongAuthTokenException';
import DataStoredInToken from '../interfaces/dataStoredInToken.interface';
import RequestWithUser from '../interfaces/requestWithUser.interface';
import userModel from '../users/user.model';

async function authMiddleware(requestWithUser: Request, response: Response, next: NextFunction) {
  const req = requestWithUser as RequestWithUser;
  const cookies = req.cookies;
  if (cookies && cookies.Authorization) {
    const secret: string = (process.env.JWT_SECRET as string);
    try {
      const verificationResponse = jwt.verify(cookies.Authorization, secret) as DataStoredInToken;
      const id = verificationResponse._id;
      const user = await userModel.findById(id);
      if (user) {
        req.user = user;
        next();
      } else {
        next(new WrongAuthTokenException());
      }
    } catch (error) {
      next(new WrongAuthTokenException());
    }
  } else {
    next(new AuthTokenMissingException());
  }
}

export default authMiddleware;
