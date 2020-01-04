import bcrypt from 'bcrypt';
import 'dotenv/config';
import express from 'express';
import DataStoredInToken from 'interfaces/dataStoredInToken.interface';
import TokenData from 'interfaces/tokenData.interface';
import jwt, { Secret } from 'jsonwebtoken';
import User from 'users/user.interface';
import UserWithEmailAlreadyExistedException from '../exceptions/userWithEmailAlreadyExistedException';
import WrongCredentialsException from '../exceptions/wrongCredentialsException';
import Controller from '../interfaces/controller.interface';
import userModel from './../users/user.model';

class AuthenticationController implements Controller {
  public path = '/auth';
  public router = express.Router();

  private user = userModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/register`, this.registration);
    this.router.post(`${this.path}/login`, this.loggingIn);
    this.router.post(`${this.path}/logout`, this.loggingOut);
  }

  private registration = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
    const userData = request.body;
    if (
      await this.user.findOne({ email: userData.email })
    ) {
      next(new UserWithEmailAlreadyExistedException(userData.email));
    } else {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = await this.user.create({
        ...userData,
        password: hashedPassword,
        // token: '',
      });
      user.password = '';
      response.send(user);
    }
  }

  private loggingIn = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
    const logInData = request.body;
    const user = await this.user.findOne({ email: logInData.email });
    if (user) {
      const isPasswordMatching = await bcrypt.compare(logInData.password, user.password);
      if (isPasswordMatching) {
        user.password = '';
        const tokenData = this.createToken(user);
        // const updatedUser = await this.user
        // .findOneAndUpdate({ _id: user._id }, { token: tokenData.token });

        response.setHeader('Set-Cookie', [this.createCookie(tokenData)]);
        // response.send({updatedUser});
        response.send({user, tokenData});
      } else {
        next(new WrongCredentialsException());
      }
    } else {
      next(new WrongCredentialsException());
    }
  }

  private loggingOut = async (request: express.Request, response: express.Response) => {
    response.setHeader('Set-Cookie', ['Authorization=;Max-age=0']);
    response.sendStatus(200);
  }

  private createCookie(tokenData: TokenData) {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}; path=/`;
  }

  private createToken(user: User): TokenData {
    const expiresIn = 60 * 60;
    const secret: string = (process.env.JWT_SECRET as string);
    const dataStoredInToken: DataStoredInToken = {
      _id: user._id,
    };
    return {
      expiresIn,
      token: jwt.sign(dataStoredInToken, secret, { expiresIn }),
    };
  }
}

export default AuthenticationController;
