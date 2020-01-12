import bcrypt from 'bcrypt';
import 'dotenv/config';
import express from 'express';
import WrongCredentialsException from '../exceptions/wrongCredentialsException';
import Controller from '../interfaces/controller.interface';
import userModel from './../users/user.model';
import AuthenticationService from './authentication.service';

class AuthenticationController implements Controller {
  public path = '/auth';
  public router = express.Router();
  public authenticationService = new AuthenticationService();
  public user = userModel;

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.post(`${this.path}/register`, this.registration);
    this.router.post(`${this.path}/login`, this.loggingIn);
    this.router.post(`${this.path}/logout`, this.loggingOut);
  }

  private registration = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
    const userData = request.body;
    try {
      const {
        user,
      } = await this.authenticationService.register(userData);
      response.send(user);
    } catch (error) {
      next(error);
    }
  }

  private loggingIn = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
    const logInData = request.body;
    const user = await this.user.findOne({ email: logInData.email });
    if (user) {
      const isPasswordMatching = await bcrypt.compare(logInData.password, user.password);
      if (isPasswordMatching) {
        user.password = '';
        const tokenData = this.authenticationService.createToken(user);
        response.setHeader('Set-Cookie', [this.authenticationService.createCookie(tokenData)]);
        response.send({ user, tokenData });
      } else {
        next(new WrongCredentialsException());
      }
    } else {
      next(new WrongCredentialsException());
    }
  }

  private loggingOut = async (request: express.Request, response: express.Response) => {
    response.setHeader('Set-Cookie', ['Authorization=;Max-age=0;path=/']);
    response.send({ message: 'user is logged out' });
  }
}

export default AuthenticationController;
